"use client";

import { useMemo, useState } from "react";

type PublicationStatus = "PENDIENTE" | "EN_PROCESO" | "COMPLETADA";

type PublicationItem = {
  id: string;
  date: string;
  type: string;
  status: PublicationStatus;
  title?: string | null;
  notes?: string | null;
  contentUrl?: string | null;
};

type AssignedPublicationsProps = {
  publications: PublicationItem[];
};

const statusOptions: Array<{ value: PublicationStatus; label: string }> = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "COMPLETADA", label: "Completada" },
];

const statusStyles: Record<PublicationStatus, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700",
  EN_PROCESO: "bg-blue-100 text-blue-700",
  COMPLETADA: "bg-emerald-100 text-emerald-700",
};

export default function AssignedPublications({
  publications,
}: AssignedPublicationsProps) {
  const [statusById, setStatusById] = useState<
    Record<string, PublicationStatus>
  >(() =>
    publications.reduce(
      (acc, pub) => {
        acc[pub.id] = pub.status;
        return acc;
      },
      {} as Record<string, PublicationStatus>,
    ),
  );
  const [urlById, setUrlById] = useState<Record<string, string>>(() =>
    publications.reduce(
      (acc, pub) => {
        acc[pub.id] = pub.contentUrl ?? "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  const [titleById, setTitleById] = useState<Record<string, string>>(() =>
    publications.reduce(
      (acc, pub) => {
        acc[pub.id] = pub.title ?? "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  const [notesById, setNotesById] = useState<Record<string, string>>(() =>
    publications.reduce(
      (acc, pub) => {
        acc[pub.id] = pub.notes ?? "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  const items = useMemo(() => publications, [publications]);

  const updatePublication = async (payload: {
    publicationId: string;
    status?: PublicationStatus;
    contentUrl?: string;
    title?: string;
    notes?: string;
  }): Promise<PublicationStatus | null> => {
    const response = await fetch("/api/publications/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "No se pudo actualizar la publicación.");
    }

    const updated = await response.json();
    return (updated?.status as PublicationStatus) ?? null;
  };

  const handleStatusChange = async (
    publicationId: string,
    nextStatus: PublicationStatus,
  ) => {
    const previous = statusById[publicationId];
    setStatusById((prev) => ({ ...prev, [publicationId]: nextStatus }));
    setSavingId(publicationId);
    setErrorById((prev) => ({ ...prev, [publicationId]: "" }));

    try {
      await updatePublication({ publicationId, status: nextStatus });
    } catch (error) {
      setStatusById((prev) => ({ ...prev, [publicationId]: previous }));
      setErrorById((prev) => ({
        ...prev,
        [publicationId]:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la publicación.",
      }));
    } finally {
      setSavingId((current) => (current === publicationId ? null : current));
    }
  };

  const handleUrlSave = async (publicationId: string) => {
    const contentUrl = urlById[publicationId] ?? "";
    setSavingId(publicationId);
    setErrorById((prev) => ({ ...prev, [publicationId]: "" }));

    try {
      const newStatus = await updatePublication({ publicationId, contentUrl });
      if (newStatus) setStatusById((prev) => ({ ...prev, [publicationId]: newStatus }));
    } catch (error) {
      setErrorById((prev) => ({
        ...prev,
        [publicationId]:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la publicación.",
      }));
    } finally {
      setSavingId((current) => (current === publicationId ? null : current));
    }
  };

  const handleTitleNotesSave = async (publicationId: string) => {
    const title = titleById[publicationId] ?? "";
    const notes = notesById[publicationId] ?? "";
    setSavingId(publicationId);
    setErrorById((prev) => ({ ...prev, [publicationId]: "" }));

    try {
      const newStatus = await updatePublication({ publicationId, title, notes });
      if (newStatus) setStatusById((prev) => ({ ...prev, [publicationId]: newStatus }));
    } catch (error) {
      setErrorById((prev) => ({
        ...prev,
        [publicationId]:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la publicación.",
      }));
    } finally {
      setSavingId((current) => (current === publicationId ? null : current));
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-500">
        No hay publicaciones asignadas para este cliente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((pub) => {
        const status = statusById[pub.id] ?? pub.status;
        const error = errorById[pub.id];
        const isSaving = savingId === pub.id;

        return (
          <article
            key={pub.id}
            className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {pub.type}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{pub.date}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[status]
                }`}
              >
                {statusOptions.find((option) => option.value === status)
                  ?.label ?? status}
              </span>
            </div>

            {/* Título y Notas editables */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                  Título
                </label>
                <input
                  type="text"
                  className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-300"
                  placeholder="Sin título"
                  value={titleById[pub.id] ?? ""}
                  onChange={(e) =>
                    setTitleById((prev) => ({
                      ...prev,
                      [pub.id]: e.target.value,
                    }))
                  }
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                  Notas
                </label>
                <textarea
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-300"
                  placeholder="Notas opcionales..."
                  value={notesById[pub.id] ?? ""}
                  onChange={(e) =>
                    setNotesById((prev) => ({
                      ...prev,
                      [pub.id]: e.target.value,
                    }))
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  onClick={() => handleTitleNotesSave(pub.id)}
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando…" : "Guardar título y notas"}
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-4 md:flex-row">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                  Estado
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(
                      pub.id,
                      event.target.value as PublicationStatus,
                    )
                  }
                  disabled={isSaving}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                  Enlace de contenido
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    className="w-[420px] flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
                    placeholder="https://..."
                    value={urlById[pub.id] ?? ""}
                    onChange={(event) =>
                      setUrlById((prev) => ({
                        ...prev,
                        [pub.id]: event.target.value,
                      }))
                    }
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={() => handleUrlSave(pub.id)}
                    disabled={isSaving}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-rose-600">{error}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
