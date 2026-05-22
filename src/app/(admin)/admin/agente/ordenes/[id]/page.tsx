import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AssignedPublications from "@/app/(admin)/admin/agente/_components/AssignedPublications";

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

export default async function AgentOrdenDetailPage({
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
  if (session.user.role !== "AGENTE") redirect("/admin");

  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      agent: { select: { id: true, name: true } },
      client: { select: { id: true, name: true, brandName: true } },
    },
  });

  // Only allow the assigned agent to view their own order
  if (!order || order.agentId !== session.user.id) redirect("/admin/agente");

  // Fetch publications matching this order's client + type assigned to the agent
  const publications = await prisma.publication.findMany({
    where: {
      assignedAgentId: session.user.id,
      type: order.publicationType,
      plan: { clientId: order.clientId },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Orden de trabajo
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {order.title}
            </h1>
            <Link
              href="/admin/agente"
              className="mt-1 inline-block text-xs font-semibold text-neutral-500 hover:text-neutral-700"
            >
              ← Volver
            </Link>
          </div>
          <span
            className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[order.status] ?? ""}`}
          >
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        {/* Order details */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="font-medium text-neutral-500">Cliente</dt>
              <dd className="mt-0.5 text-neutral-900">
                {order.client.brandName ?? order.client.name}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500">Tipo</dt>
              <dd className="mt-0.5 text-neutral-900">
                {TYPE_LABEL[order.publicationType] ?? order.publicationType}
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

        {/* Assigned publications */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">
            Publicaciones asignadas
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Publicaciones de tipo{" "}
            {TYPE_LABEL[order.publicationType] ?? order.publicationType} para{" "}
            {order.client.brandName ?? order.client.name}.
          </p>
          <div className="mt-4">
            <AssignedPublications
              publications={publications.map((pub) => ({
                id: pub.id,
                date: dateFormatter.format(pub.date),
                type: TYPE_LABEL[pub.type] ?? pub.type,
                status: pub.status,
                title: pub.title,
                notes: pub.notes,
                contentUrl: pub.contentUrl,
              }))}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
