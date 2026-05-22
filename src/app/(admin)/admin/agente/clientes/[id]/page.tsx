import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function AgentClientPage({ params }: PageProps) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (session.user.role !== "AGENTE") redirect("/admin");

  const client = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!client) redirect("/admin/agente");

  // Mark notifications for this client as read
  await prisma.notification.updateMany({
    where: { userId: session.user.id, clientId: params.id, readAt: null },
    data: { readAt: new Date() },
  });

  // Fetch work orders for this client assigned to the agent
  const workOrders = await prisma.workOrder.findMany({
    where: { agentId: session.user.id, clientId: params.id },
    orderBy: { dueDate: "asc" },
  });

  const TYPE_LABEL: Record<string, string> = {
    POST: "Post",
    HISTORIA: "Historia",
    REEL: "Reel",
    PAUTA: "Pauta",
  };

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Panel de agente
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {client.name}
            </h1>
            <Link
              href="/admin/agente"
              className="mt-1 inline-block text-xs font-semibold text-neutral-500 hover:text-neutral-700"
            >
              ← Volver a clientes
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">
            Órdenes de trabajo
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Selecciona una orden para ver y editar sus publicaciones asignadas.
          </p>
          {workOrders.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">
              No hay órdenes de trabajo para este cliente.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {workOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/agente/ordenes/${order.id}`}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-neutral-900">
                        {order.title}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        {TYPE_LABEL[order.publicationType] ??
                          order.publicationType}
                      </span>
                    </div>
                    <span
                      className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[order.status] ?? ""}`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 text-neutral-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
