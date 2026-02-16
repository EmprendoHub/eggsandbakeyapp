import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell
      title="Clientes"
      subtitle="Administra la cartera de marketing y sus calendarios de contenido."
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Clientes activos
          </h2>
          <p className="text-sm text-neutral-500">
            {clients.length} cliente(s) registrados.
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo cliente
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/admin/clients/${client.id}`}
            className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {client.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {client.contactEmail ?? "Sin email registrado"}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {client.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            {client.notes ? (
              <p className="mt-3 text-sm text-neutral-600 line-clamp-3">
                {client.notes}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
