import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import AdminShell from "../_components/AdminShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function createUser(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return;
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
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
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Administradores" subtitle="Gestiona accesos al panel.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Crear administrador
          </h2>
          <form action={createUser} className="mt-6 grid gap-4">
            <label className="block text-sm font-medium text-neutral-700">
              Nombre
              <input
                name="name"
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Contraseña
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Guardar admin
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Administradores activos
          </h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-neutral-200 px-4 py-3"
              >
                <p className="text-sm font-semibold text-neutral-900">
                  {user.name}
                </p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
