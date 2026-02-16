"use client";

import { useState, FormEvent } from "react";
import HistoryModal from "./HistoryModal";

interface Publication {
  id: string;
  type: "POST" | "HISTORIA" | "REEL";
  title?: string | null;
  notes?: string | null;
  contentUrl?: string | null;
  assignedAgentId?: string | null;
}

interface PublicationModalProps {
  publication: Publication;
  agents: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSave: (
    id: string,
    title: string,
    notes: string,
    contentUrl: string,
    assignedAgentId: string | null,
  ) => Promise<void>;
}

export default function PublicationModal({
  publication,
  agents,
  onClose,
  onSave,
}: PublicationModalProps) {
  const [title, setTitle] = useState(publication.title || "");
  const [notes, setNotes] = useState(publication.notes || "");
  const [contentUrl, setContentUrl] = useState(publication.contentUrl || "");
  const [assignedAgentId, setAssignedAgentId] = useState(
    publication.assignedAgentId || "",
  );
  const [saving, setSaving] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const getTypeLabel = () => {
    switch (publication.type) {
      case "POST":
        return "Post";
      case "HISTORIA":
        return "Historia";
      case "REEL":
        return "Reel";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(
        publication.id,
        title,
        notes,
        contentUrl,
        assignedAgentId || null,
      );
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            Editar {getTypeLabel()}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700">
            Título
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
              placeholder={`Título del ${getTypeLabel().toLowerCase()}`}
            />
          </label>

          <label className="block text-sm font-medium text-neutral-700">
            Notas
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
              placeholder="Notas adicionales..."
            />
          </label>

          <label className="block text-sm font-medium text-neutral-700">
            URL del contenido
            <input
              type="url"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
              placeholder="https://..."
            />
          </label>

          <label className="block text-sm font-medium text-neutral-700">
            Asignar agente
            <select
              value={assignedAgentId}
              onChange={(e) => setAssignedAgentId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900"
            >
              <option value="">Sin asignar</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setHistoryModalOpen(true)}
              className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Ver historial
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      <HistoryModal
        publicationId={publication.id}
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />
    </div>
  );
}
