import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminShell from "../../_components/AdminShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function createClient(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    return;
  }

  const client = await prisma.client.create({
    data: {
      name,
      contactEmail: contactEmail || null,
      phone: phone || null,
      notes: notes || null,
    },
  });

  redirect(`/admin/clients/${client.id}`);
}

export default async function NewClientPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      title="Nuevo cliente"
      subtitle="Agrega un cliente de marketing."
    >
      <form action={createClient} className="mt-6 grid gap-4">
        <label className="block text-sm font-medium text-neutral-700">
          Nombre del cliente
          <input
            name="name"
            required
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="Cliente"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Email de contacto
          <input
            name="contactEmail"
            type="email"
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="contacto@cliente.com"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Teléfono
          <input
            name="phone"
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="+52 55 0000 0000"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Notas
          <textarea
            name="notes"
            rows={4}
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="Información relevante del cliente"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Guardar cliente
        </button>
      </form>
    </AdminShell>
  );
}
