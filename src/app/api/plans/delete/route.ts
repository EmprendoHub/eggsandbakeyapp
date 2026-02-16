import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    await prisma.contentPlan.delete({
      where: { id: planId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 },
    );
  }
}
