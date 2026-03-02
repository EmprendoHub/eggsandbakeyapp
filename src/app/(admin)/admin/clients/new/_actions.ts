"use server";

import { redirect } from "next/navigation";

export interface CreateClientState {
  error?: string;
  duplicateId?: string;
  duplicateActive?: boolean;
}

export async function createClientAction(
  _prevState: CreateClientState,
  formData: FormData,
): Promise<CreateClientState> {
  const { prisma } = await import("@/lib/prisma");

  const name = String(formData.get("name") ?? "").trim();
  const brandName = String(formData.get("brandName") ?? "").trim();
  const packageName = String(formData.get("packageName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    return { error: "El nombre del cliente es requerido." };
  }

  // Verificar duplicado (insensible a mayúsculas)
  const existing = await prisma.client.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existing) {
    return {
      error: `Ese cliente ya se encuentra "${existing.active ? "activo" : "inactivo"}", favor de revisar.`,
      duplicateId: existing.id,
      duplicateActive: existing.active,
    };
  }

  const client = await prisma.client.create({
    data: {
      name,
      brandName: brandName || null,
      packageName: packageName || null,
      contactEmail: contactEmail || null,
      phone: phone || null,
      notes: notes || null,
    },
  });

  redirect(`/admin/clients/${client.id}`);
}
