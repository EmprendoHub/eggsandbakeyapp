import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminShell from "../_components/AdminShell";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

async function checkAndCreateNotifications() {
  "use server";
  const [{ prisma }] = await Promise.all([import("@/lib/prisma")]);

  try {
    // Fetch all active ContentPlans with durationDays > 0
    const plans = await prisma.contentPlan.findMany({
      where: {
        client: { active: true },
        durationDays: { gt: 0 },
      },
      include: { client: true },
    });

    const notificationsToCreate: Array<{
      planId: string;
      type: "ONE_MONTH_BEFORE" | "TWO_WEEKS_BEFORE";
    }> = [];

    for (const plan of plans) {
      try {
        const startDate = new Date(plan.startDate);
        const expirationDate = new Date(startDate);
        expirationDate.setDate(expirationDate.getDate() + plan.durationDays);

        // Skip already-expired plans
        if (expirationDate < new Date()) {
          continue;
        }

        const daysUntilExpiration = Math.ceil(
          (expirationDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Create notification if within 30 days (1 month)
        if (daysUntilExpiration <= 30) {
          notificationsToCreate.push({
            planId: plan.id,
            type: "ONE_MONTH_BEFORE",
          });
        }

        // Create notification if within 14 days (2 weeks)
        if (daysUntilExpiration <= 14) {
          notificationsToCreate.push({
            planId: plan.id,
            type: "TWO_WEEKS_BEFORE",
          });
        }
      } catch (error) {
        console.error(`Error processing plan ${plan.id}:`, error);
      }
    }

    // Create all notifications, skipping duplicates
    if (notificationsToCreate.length > 0) {
      await prisma.contentPlanNotification.createMany({
        data: notificationsToCreate,
        skipDuplicates: true,
      });
    }
  } catch (error) {
    console.error("Error checking plan notifications:", error);
  }
}

export default async function NotificacionesPage() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");

  // Check and create notifications first
  await checkAndCreateNotifications();

  // Fetch all unread content plan notifications
  const notifications = await prisma.contentPlanNotification.findMany({
    where: { readAt: null },
    orderBy: { sentAt: "desc" },
    include: {
      plan: {
        include: { client: true },
      },
    },
  });

  const notificationWithExpiration = notifications.map((notif) => {
    const expirationDate = new Date(notif.plan.startDate);
    expirationDate.setDate(expirationDate.getDate() + notif.plan.durationDays);

    const TYPE_LABEL: Record<string, string> = {
      ONE_MONTH_BEFORE: "Vence en 1 mes",
      TWO_WEEKS_BEFORE: "Vence en 2 semanas",
    };

    return {
      ...notif,
      expirationDate,
      typeLabel: TYPE_LABEL[notif.type] || notif.type,
    };
  });

  return (
    <AdminShell title="Notificaciones">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Calendarios por vencer
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Calendarios de contenido que están próximos a expirar.{" "}
              {notificationWithExpiration.length === 0 &&
                "No hay notificaciones en este momento."}
            </p>
          </div>
        </div>

        {notificationWithExpiration.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-500">
              No hay calendarios próximos a vencer.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificationWithExpiration.map((notif) => (
              <Link
                key={notif.id}
                href={`/admin/notificaciones/${notif.planId}`}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {notif.plan.client.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {notif.plan.client.brandName &&
                          `${notif.plan.client.brandName} • `}
                        {notif.typeLabel}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-400">
                    Expira:{" "}
                    <span className="font-semibold text-neutral-600">
                      {dateFormatter.format(notif.expirationDate)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {notif.typeLabel}
                  </span>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
