import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AdminShell from "../../_components/AdminShell";
import NuevaOrdenForm, { type ClientData } from "./_components/NuevaOrdenForm";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const ALL_TYPES = ["POST", "HISTORIA", "REEL", "PAUTA"];

async function createWorkOrder(formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const agentId = String(formData.get("agentId") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const publicationTypes = formData.getAll("publicationType") as string[];
  const monthKey = String(formData.get("monthKey") ?? "").trim(); // "YYYY-MM"
  const startDate = String(formData.get("startDate") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (
    !agentId ||
    !clientId ||
    !publicationTypes.length ||
    !startDate ||
    !dueDate
  ) {
    return;
  }

  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [dy, dm, dd] = dueDate.split("-").map(Number);

  const TYPE_LABEL: Record<string, string> = {
    POST: "Post",
    HISTORIA: "Historia",
    REEL: "Reel",
    PAUTA: "Pauta",
  };

  // Create work order rows
  await prisma.workOrder.createMany({
    data: publicationTypes.map((type) => ({
      title: TYPE_LABEL[type] ?? type,
      agentId,
      clientId,
      publicationType: type as "POST" | "HISTORIA" | "REEL" | "PAUTA",
      startDate: new Date(Date.UTC(sy, sm - 1, sd, 12, 0, 0)),
      dueDate: new Date(Date.UTC(dy, dm - 1, dd, 12, 0, 0)),
      notes: notes || null,
      status: "PENDIENTE",
    })),
  });

  // Assign matching publications to the agent
  if (monthKey) {
    const [my, mm] = monthKey.split("-").map(Number);
    const monthStart = new Date(Date.UTC(my, mm - 1, 1, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(my, mm, 1, 0, 0, 0)); // exclusive

    // Get all plans for this client
    const plans = await prisma.contentPlan.findMany({
      where: { clientId },
      select: { id: true },
    });
    const planIds = plans.map((p) => p.id);

    await prisma.publication.updateMany({
      where: {
        planId: { in: planIds },
        type: {
          in: publicationTypes as ("POST" | "HISTORIA" | "REEL" | "PAUTA")[],
        },
        date: { gte: monthStart, lt: monthEnd },
      },
      data: { assignedAgentId: agentId },
    });
  }

  revalidatePath("/admin/ordenes");
  revalidatePath("/admin");
  redirect("/admin/ordenes");
}

export default async function NuevaOrdenPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const [agents, rawClients] = await Promise.all([
    prisma.user.findMany({
      where: { role: "AGENTE" },
      orderBy: { name: "asc" },
    }),
    prisma.client.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: {
        contentPlans: {
          include: {
            publicaciones: { select: { date: true, type: true } },
          },
        },
      },
    }),
  ]);

  // Build per-client month → type count map
  const clients: ClientData[] = rawClients.map((client) => {
    const monthMap = new Map<string, Record<string, number>>();

    for (const plan of client.contentPlans) {
      for (const pub of plan.publicaciones) {
        const d = new Date(pub.date);
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth(); // 0-based
        const key = `${y}-${String(m + 1).padStart(2, "0")}`;
        if (!monthMap.has(key)) {
          monthMap.set(key, Object.fromEntries(ALL_TYPES.map((t) => [t, 0])));
        }
        const counts = monthMap.get(key)!;
        counts[pub.type] = (counts[pub.type] ?? 0) + 1;
      }
    }

    const months = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, counts]) => {
        const [y, m] = key.split("-").map(Number);
        const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
        return {
          key,
          label: `${MONTH_NAMES[m - 1]} ${y}`,
          counts,
          startDate: `${y}-${String(m).padStart(2, "0")}-01`,
          endDate: `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
        };
      });

    return {
      id: client.id,
      name: client.name,
      brandName: client.brandName,
      months,
    };
  });

  return (
    <AdminShell
      title="Nueva orden de trabajo"
      subtitle="Crea y asigna una nueva orden."
    >
      <div className="mx-auto max-w-2xl">
        <NuevaOrdenForm
          agents={agents}
          clients={clients}
          createWorkOrder={createWorkOrder}
        />
      </div>
    </AdminShell>
  );
}
