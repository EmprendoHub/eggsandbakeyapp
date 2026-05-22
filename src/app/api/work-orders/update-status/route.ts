import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function PATCH(req: NextRequest) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { workOrderId?: string; newStatus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { workOrderId, newStatus } = body;

  if (!workOrderId || !newStatus) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const validStatuses = ["PENDIENTE", "EN_PROCESO", "COMPLETADA"];
  if (!validStatuses.includes(newStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const order = await prisma.workOrder.findUnique({
    where: { id: workOrderId },
  });
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  // Only the assigned agent or an admin can update
  if (session.user.role !== "ADMIN" && order.agentId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const updated = await prisma.workOrder.update({
    where: { id: workOrderId },
    data: { status: newStatus as "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
