import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active ContentPlans with valid data
    const contentPlans = await prisma.contentPlan.findMany({
      where: {
        client: { active: true },
        durationDays: { gt: 0 }, // Only valid plans with positive duration
      },
      include: {
        client: true,
        expirationNotifications: true,
      },
    });

    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);

    const twoWeeksFromNow = new Date(now);
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    const notificationsToCreate: Array<{
      planId: string;
      type: "ONE_MONTH_BEFORE" | "TWO_WEEKS_BEFORE";
    }> = [];

    for (const plan of contentPlans) {
      // Calculate expiration date: startDate + durationDays
      const expirationDate = new Date(plan.startDate);
      expirationDate.setDate(expirationDate.getDate() + plan.durationDays);

      // Skip if plan is already expired or has invalid dates
      if (expirationDate <= now) continue;

      // Check for 1-month-before notification
      if (
        expirationDate <= oneMonthFromNow &&
        !plan.expirationNotifications.find((n) => n.type === "ONE_MONTH_BEFORE")
      ) {
        notificationsToCreate.push({
          planId: plan.id,
          type: "ONE_MONTH_BEFORE",
        });
      }

      // Check for 2-weeks-before notification
      if (
        expirationDate <= twoWeeksFromNow &&
        !plan.expirationNotifications.find((n) => n.type === "TWO_WEEKS_BEFORE")
      ) {
        notificationsToCreate.push({
          planId: plan.id,
          type: "TWO_WEEKS_BEFORE",
        });
      }
    }

    // Batch create new notifications
    if (notificationsToCreate.length > 0) {
      await prisma.contentPlanNotification.createMany({
        data: notificationsToCreate,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      message: `Created ${notificationsToCreate.length} notifications`,
      notificationsCreated: notificationsToCreate.length,
    });
  } catch (error) {
    console.error("Error checking content plan notifications:", error);
    return NextResponse.json(
      { error: "Failed to check notifications" },
      { status: 500 },
    );
  }
}
