"use server";

import { redirect } from "next/navigation";

export interface EditClientState {
  error?: string;
  success?: boolean;
}

export async function editClientAction(
  _prevState: EditClientState,
  formData: FormData,
): Promise<EditClientState> {
  const { prisma } = await import("@/lib/prisma");

  const clientId = String(formData.get("clientId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const brandName = String(formData.get("brandName") ?? "").trim();
  const packageName = String(formData.get("packageName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!clientId) return { error: "ID de cliente no encontrado." };
  if (!name) return { error: "El nombre del cliente es requerido." };

  // Verificar duplicado (excluyendo el propio cliente)
  const duplicate = await prisma.client.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      NOT: { id: clientId },
    },
  });

  if (duplicate) {
    return {
      error: `Ya existe otro cliente con ese nombre ("${duplicate.active ? "activo" : "inactivo"}"). Elige un nombre diferente.`,
    };
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name,
      brandName: brandName || null,
      packageName: packageName || null,
      contactEmail: contactEmail || null,
      phone: phone || null,
      notes: notes || null,
    },
  });

  redirect(`/admin/clients/${clientId}`);
}
