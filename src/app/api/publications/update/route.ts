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
        notes: true,
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

    // Auto-advance status based on filled fields (only when status not explicitly set)
    if (status === undefined && previous) {
      const effectiveTitle =
        data.title !== undefined ? data.title : previous.title;
      const effectiveNotes =
        data.notes !== undefined ? data.notes : previous.notes;
      const effectiveUrl =
        data.contentUrl !== undefined ? data.contentUrl : previous.contentUrl;
      const currentStatus = previous.status;

      const hasTitle = Boolean(effectiveTitle);
      const hasNotes = Boolean(effectiveNotes);
      const hasUrl = Boolean(effectiveUrl);

      if (hasTitle && hasNotes && hasUrl) {
        data.status = "COMPLETADA";
      } else if (hasTitle && hasNotes && currentStatus === "PENDIENTE") {
        data.status = "EN_PROCESO";
      }
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

    // Auto-complete work order when all its publications are COMPLETADA
    if (publication.status === "COMPLETADA" && publication.assignedAgentId) {
      const fullPub = await prisma.publication.findUnique({
        where: { id: publicationId },
        select: { type: true, plan: { select: { clientId: true } } },
      });

      if (fullPub) {
        // Find any non-completed work order for this agent + client + type
        const matchingOrders = await prisma.workOrder.findMany({
          where: {
            agentId: publication.assignedAgentId,
            clientId: fullPub.plan.clientId,
            publicationType: fullPub.type,
            status: { not: "COMPLETADA" },
          },
          select: { id: true },
        });

        for (const order of matchingOrders) {
          // Check if all publications for this order are now COMPLETADA
          const sibling = await prisma.publication.findFirst({
            where: {
              assignedAgentId: publication.assignedAgentId,
              type: fullPub.type,
              plan: { clientId: fullPub.plan.clientId },
              status: { not: "COMPLETADA" },
            },
            select: { id: true },
          });

          if (!sibling) {
            await prisma.workOrder.update({
              where: { id: order.id },
              data: { status: "COMPLETADA" },
            });
          }
        }
      }
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
