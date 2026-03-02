"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { editClientAction, type EditClientState } from "../_actions";

interface Client {
  id: string;
  name: string;
  brandName: string | null;
  packageName: string | null;
  contactEmail: string | null;
  phone: string | null;
  notes: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 rounded-full bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
    >
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

const initialState: EditClientState = {};

export default function EditClientModal({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);

  const [state, formAction] = useFormState(editClientAction, initialState);

  return (
    <>
      {/* ── Botón disparador ────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474Z" />
          <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9a.75.75 0 0 1 1.5 0v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
        </svg>
        Editar cliente
      </button>

      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Panel deslizable ────────────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Encabezado del panel */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              Editar cliente
            </h2>
            <p className="text-xs text-neutral-500">{client.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form
          action={formAction}
          className="flex flex-1 flex-col overflow-y-auto px-6 py-5"
        >
          <input type="hidden" name="clientId" value={client.id} />
          <div className="flex-1 space-y-4">
            {/* Error */}
            {state?.error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state?.error}
              </div>
            )}

            <label className="block text-sm font-medium text-neutral-700">
              Nombre del cliente
              <input
                name="name"
                required
                defaultValue={client.name}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="Nombre del cliente"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Nombre de la marca
              <input
                name="brandName"
                defaultValue={client.brandName ?? ""}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="Ej. EggsandBakey"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Paquete contratado
              <input
                name="packageName"
                defaultValue={client.packageName ?? ""}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="Ej. Paquete Starter, Paquete Pro…"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Email de contacto
              <input
                name="contactEmail"
                type="email"
                defaultValue={client.contactEmail ?? ""}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="contacto@cliente.com"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Teléfono
              <input
                name="phone"
                defaultValue={client.phone ?? ""}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="+52 55 0000 0000"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Notas
              <textarea
                name="notes"
                rows={4}
                defaultValue={client.notes ?? ""}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-none"
                placeholder="Información relevante del cliente"
              />
            </label>
          </div>

          {/* Acciones fijas en pie del panel */}
          <div className="mt-6 flex gap-3 border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </>
  );
}
