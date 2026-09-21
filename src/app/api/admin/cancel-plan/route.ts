import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    // Get the plan to find the client and expiration date
    const plan = await prisma.contentPlan.findUnique({
      where: { id: planId },
      include: { client: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Calculate expiration date
    const expirationDate = new Date(plan.startDate);
    expirationDate.setDate(expirationDate.getDate() + plan.durationDays);

    // Mark the plan as cancelled (set to inactive after expiration)
    // For now, we'll update the plan to have duration 0 to indicate it's cancelled
    await prisma.contentPlan.update({
      where: { id: planId },
      data: {
        durationDays: 0, // Mark as cancelled
      },
    });

    // Mark all notifications for this plan as read (action has been taken)
    await prisma.contentPlanNotification.updateMany({
      where: { planId },
      data: { readAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Plan cancelled. Client will be deactivated after expiration.",
      expirationDate: expirationDate.toISOString(),
    });
  } catch (error) {
    console.error("Error cancelling plan:", error);
    return NextResponse.json(
      { error: "Failed to cancel plan" },
      { status: 500 },
    );
  }
}
