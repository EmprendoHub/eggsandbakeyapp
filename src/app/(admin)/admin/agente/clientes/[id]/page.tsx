import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AssignedPublications from "@/app/(admin)/admin/agente/_components/AssignedPublications";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function AgentClientPage({ params }: PageProps) {
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

  const client = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!client) {
    redirect("/admin/agente");
  }

  const publications = await prisma.publication.findMany({
    where: {
      assignedAgentId: session.user.id,
      plan: { clientId: params.id },
    },
    orderBy: { date: "asc" },
  });

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      clientId: params.id,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

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
            Publicaciones asignadas
          </h2>
          <div className="mt-4">
            <AssignedPublications
              publications={publications.map((pub) => ({
                id: pub.id,
                date: dateFormatter.format(pub.date),
                type:
                  pub.type === "POST"
                    ? "Post"
                    : pub.type === "HISTORIA"
                      ? "Historia"
                      : "Reel",
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
