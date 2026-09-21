import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const plan = await prisma.contentPlan.findUnique({
      where: { id: planId },
      include: { client: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const publications = await prisma.publication.findMany({
      where: { planId },
    });

    return NextResponse.json({ plan, publications });
  } catch (error) {
    console.error("Error fetching plan details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error message:", errorMessage);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { error: "Failed to fetch plan details", details: errorMessage },
      { status: 500 },
    );
  }
}
