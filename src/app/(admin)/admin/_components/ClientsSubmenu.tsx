"use client";

import Link from "next/link";

interface Client {
  id: string;
  name: string;
  active: boolean;
}

interface Props {
  clients: Client[];
  selectedClientId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
}

export default function ClientsSubmenu({
  clients,
  selectedClientId,
  onSelect,
  onClear,
}: Props) {
  const activeClients = clients.filter((c) => c.active);
  const inactiveClients = clients.filter((c) => !c.active);

  return (
    <aside className="w-56 shrink-0 self-start sticky top-6 rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <span className="text-sm font-semibold text-neutral-900">Clientes</span>
        <Link
          href="/admin/clients/new"
          className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-semibold text-white hover:bg-neutral-700 transition"
        >
          + Nuevo
        </Link>
      </div>

      <div className="px-3 py-3 space-y-4">
        {/* Activos */}
        <div>
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Activo
          </p>
          {activeClients.length === 0 ? (
            <p className="px-1 text-xs italic text-neutral-400">
              Sin clientes activos
            </p>
          ) : (
            <ul className="space-y-0.5">
              {activeClients.map((client) => {
                const isSelected = selectedClientId === client.id;
                return (
                  <li key={client.id} className="group flex items-center gap-1">
                    <button
                      onClick={() => onSelect(client.id)}
                      className={`flex flex-1 min-w-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm font-medium transition ${
                        isSelected
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isSelected ? "bg-emerald-400" : "bg-emerald-500"
                        }`}
                      />
                      <span className="truncate">{client.name}</span>
                    </button>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      title="Ver detalle"
                      className={`shrink-0 rounded-lg p-1 text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-neutral-700 hover:bg-neutral-100 transition ${
                        isSelected ? "text-white opacity-100" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Inactivos */}
        {inactiveClients.length > 0 && (
          <div>
            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
              Inactivo
            </p>
            <ul className="space-y-0.5">
              {inactiveClients.map((client) => {
                const isSelected = selectedClientId === client.id;
                return (
                  <li key={client.id} className="group flex items-center gap-1">
                    <button
                      onClick={() => onSelect(client.id)}
                      className={`flex flex-1 min-w-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-500 hover:bg-neutral-100"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isSelected ? "bg-red-300" : "bg-red-400"
                        }`}
                      />
                      <span className="truncate">{client.name}</span>
                    </button>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      title="Ver detalle"
                      className="shrink-0 rounded-lg p-1 text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-neutral-700 hover:bg-neutral-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: volver al calendario global */}
      <div className="border-t border-neutral-100 px-3 py-2">
        <button
          onClick={onClear}
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold transition ${
            selectedClientId
              ? "text-neutral-900 hover:bg-neutral-100"
              : "text-neutral-400 hover:bg-neutral-50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Todos los clientes
        </button>
      </div>
    </aside>
  );
}
