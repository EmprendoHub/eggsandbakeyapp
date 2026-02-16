import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { publicationId, title, notes, contentUrl, assignedAgentId, status } =
      body;

    if (!publicationId) {
      return NextResponse.json(
        { error: "Missing publication ID" },
        { status: 400 },
      );
    }

    const previous = await prisma.publication.findUnique({
      where: { id: publicationId },
      select: {
        assignedAgentId: true,
        status: true,
        contentUrl: true,
        title: true,
      },
    });

    const data: {
      title?: string | null;
      notes?: string | null;
      contentUrl?: string | null;
      assignedAgentId?: string | null;
      status?: typeof status;
    } = {};

    if (title !== undefined) {
      data.title = title || null;
    }
    if (notes !== undefined) {
      data.notes = notes || null;
    }
    if (contentUrl !== undefined) {
      data.contentUrl = contentUrl || null;
    }
    if (assignedAgentId !== undefined) {
      data.assignedAgentId = assignedAgentId || null;
    }
    if (status !== undefined) {
      data.status = status;
    }

    const publication = await prisma.publication.update({
      where: { id: publicationId },
      data,
    });

    const historyData = {
      publicationId,
      userId: session.user.id,
      action: "UPDATE",
      fromStatus: previous?.status ?? null,
      toStatus: status ?? null,
      fromAgentId: previous?.assignedAgentId ?? null,
      toAgentId: assignedAgentId ?? null,
      contentUrl: contentUrl ?? null,
      title: title ?? null,
    };

    const hasChanges =
      (assignedAgentId !== undefined &&
        assignedAgentId !== previous?.assignedAgentId) ||
      (status !== undefined && status !== previous?.status) ||
      (contentUrl !== undefined && contentUrl !== previous?.contentUrl) ||
      (title !== undefined && title !== previous?.title);

    if (hasChanges) {
      await prisma.publicationHistory.create({
        data: historyData,
      });
    }

    if (assignedAgentId && assignedAgentId !== previous?.assignedAgentId) {
      const fullPublication = await prisma.publication.findUnique({
        where: { id: publicationId },
        select: { id: true, plan: { select: { clientId: true } } },
      });

      await prisma.notification.create({
        data: {
          userId: assignedAgentId,
          clientId: fullPublication?.plan.clientId ?? null,
          publicationId: fullPublication?.id ?? null,
          message: "Tienes una nueva publicación asignada.",
        },
      });
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error updating publication:", error);
    return NextResponse.json(
      { error: "Failed to update publication" },
      { status: 500 },
    );
  }
}
