import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { clientId } = body as { clientId?: string };

  if (!clientId) {
    return NextResponse.json({ error: "clientId requerido" }, { status: 400 });
  }

  // Delete publications → plans → client (respecting FK constraints)
  const plans = await prisma.contentPlan.findMany({
    where: { clientId },
    select: { id: true },
  });

  const planIds = plans.map((p) => p.id);

  await prisma.publication.deleteMany({
    where: { planId: { in: planIds } },
  });

  await prisma.contentPlan.deleteMany({
    where: { clientId },
  });

  await prisma.client.delete({
    where: { id: clientId },
  });

  return NextResponse.json({ ok: true });
}
