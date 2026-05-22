"use client";

import { useState } from "react";

export type MonthData = {
  key: string; // "2026-05"
  label: string; // "Mayo 2026"
  counts: Record<string, number>; // { POST: 4, HISTORIA: 8, ... }
  startDate: string; // first day of month "2026-05-01"
  endDate: string; // last day of month "2026-05-31"
};

export type ClientData = {
  id: string;
  name: string;
  brandName: string | null;
  months: MonthData[];
};

export type AgentData = {
  id: string;
  name: string;
};

const TYPE_LABELS: Record<string, string> = {
  POST: "Post",
  HISTORIA: "Historia",
  REEL: "Reel",
  PAUTA: "Pauta",
};

const TYPE_COLORS: Record<string, string> = {
  POST: "bg-blue-50 border-blue-200 text-blue-900 has-[:checked]:bg-blue-600 has-[:checked]:border-blue-600 has-[:checked]:text-white",
  HISTORIA:
    "bg-green-50 border-green-200 text-green-900 has-[:checked]:bg-green-600 has-[:checked]:border-green-600 has-[:checked]:text-white",
  REEL: "bg-red-50 border-red-200 text-red-900 has-[:checked]:bg-red-600 has-[:checked]:border-red-600 has-[:checked]:text-white",
  PAUTA:
    "bg-amber-50 border-amber-200 text-amber-900 has-[:checked]:bg-amber-700 has-[:checked]:border-amber-700 has-[:checked]:text-white",
};

interface Props {
  agents: AgentData[];
  clients: ClientData[];
  createWorkOrder: (formData: FormData) => Promise<void>;
}

export default function NuevaOrdenForm({
  agents,
  clients,
  createWorkOrder,
}: Props) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const selectedMonth = selectedClient?.months.find(
    (m) => m.key === selectedMonthKey,
  );

  const typesWithPublications = selectedMonth
    ? Object.entries(selectedMonth.counts).filter(([, count]) => count > 0)
    : [];

  return (
    <form action={createWorkOrder} className="space-y-6">
      {/* Agente */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Agente
        </label>
        <select
          name="agentId"
          required
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
        >
          <option value="">— Selecciona un agente —</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cliente */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Cliente
        </label>
        <select
          name="clientId"
          required
          value={selectedClientId}
          onChange={(e) => {
            setSelectedClientId(e.target.value);
            setSelectedMonthKey("");
          }}
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
        >
          <option value="">— Selecciona un cliente —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.brandName ?? c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mes */}
      {selectedClient && (
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Mes de trabajo
          </label>
          {selectedClient.months.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-400">
              Este cliente no tiene publicaciones planificadas.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedClient.months.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMonthKey(m.key)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    selectedMonthKey === m.key
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          {/* Hidden field for month reference */}
          {selectedMonth && (
            <input type="hidden" name="monthKey" value={selectedMonth.key} />
          )}
        </div>
      )}

      {/* Tipos de publicación con conteos */}
      {selectedMonth && (
        <div>
          <p className="block text-sm font-medium text-neutral-700">
            Tipos de publicación{" "}
            <span className="font-normal text-neutral-400">
              — selecciona los que deseas asignar
            </span>
          </p>

          {typesWithPublications.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-400">
              No hay publicaciones en este mes.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3">
              {typesWithPublications.map(([type, count]) => (
                <label
                  key={type}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border px-5 py-3 text-sm transition ${TYPE_COLORS[type] ?? "bg-neutral-50 border-neutral-200 text-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:border-neutral-900 has-[:checked]:text-white"}`}
                >
                  <input
                    type="checkbox"
                    name="publicationType"
                    value={type}
                    className="sr-only"
                  />
                  <span className="text-lg font-bold">{count}</span>
                  <span className="font-medium">
                    {TYPE_LABELS[type] ?? type}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Fecha de inicio
          </label>
          <input
            name="startDate"
            type="date"
            required
            onClick={(e) => {
              try {
                (e.currentTarget as HTMLInputElement).showPicker();
              } catch {}
            }}
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Fecha de entrega
          </label>
          <input
            name="dueDate"
            type="date"
            required
            onClick={(e) => {
              try {
                (e.currentTarget as HTMLInputElement).showPicker();
              } catch {}
            }}
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Notas <span className="font-normal text-neutral-400">(opcional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
          placeholder="Instrucciones adicionales…"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!selectedMonth || typesWithPublications.length === 0}
          className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          Crear orden
        </button>
        <a
          href="/admin/ordenes"
          className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
