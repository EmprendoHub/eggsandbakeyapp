import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function createAdmin(formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  redirect("/admin/login");
}

export default async function SetupAdminPage() {
  const { prisma } = await import("@/lib/prisma");
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Setup inicial
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Crear primer admin</h1>
          <p className="mt-2 text-sm text-white/60">
            Esta pantalla solo estará disponible si no existen usuarios.
          </p>
          <form action={createAdmin} className="mt-6 space-y-4">
            <label className="block text-sm text-white/70">
              Nombre
              <input
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="Administrador"
              />
            </label>
            <label className="block text-sm text-white/70">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="admin@correo.com"
              />
            </label>
            <label className="block text-sm text-white/70">
              Contraseña
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="********"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
            >
              Crear administrador
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
