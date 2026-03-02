"use client";

import { useState } from "react";

interface Client {
  id: string;
  name: string;
  active: boolean;
}

interface Props {
  clients: Client[];
  visibleClientIds: Set<string>;
  onToggle: (id: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

// Misma paleta que GlobalCalendar para mantener colores consistentes
const PALETTE = [
  { dot: "bg-blue-500" },
  { dot: "bg-violet-500" },
  { dot: "bg-orange-500" },
  { dot: "bg-teal-500" },
  { dot: "bg-pink-500" },
  { dot: "bg-amber-500" },
  { dot: "bg-indigo-500" },
  { dot: "bg-rose-500" },
  { dot: "bg-lime-500" },
  { dot: "bg-cyan-500" },
] as const;

export default function ClientsFilterPanel({
  clients,
  visibleClientIds,
  onToggle,
  onShowAll,
  onHideAll,
}: Props) {
  const [open, setOpen] = useState(false);

  const visibleCount = visibleClientIds.size;
  const totalCount = clients.length;
  const allVisible = visibleCount === totalCount;

  return (
    <div className="relative shrink-0">
      {/* Botón "Ver" */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
          open
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          <path
            fillRule="evenodd"
            d="M1.38 8a6.97 6.97 0 0 1 1.215-2.053A6.977 6.977 0 0 1 8 3.25 6.977 6.977 0 0 1 14.62 8 6.977 6.977 0 0 1 8 12.75a6.977 6.977 0 0 1-5.405-2.697A6.97 6.97 0 0 1 1.38 8Zm6.62 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            clipRule="evenodd"
          />
        </svg>
        Ver
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            open ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {visibleCount}/{totalCount}
        </span>
      </button>

      {/* Panel desplegable */}
      {open && (
        <>
          {/* Backdrop para cerrar */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-3xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="text-sm font-semibold text-neutral-900">
                Clientes visibles
              </span>
              <button
                onClick={allVisible ? onHideAll : onShowAll}
                className="text-[11px] font-semibold text-neutral-500 transition hover:text-neutral-900"
              >
                {allVisible ? "Ocultar todos" : "Ver todos"}
              </button>
            </div>

            {/* Lista */}
            <ul className="max-h-80 overflow-y-auto px-2 py-2">
              {clients.map((client, idx) => {
                const isVisible = visibleClientIds.has(client.id);
                const color = PALETTE[idx % PALETTE.length]!;

                return (
                  <li key={client.id}>
                    <button
                      onClick={() => onToggle(client.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-neutral-50"
                    >
                      {/* Color dot */}
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                          isVisible ? color.dot : "bg-neutral-200"
                        }`}
                      />

                      {/* Nombre */}
                      <span
                        className={`flex-1 truncate text-sm font-medium transition ${
                          isVisible
                            ? "text-neutral-800"
                            : "text-neutral-400 line-through"
                        }`}
                      >
                        {client.name}
                      </span>

                      {/* Check / X */}
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
                          isVisible
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-neutral-100 text-neutral-300"
                        }`}
                      >
                        {isVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-3 w-3"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-3 w-3"
                          >
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="border-t border-neutral-100 px-4 py-2.5 text-xs text-neutral-400">
              {visibleCount === 0
                ? "Ningún cliente visible"
                : visibleCount === totalCount
                  ? "Todos los clientes visibles"
                  : `${visibleCount} de ${totalCount} clientes visibles`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
