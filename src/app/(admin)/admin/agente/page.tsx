import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

export default async function AgentAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "AGENTE") {
    redirect("/admin");
  }

  const publications = await prisma.publication.findMany({
    where: { assignedAgentId: session.user.id },
    orderBy: { date: "asc" },
    include: { plan: { include: { client: true } } },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, readAt: null, clientId: { not: null } },
    select: { clientId: true },
  });

  const unreadByClient = notifications.reduce<Record<string, number>>(
    (acc, item) => {
      if (item.clientId) {
        acc[item.clientId] = (acc[item.clientId] || 0) + 1;
      }
      return acc;
    },
    {},
  );

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
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Clientes asignados
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Selecciona un cliente para ver sus publicaciones asignadas.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(() => {
              const clientMap = new Map<
                string,
                { name: string; count: number; lastDate?: Date }
              >();

              publications.forEach((pub) => {
                const client = pub.plan.client;
                if (!client) return;
                const entry = clientMap.get(client.id) ?? {
                  name: client.name,
                  count: 0,
                  lastDate: undefined,
                };
                entry.count += 1;
                entry.lastDate = pub.date;
                clientMap.set(client.id, entry);
              });

              return Array.from(clientMap.entries()).map(([clientId, data]) => (
                <a
                  key={clientId}
                  href={`/admin/agente/clientes/${clientId}`}
                  className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {data.name}
                    </h3>
                    {unreadByClient[clientId] ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        {unreadByClient[clientId]}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {data.count} publicación(es) asignadas
                  </p>
                  {data.lastDate ? (
                    <p className="mt-2 text-xs text-neutral-400">
                      Última fecha: {dateFormatter.format(data.lastDate)}
                    </p>
                  ) : null}
                </a>
              ));
            })()}
          </div>
        </section>
      </main>
    </div>
  );
}
