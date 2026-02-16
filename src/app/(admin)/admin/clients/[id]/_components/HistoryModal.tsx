"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  id: string;
  createdAt: string;
  action: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  fromAgentId?: string | null;
  toAgentId?: string | null;
  user?: { name?: string | null } | null;
}

const statusLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  COMPLETADA: "Completada",
};

const statusBadgeColors: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700",
  EN_PROCESO: "bg-blue-100 text-blue-700",
  COMPLETADA: "bg-emerald-100 text-emerald-700",
};

interface HistoryModalProps {
  publicationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({
  publicationId,
  isOpen,
  onClose,
}: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/publications/history?publicationId=${publicationId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [publicationId, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Historial de cambios
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-neutral-500">Cargando historial...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-neutral-500">
                No hay cambios registrados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  {/* Timeline dot and connector */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-neutral-400" />
                      {index < history.length - 1 && (
                        <div className="my-2 h-8 w-0.5 bg-neutral-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {item.user?.name ?? "Sistema"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(item.createdAt).toLocaleString("es-ES")}
                          </p>
                        </div>
                        <span className="rounded-full bg-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-700">
                          {item.action}
                        </span>
                      </div>

                      {/* Status change */}
                      {item.fromStatus || item.toStatus ? (
                        <div className="mt-3 flex items-center gap-2">
                          {item.fromStatus && (
                            <span
                              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                                statusBadgeColors[item.fromStatus] ||
                                "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {statusLabels[item.fromStatus] || item.fromStatus}
                            </span>
                          )}
                          <span className="text-neutral-400">→</span>
                          {item.toStatus && (
                            <span
                              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                                statusBadgeColors[item.toStatus] ||
                                "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {statusLabels[item.toStatus] || item.toStatus}
                            </span>
                          )}
                        </div>
                      ) : null}

                      {/* Agent assignment change */}
                      {item.fromAgentId || item.toAgentId ? (
                        <div className="mt-2 text-xs text-neutral-600">
                          <p>
                            Asignación:{" "}
                            <span className="font-semibold">
                              {item.fromAgentId
                                ? "Anterior → "
                                : "Sin agente → "}
                              {item.toAgentId ? "Nuevo agente" : "Sin asignar"}
                            </span>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
