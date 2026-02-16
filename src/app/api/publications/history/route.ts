import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicationId = request.nextUrl.searchParams.get("publicationId");
  if (!publicationId) {
    return NextResponse.json(
      { error: "Missing publicationId" },
      { status: 400 },
    );
  }

  const history = await prisma.publicationHistory.findMany({
    where: { publicationId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(history);
}
