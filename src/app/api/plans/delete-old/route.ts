import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
    }

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    await prisma.contentPlan.deleteMany({
      where: {
        clientId,
        createdAt: { lt: cutoff },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting old plans:", error);
    return NextResponse.json(
      { error: "Failed to delete old plans" },
      { status: 500 },
    );
  }
}
