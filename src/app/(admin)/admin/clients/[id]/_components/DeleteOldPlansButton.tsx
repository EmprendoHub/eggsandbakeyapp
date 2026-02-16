"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteOldPlansButtonProps {
  clientId: string;
  clientName: string;
  oldPlansCount: number;
}

export default function DeleteOldPlansButton({
  clientId,
  clientName,
  oldPlansCount,
}: DeleteOldPlansButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/plans/delete-old", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={oldPlansCount === 0}
        onClick={() => setOpen(true)}
        className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Borrar planes antiguos{oldPlansCount > 0 ? ` (${oldPlansCount})` : ""}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Confirmación
                </p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900">
                  Borrar planes antiguos
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              Estás a punto de borrar {oldPlansCount} plan(es) creados hace más
              de 6 meses para{" "}
              <span className="font-semibold">{clientName}</span>. Esta acción
              eliminará también sus publicaciones asociadas.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
                className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {loading ? "Borrando..." : "Confirmar borrado"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
