import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./_components/LogoutButton";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

export const dynamic = "force-dynamic";

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

export default async function AgentAdminPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "AGENTE") {
    redirect("/admin");
  }

  const workOrders = await prisma.workOrder.findMany({
    where: { agentId: session.user.id },
    orderBy: { dueDate: "asc" },
    include: {
      client: { select: { id: true, name: true, brandName: true } },
    },
  });

  // Auto-advance PENDIENTE work orders to EN_PROCESO when any matching
  // publication (same client + type) is already EN_PROCESO.
  const publications = await prisma.publication.findMany({
    where: { assignedAgentId: session.user.id },
    select: { status: true, type: true, plan: { select: { clientId: true } } },
  });

  // Build map of clientId|type → statuses from publications
  const pubsByClientType = new Map<string, string[]>();
  publications.forEach((pub) => {
    const clientId = pub.plan?.clientId;
    if (!clientId) return;
    const key = `${clientId}|${pub.type}`;
    const existing = pubsByClientType.get(key) ?? [];
    existing.push(pub.status);
    pubsByClientType.set(key, existing);
  });

  const ordersToAdvance = workOrders
    .filter((order) => {
      if (order.status !== "PENDIENTE") return false;
      const statuses =
        pubsByClientType.get(`${order.clientId}|${order.publicationType}`) ??
        [];
      return statuses.includes("EN_PROCESO");
    })
    .map((o) => o.id);

  if (ordersToAdvance.length > 0) {
    await prisma.workOrder.updateMany({
      where: { id: { in: ordersToAdvance } },
      data: { status: "EN_PROCESO" },
    });
    // Reflect in local array so the page renders the updated status
    ordersToAdvance.forEach((id) => {
      const order = workOrders.find((o) => o.id === id);
      if (order) order.status = "EN_PROCESO";
    });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Panel de agente
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Hola, {session.user.name}
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* ── Work Orders ── */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">
            Mis órdenes de trabajo
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Órdenes asignadas a ti. Actualiza el estado conforme avances.
          </p>

          {workOrders.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">
              No tienes órdenes de trabajo asignadas por ahora.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {workOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          {order.title}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[order.status] ?? ""}`}
                        >
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                          {TYPE_LABEL[order.publicationType] ??
                            order.publicationType}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">
                        {order.client.brandName ?? order.client.name}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Entrega: {dateFormatter.format(order.dueDate)}
                      </p>
                      {order.notes ? (
                        <p className="mt-1 text-xs text-neutral-500 italic">
                          {order.notes}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={`/admin/agente/ordenes/${order.id}`}
                      className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      Ver
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
