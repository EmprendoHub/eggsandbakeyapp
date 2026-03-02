"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { createClientAction, type CreateClientState } from "./_actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Guardando…" : "Guardar cliente"}
    </button>
  );
}

const initialState: CreateClientState = {};

export default function NewClientForm() {
  const [state, formAction] = useFormState(createClientAction, initialState);

  return (
    <>
      {/* ── Modal de duplicado ──────────────────────────────────────────── */}
      {state.error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
            {/* Ícono */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-amber-500"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Texto */}
            <h2 className="mb-2 text-center text-base font-semibold text-neutral-900">
              Cliente duplicado
            </h2>
            <p className="text-center text-sm text-neutral-600">
              {state.error}
            </p>

            {/* Acciones */}
            <div className="mt-6 flex flex-col gap-2">
              {state.duplicateId && (
                <Link
                  href={`/admin/clients/${state.duplicateId}`}
                  className="w-full rounded-full bg-neutral-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                  Ver cliente existente
                </Link>
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full rounded-full border border-neutral-200 py-2.5 text-center text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100"
              >
                Regresar al formulario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Formulario ──────────────────────────────────────────────────── */}
      <form action={formAction} className="mt-6 grid gap-4">
        <label className="block text-sm font-medium text-neutral-700">
          Nombre del cliente
          <input
            name="name"
            required
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="Nombre del cliente"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Nombre de la marca
          <input
            name="brandName"
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="Ej. EggsandBakey"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Paquete contratado
          <input
            name="packageName"
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            placeholder="Ej. Paquete Starter, Paquete Pro…"
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
        <SubmitButton />
      </form>
    </>
  );
}
