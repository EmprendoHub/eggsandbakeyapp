import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Cadencia } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, renewDays, cadence } = await req.json();

    if (!planId || !renewDays) {
      return NextResponse.json(
        { error: "Missing planId or renewDays" },
        { status: 400 },
      );
    }

    // Get the current plan
    const plan = await prisma.contentPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Calculate new duration (extend from current expiration)
    const currentExpiration = new Date(plan.startDate);
    currentExpiration.setDate(currentExpiration.getDate() + plan.durationDays);

    // New start date is the current expiration
    const newStartDate = new Date(currentExpiration);
    const newDurationDays = renewDays;

    // Update the plan with new cadence if provided
    const updateData: {
      startDate: Date;
      durationDays: number;
      cadence?: Cadencia;
    } = {
      startDate: newStartDate,
      durationDays: newDurationDays,
    };

    if (cadence) {
      updateData.cadence = cadence;
    }

    await prisma.contentPlan.update({
      where: { id: planId },
      data: updateData,
    });

    // Mark all notifications for this plan as read
    await prisma.contentPlanNotification.updateMany({
      where: { planId },
      data: { readAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Plan renewed successfully",
    });
  } catch (error) {
    console.error("Error renewing plan:", error);
    return NextResponse.json(
      { error: "Failed to renew plan" },
      { status: 500 },
    );
  }
}
