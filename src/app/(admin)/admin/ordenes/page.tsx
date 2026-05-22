import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "../_components/AdminShell";

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

export default async function OrdenesPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const orders = await prisma.workOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      agent: { select: { id: true, name: true } },
      client: { select: { id: true, name: true, brandName: true } },
    },
  });

  return (
    <AdminShell
      title="Órdenes de trabajo"
      subtitle="Gestiona y asigna órdenes a los agentes."
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {orders.length} orden(es) en total
        </p>
        <Link
          href="/admin/ordenes/nueva"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          + Nueva orden
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
          <p className="text-neutral-400">No hay órdenes de trabajo todavía.</p>
          <Link
            href="/admin/ordenes/nueva"
            className="mt-4 inline-block rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Crear primera orden
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-100 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {[
                  "Título",
                  "Agente",
                  "Cliente",
                  "Tipo",
                  "Inicio",
                  "Entrega",
                  "Estado",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {order.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {order.agent.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {order.client.brandName ?? order.client.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {TYPE_LABEL[order.publicationType] ?? order.publicationType}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {dateFormatter.format(order.startDate)}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {dateFormatter.format(order.dueDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[order.status] ?? ""}`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/ordenes/${order.id}`}
                      className="text-xs text-neutral-400 hover:text-neutral-900"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
