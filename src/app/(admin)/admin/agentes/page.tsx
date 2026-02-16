import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import AdminShell from "../_components/AdminShell";
import CreateAgentForm from "./_components/CreateAgentForm";

export const dynamic = "force-dynamic";

async function createAgent(formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return;
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "AGENTE",
    },
  });

  revalidatePath("/admin/agentes");
}

export default async function AdminAgentsPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const agents = await prisma.user.findMany({
    where: { role: "AGENTE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Agentes" subtitle="Gestiona agentes y accesos.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Crear agente
          </h2>
          <CreateAgentForm onCreate={createAgent} />
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Agentes</h2>
          <div className="mt-4 space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-neutral-200 px-4 py-3"
              >
                <p className="text-sm font-semibold text-neutral-900">
                  {agent.name}
                </p>
                <p className="text-xs text-neutral-500">{agent.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
