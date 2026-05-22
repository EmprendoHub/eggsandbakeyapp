import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const [{ authOptions }, { prisma }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/prisma"),
  ]);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { agentId, newPassword } = await req.json();
  if (!agentId || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: agentId },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
