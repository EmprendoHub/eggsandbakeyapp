import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import AdminShell from "../../_components/AdminShell";
import DeleteOrderButton from "./_components/DeleteOrderButton";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

const STATUS_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  COMPLETADA: "Completada",
};

const STATUS_COLOR: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_PROCESO: "bg-orange-100 text-orange-800",
  COMPLETADA: "bg-green-100 text-green-800",
};

const TYPE_LABEL: Record<string, string> = {
  POST: "Post",
  HISTORIA: "Historia",
  REEL: "Reel",
  PAUTA: "Pauta",
};

async function updateStatus(formData: FormData) {
  "use server";
  const { prisma } = await import("@/lib/prisma");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  await prisma.workOrder.update({
    where: { id },
    data: { status: status as "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" },
  });
  revalidatePath("/admin/ordenes");
}

async function deleteOrder(formData: FormData) {
  "use server";
  const { prisma } = await import("@/lib/prisma");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.workOrder.delete({ where: { id } });
  redirect("/admin/ordenes");
}

export default async function OrdenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      agent: { select: { id: true, name: true, email: true } },
      client: { select: { id: true, name: true, brandName: true } },
    },
  });

  if (!order) redirect("/admin/ordenes");

  const NEXT_STATUS: Record<string, string | null> = {
    PENDIENTE: "EN_PROCESO",
    EN_PROCESO: "COMPLETADA",
    COMPLETADA: null,
  };
  const nextStatus = NEXT_STATUS[order.status];

  const NEXT_LABEL: Record<string, string> = {
    EN_PROCESO: "Marcar como En proceso",
    COMPLETADA: "Marcar como Completada",
  };

  return (
    <AdminShell title="Detalle de orden">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Back */}
        <Link
          href="/admin/ordenes"
          className="text-sm text-neutral-400 hover:text-neutral-700"
        >
          ← Volver a órdenes
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {order.title}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[order.status] ?? ""}`}
            >
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="font-medium text-neutral-500">Agente</dt>
              <dd className="mt-0.5 text-neutral-900">{order.agent.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Cliente</dt>
              <dd className="mt-0.5 text-neutral-900">
                {order.client.brandName ?? order.client.name}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">
                Tipo de publicación
              </dt>
              <dd className="mt-0.5 text-neutral-900">
                {TYPE_LABEL[order.publicationType] ?? order.publicationType}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Creada</dt>
              <dd className="mt-0.5 text-neutral-900">
                {dateFormatter.format(order.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Fecha de inicio</dt>
              <dd className="mt-0.5 text-neutral-900">
                {dateFormatter.format(order.startDate)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Fecha de entrega</dt>
              <dd className="mt-0.5 text-neutral-900">
                {dateFormatter.format(order.dueDate)}
              </dd>
            </div>
            {order.notes ? (
              <div className="col-span-2">
                <dt className="font-medium text-neutral-500">Notas</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-neutral-900">
                  {order.notes}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {nextStatus ? (
            <form action={updateStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value={nextStatus} />
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                {NEXT_LABEL[nextStatus]}
              </button>
            </form>
          ) : null}

          <DeleteOrderButton id={order.id} action={deleteOrder} />
        </div>
      </div>
    </AdminShell>
  );
}
