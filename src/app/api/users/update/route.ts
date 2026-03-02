import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

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
  const { userId, name, email, role, password } = body as {
    userId?: string;
    name?: string;
    email?: string;
    role?: string;
    password?: string;
  };

  if (!userId || !name || !email || !role) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Check if email is taken by another user
  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Ese email ya está en uso por otro usuario." },
      { status: 409 },
    );
  }

  const updateData: Record<string, unknown> = { name, email, role };
  if (password && password.length >= 8) {
    updateData.passwordHash = await bcrypt.hash(password, 12);
  }

  await prisma.user.update({ where: { id: userId }, data: updateData });

  return NextResponse.json({ ok: true });
}
