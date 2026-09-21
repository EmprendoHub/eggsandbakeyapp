import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Scheduled task to check and create ContentPlan expiration notifications.
 * Can be called by external cron service (e.g., cron-job.org, easycron, etc.)
 *
 * Usage: Call this endpoint periodically (e.g., daily at 8 AM)
 * GET /api/cron/check-plan-notifications?key=YOUR_CRON_KEY
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret key if set
    const cronKey = process.env.CRON_SECRET_KEY;
    const providedKey = req.nextUrl.searchParams.get("key");

    if (cronKey && providedKey !== cronKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const result = await prisma.contentPlanNotification.createMany({
      data: notificationsToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: "Plan notifications checked and created",
      plansChecked: plans.length,
      notificationsCreated: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cron notification check:", error);
    return NextResponse.json(
      {
        error: "Failed to check plan notifications",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
