import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";
import GlobalCalendarView, {
  type ClientInfo,
  type PublicationInfo,
} from "./_components/GlobalCalendarView";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const clients = await prisma.client.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: {
      contentPlans: {
        include: {
          publicaciones: {
            select: {
              id: true,
              date: true,
              type: true,
              status: true,
              title: true,
              notes: true,
              contentUrl: true,
            },
          },
        },
      },
    },
  });

  const clientList: ClientInfo[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
    active: c.active,
  }));

  const allPublications: PublicationInfo[] = clients.flatMap((client) =>
    client.contentPlans.flatMap((plan) =>
      plan.publicaciones.map((pub) => ({
        id: pub.id,
        date: pub.date.toISOString(),
        type: pub.type as "POST" | "HISTORIA" | "REEL",
        status: pub.status,
        title: pub.title,
        notes: pub.notes,
        contentUrl: pub.contentUrl,
        clientId: client.id,
        clientName: client.name,
        clientActive: client.active,
      })),
    ),
  );

  const activeCount = clients.filter((c) => c.active).length;
  const inactiveCount = clients.filter((c) => !c.active).length;

  return (
    <AdminShell
      title="Calendario de contenido"
      subtitle={`${activeCount} cliente${activeCount !== 1 ? "s" : ""} activo${activeCount !== 1 ? "s" : ""} · ${inactiveCount} inactivo${inactiveCount !== 1 ? "s" : ""} · ${allPublications.length} publicaciones totales`}
    >
      <GlobalCalendarView clients={clientList} publications={allPublications} />
    </AdminShell>
  );
}
