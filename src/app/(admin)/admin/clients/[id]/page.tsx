import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Cadencia, PublicacionTipo } from "@prisma/client";
import AdminShell from "../../_components/AdminShell";
import { generateSchedule } from "@/lib/schedule";
import DraggableCalendar from "./_components/DraggableCalendar";
import DeleteOldPlansButton from "./_components/DeleteOldPlansButton";
import DeletePlanButton from "./_components/DeletePlanButton";
import EditClientModal from "./_components/EditClientModal";
import DeleteClientButton from "./_components/DeleteClientButton";

interface PageProps {
  params: { id: string };
  searchParams?: { month?: string };
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

export const dynamic = "force-dynamic";

function getCadenciaLabel(cadencia: Cadencia) {
  switch (cadencia) {
    case "MENSUAL":
      return "Mensual";
    case "TRIMESTRAL":
      return "Trimestral";
    case "SEMESTRAL":
      return "Semestral";
    case "ANUAL":
      return "Anual";
    default:
      return cadencia;
  }
}

async function createPlan(clientId: string, formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const cadence = String(formData.get("cadence") ?? "MENSUAL") as Cadencia;
  const startDateValue = String(formData.get("startDate") ?? "");
  const durationDaysInput = Number(formData.get("durationDays") ?? 0);
  const postsCount = Number(formData.get("postsCount") ?? 0);
  const historiasCount = Number(formData.get("historiasCount") ?? 0);
  const reelsCount = Number(formData.get("reelsCount") ?? 0);
  const pautasCount = Number(formData.get("pautasCount") ?? 0);
  const pautaMonto = Number(formData.get("pautaMonto") ?? 0);
  // Monto individual por pauta (mensual ÷ número de pautas al mes)
  const montoPorPauta = pautasCount > 0 ? pautaMonto / pautasCount : 0;

  if (!startDateValue) {
    return;
  }

  const [year, month, day] = startDateValue.split("-").map(Number);
  const startDate = new Date(year, (month ?? 1) - 1, day ?? 1);

  const monthsToAdd =
    cadence === "TRIMESTRAL"
      ? 3
      : cadence === "SEMESTRAL"
        ? 6
        : cadence === "ANUAL"
          ? 12
          : 1;

  // Los conteos del formulario son por mes; multiplicar según la cadencia
  const totalPostsCount = postsCount * monthsToAdd;
  const totalHistoriasCount = historiasCount * monthsToAdd;
  const totalReelsCount = reelsCount * monthsToAdd;
  const totalPautasCount = pautasCount * monthsToAdd;

  let durationDays = durationDaysInput;
  if (!durationDays || durationDays <= 0) {
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
          postsCount: totalPostsCount,
          historiasCount: totalHistoriasCount,
          reelsCount: totalReelsCount,
          pautasCount: totalPautasCount,
          pautaMonto,
        },
      })
    : await prisma.contentPlan.create({
        data: {
          clientId,
          cadence,
          startDate,
          durationDays,
          postsCount: totalPostsCount,
          historiasCount: totalHistoriasCount,
          reelsCount: totalReelsCount,
          pautasCount: totalPautasCount,
          pautaMonto,
        },
      });

  const publications = generateSchedule({
    startDate,
    durationDays,
    postsCount: totalPostsCount,
    historiasCount: totalHistoriasCount,
    reelsCount: totalReelsCount,
    pautasCount: totalPautasCount,
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
        monto: publication.type === "PAUTA" ? montoPorPauta : 0,
      })),
    });
  }

  redirect(`/admin/clients/${clientId}`);
}

async function toggleClientActive(clientId: string, currentActive: boolean) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

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
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

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
  const latestPlanMonths =
    latestPlan?.cadence === "TRIMESTRAL"
      ? 3
      : latestPlan?.cadence === "SEMESTRAL"
        ? 6
        : latestPlan?.cadence === "ANUAL"
          ? 12
          : 1;
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600">
          {client.brandName && (
            <>
              <span className="font-medium text-neutral-900">
                {client.brandName}
              </span>
              <span>•</span>
            </>
          )}
          {client.packageName && (
            <>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                {client.packageName}
              </span>
              <span>•</span>
            </>
          )}
          <span>{client.contactEmail ?? "Sin email"}</span>
          <span>•</span>
          <span>{client.phone ?? "Sin teléfono"}</span>
          <span>•</span>
          <span
            className={`font-medium ${
              client.active ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {client.active ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <EditClientModal
            client={{
              id: client.id,
              name: client.name,
              brandName: client.brandName,
              packageName: client.packageName,
              contactEmail: client.contactEmail,
              phone: client.phone,
              notes: client.notes,
            }}
          />
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
          <DeleteClientButton clientId={client.id} clientName={client.name} />
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
            {latestPlan ? "Editar plan" : "Crear plan y calendario"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {latestPlan
              ? "Modifica la cadencia, fechas y cantidades del plan activo."
              : "Define el contrato, fechas y cantidades para distribuir el contenido."}
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
                defaultValue={latestPlan?.cadence ?? "MENSUAL"}
              >
                <option value="MENSUAL">Mensual</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Fecha de inicio
              <input
                name="startDate"
                type="date"
                required
                defaultValue={
                  latestPlan
                    ? latestPlan.startDate.toISOString().slice(0, 10)
                    : undefined
                }
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <div className="mb-1 text-xs text-neutral-400">
              Cantidades por mes
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <label className="block text-sm font-medium text-neutral-700">
                Posts
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  /mes
                </span>
                <input
                  name="postsCount"
                  type="number"
                  min={0}
                  defaultValue={
                    latestPlan ? latestPlan.postsCount / latestPlanMonths : 8
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Historias
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  /mes
                </span>
                <input
                  name="historiasCount"
                  type="number"
                  min={0}
                  defaultValue={
                    latestPlan
                      ? latestPlan.historiasCount / latestPlanMonths
                      : 12
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Reels
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  /mes
                </span>
                <input
                  name="reelsCount"
                  type="number"
                  min={0}
                  defaultValue={
                    latestPlan ? latestPlan.reelsCount / latestPlanMonths : 4
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Pautas
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  /mes
                </span>
                <input
                  name="pautasCount"
                  type="number"
                  min={0}
                  defaultValue={
                    latestPlan ? latestPlan.pautasCount / latestPlanMonths : 0
                  }
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-neutral-700">
              Monto de pauta
              <span className="ml-1 text-xs font-normal text-neutral-400">
                (mensual)
              </span>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-neutral-400">
                  $
                </span>
                <input
                  name="pautaMonto"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={latestPlan?.pautaMonto ?? 0}
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-8 pr-4 text-sm"
                />
              </div>
            </label>
            <button
              type="submit"
              className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
            >
              {latestPlan ? "Guardar cambios" : "Crear plan y calendario"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Paquete Contratado
          </h2>
          <div className="mt-4 space-y-4">
            {client.contentPlans.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aún no hay Paquete Contratado.
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
                        <p className="text-neutral-500">
                          Fin:{" "}
                          {dateFormatter.format(
                            new Date(
                              plan.startDate.getTime() +
                                plan.durationDays * 24 * 60 * 60 * 1000,
                            ),
                          )}
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
                      {plan.pautasCount > 0 && (
                        <span className="rounded-full bg-neutral-100 px-2 py-1">
                          {plan.pautasCount} pautas
                        </span>
                      )}
                      {plan.pautaMonto > 0 && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                          $
                          {plan.pautaMonto.toLocaleString("es-MX", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}{" "}
                          monto pauta
                        </span>
                      )}
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
              cadence: plan.cadence,
              publications: plan.publicaciones.map((pub) => ({
                id: pub.id,
                date: pub.date,
                type: pub.type,
                status: pub.status,
                title: pub.title,
                notes: pub.notes,
                contentUrl: pub.contentUrl,
                assignedAgentId: pub.assignedAgentId,
                monto: pub.monto,
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
