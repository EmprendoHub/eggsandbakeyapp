import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Cadencia, PublicacionTipo } from "@prisma/client";
import AdminShell from "../../_components/AdminShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSchedule } from "@/lib/schedule";
import DraggableCalendar from "./_components/DraggableCalendar";
import DeleteOldPlansButton from "./_components/DeleteOldPlansButton";
import DeletePlanButton from "./_components/DeletePlanButton";

interface PageProps {
  params: { id: string };
  searchParams?: { month?: string };
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

function getCadenciaLabel(cadencia: Cadencia) {
  switch (cadencia) {
    case "MENSUAL":
      return "Mensual";
    case "BIMESTRAL":
      return "Bimestral";
    case "TRIMESTRAL":
      return "Trimestral";
    default:
      return cadencia;
  }
}

async function createPlan(clientId: string, formData: FormData) {
  "use server";

  const cadence = String(formData.get("cadence") ?? "MENSUAL") as Cadencia;
  const startDateValue = String(formData.get("startDate") ?? "");
  const durationDaysInput = Number(formData.get("durationDays") ?? 0);
  const postsCount = Number(formData.get("postsCount") ?? 0);
  const historiasCount = Number(formData.get("historiasCount") ?? 0);
  const reelsCount = Number(formData.get("reelsCount") ?? 0);

  if (!startDateValue) {
    return;
  }

  const [year, month, day] = startDateValue.split("-").map(Number);
  const startDate = new Date(year, (month ?? 1) - 1, day ?? 1);
  let durationDays = durationDaysInput;
  if (!durationDays || durationDays <= 0) {
    const monthsToAdd =
      cadence === "BIMESTRAL" ? 2 : cadence === "TRIMESTRAL" ? 3 : 1;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    const diffMs = endDate.getTime() - startDate.getTime();
    durationDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const monthEnd = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0,
  );

  const existingPlan = await prisma.contentPlan.findFirst({
    where: {
      clientId,
      startDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const plan = existingPlan
    ? await prisma.contentPlan.update({
        where: { id: existingPlan.id },
        data: {
          cadence,
          startDate,
          durationDays,
          postsCount,
          historiasCount,
          reelsCount,
        },
      })
    : await prisma.contentPlan.create({
        data: {
          clientId,
          cadence,
          startDate,
          durationDays,
          postsCount,
          historiasCount,
          reelsCount,
        },
      });

  const publications = generateSchedule({
    startDate,
    durationDays,
    postsCount,
    historiasCount,
    reelsCount,
  });

  if (existingPlan) {
    await prisma.publication.deleteMany({
      where: { planId: plan.id },
    });
  }

  if (publications.length) {
    await prisma.publication.createMany({
      data: publications.map((publication) => ({
        planId: plan.id,
        date: publication.date,
        type: publication.type as PublicacionTipo,
      })),
    });
  }

  redirect(`/admin/clients/${clientId}`);
}

async function toggleClientActive(clientId: string, currentActive: boolean) {
  "use server";

  await prisma.client.update({
    where: { id: clientId },
    data: { active: !currentActive },
  });

  redirect(`/admin/clients/${clientId}`);
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contentPlans: {
        orderBy: { createdAt: "desc" },
        include: { publicaciones: true },
      },
    },
  });

  const agents = await prisma.user.findMany({
    where: { role: "AGENTE" },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  if (!client) {
    redirect("/admin");
  }

  const latestPlan = client.contentPlans[0];
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  const oldPlansCount = client.contentPlans.filter(
    (plan) => plan.createdAt < cutoff,
  ).length;

  const initialMonth = searchParams?.month
    ? new Date(`${searchParams.month}-01T00:00:00`)
    : null;

  return (
    <AdminShell title={client.name} subtitle="Calendario de contenido">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <span>{client.contactEmail ?? "Sin email"}</span>
          <span>•</span>
          <span>{client.phone ?? "Sin teléfono"}</span>
          <span>•</span>
          <span>{client.active ? "Activo" : "Inactivo"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form
            action={toggleClientActive.bind(null, client.id, client.active)}
          >
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                client.active
                  ? "border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {client.active ? "Desactivar cliente" : "Activar cliente"}
            </button>
          </form>
          <DeleteOldPlansButton
            clientId={client.id}
            clientName={client.name}
            oldPlansCount={oldPlansCount}
          />
        </div>
      </div>

      {client.notes ? (
        <p className="mt-4 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
          {client.notes}
        </p>
      ) : null}

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Generar plan de publicaciones
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Define la cadencia, fechas y cantidades para distribuir el
            contenido.
          </p>
          <form
            action={createPlan.bind(null, client.id)}
            className="mt-6 grid gap-4"
          >
            <label className="block text-sm font-medium text-neutral-700">
              Cadencia
              <select
                name="cadence"
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                defaultValue="MENSUAL"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="BIMESTRAL">Bimestral</option>
                <option value="TRIMESTRAL">Trimestral</option>
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">
                Fecha de inicio
                <input
                  name="startDate"
                  type="date"
                  required
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Duración (días)
                <input
                  name="durationDays"
                  type="number"
                  min={1}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                  placeholder="Auto por cadencia"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-medium text-neutral-700">
                Posts
                <input
                  name="postsCount"
                  type="number"
                  min={0}
                  defaultValue={8}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Historias
                <input
                  name="historiasCount"
                  type="number"
                  min={0}
                  defaultValue={12}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Reels
                <input
                  name="reelsCount"
                  type="number"
                  min={0}
                  defaultValue={4}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Crear plan y calendario
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Planes recientes
          </h2>
          <div className="mt-4 space-y-4">
            {client.contentPlans.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aún no hay planes creados.
              </p>
            ) : (
              client.contentPlans.map((plan) => {
                const monthKey = `${plan.startDate.getFullYear()}-${String(
                  plan.startDate.getMonth() + 1,
                ).padStart(2, "0")}`;
                const monthLabel = new Intl.DateTimeFormat("es-ES", {
                  year: "numeric",
                  month: "long",
                }).format(plan.startDate);

                return (
                  <div
                    key={plan.id}
                    className="rounded-2xl border border-neutral-200 p-4 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/admin/clients/${client.id}?month=${monthKey}`}
                        className="flex-1"
                      >
                        <p className="font-semibold text-neutral-900">
                          {getCadenciaLabel(plan.cadence)} • {plan.durationDays}{" "}
                          días
                        </p>
                        <p className="text-neutral-500">
                          Inicio: {dateFormatter.format(plan.startDate)}
                        </p>
                      </Link>
                      <DeletePlanButton
                        planId={plan.id}
                        monthLabel={monthLabel}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
                      <span className="rounded-full bg-neutral-100 px-2 py-1">
                        {plan.postsCount} posts
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-1">
                        {plan.historiasCount} historias
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-1">
                        {plan.reelsCount} reels
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      {plan.publicaciones.length} publicaciones programadas
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {latestPlan ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Calendario de contenido
            </h2>
            <Link
              href="/admin"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Volver a clientes
            </Link>
          </div>
          <DraggableCalendar
            plans={client.contentPlans.map((plan) => ({
              id: plan.id,
              startDate: plan.startDate,
              durationDays: plan.durationDays,
              publications: plan.publicaciones.map((pub) => ({
                id: pub.id,
                date: pub.date,
                type: pub.type,
                status: pub.status,
                title: pub.title,
                notes: pub.notes,
                contentUrl: pub.contentUrl,
                assignedAgentId: pub.assignedAgentId,
              })),
            }))}
            initialMonth={initialMonth}
            clientName={client.name}
            agents={agents}
          />
        </section>
      ) : null}
    </AdminShell>
  );
}
