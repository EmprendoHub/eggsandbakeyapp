import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
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
    const { publicationId, newDate } = body;

    if (!publicationId || !newDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const publication = await prisma.publication.update({
      where: { id: publicationId },
      data: { date: new Date(newDate) },
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error updating publication date:", error);
    return NextResponse.json(
      { error: "Failed to update publication" },
      { status: 500 },
    );
  }
}
