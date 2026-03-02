"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  active: boolean;
}

interface Publication {
  id: string;
  date: string;
  type: "POST" | "HISTORIA" | "REEL" | "PAUTA";
  status: string;
  title: string | null;
  notes: string | null;
  contentUrl: string | null;
  clientId: string;
  clientName: string;
  clientActive: boolean;
}

interface Props {
  publications: Publication[];
  clients: Client[];
  selectedClientId: string | null;
  visibleClientIds: Set<string>;
}

// ─── Paleta por cliente ───────────────────────────────────────────────────────
const PALETTE = [
  {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
    ring: "ring-blue-300",
  },
  {
    bg: "bg-violet-100",
    text: "text-violet-700",
    dot: "bg-violet-500",
    ring: "ring-violet-300",
  },
  {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
    ring: "ring-orange-300",
  },
  {
    bg: "bg-teal-100",
    text: "text-teal-700",
    dot: "bg-teal-500",
    ring: "ring-teal-300",
  },
  {
    bg: "bg-pink-100",
    text: "text-pink-700",
    dot: "bg-pink-500",
    ring: "ring-pink-300",
  },
  {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-300",
  },
  {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    ring: "ring-indigo-300",
  },
  {
    bg: "bg-rose-100",
    text: "text-rose-700",
    dot: "bg-rose-500",
    ring: "ring-rose-300",
  },
  {
    bg: "bg-lime-100",
    text: "text-lime-700",
    dot: "bg-lime-500",
    ring: "ring-lime-300",
  },
  {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
    ring: "ring-cyan-300",
  },
] as const;

type PaletteEntry = (typeof PALETTE)[number];

// ─── Iconos por tipo ──────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  POST: "Post",
  HISTORIA: "Historia",
  REEL: "Reel",
  PAUTA: "Pauta",
};

// ─── Días de la semana (lunes→domingo) ───────────────────────────────────────
const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTH_FMT = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function todayKey() {
  return toDateKey(new Date());
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function GlobalCalendar({
  publications,
  clients,
  selectedClientId,
  visibleClientIds,
}: Props) {
  const now = new Date();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!calendarRef.current) return;
    setIsExporting(true);
    // Allow React to re-render with all publications visible before capturing
    await new Promise((resolve) => setTimeout(resolve, 150));
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let remaining = imgHeight;
      let pos = margin;
      pdf.addImage(imgData, "PNG", margin, pos, imgWidth, imgHeight);
      remaining -= pageHeight - margin * 2;
      while (remaining > 0) {
        pdf.addPage();
        pos = margin - (imgHeight - remaining);
        pdf.addImage(imgData, "PNG", margin, pos, imgWidth, imgHeight);
        remaining -= pageHeight - margin * 2;
      }
      const monthLabel = MONTH_FMT.format(currentMonth).replace(/\s+/g, "-");
      pdf.save(`Calendario-Global-${monthLabel}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleExpand = (key: string) =>
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Color map por cliente (estable por índice para consistencia visual)
  const colorMap = new Map<string, PaletteEntry>();
  clients.forEach((client, idx) => {
    colorMap.set(client.id, PALETTE[idx % PALETTE.length]!);
  });

  // ── Filtrar publicaciones para el mes y cliente seleccionado ─────────────
  const visiblePubs = publications.filter((pub) => {
    const d = new Date(pub.date);
    const matchMonth = d.getFullYear() === year && d.getMonth() === month;
    const matchClient = !selectedClientId || pub.clientId === selectedClientId;
    return matchMonth && matchClient;
  });

  // ── Agrupar por fecha ─────────────────────────────────────────────────────
  const byDate = new Map<string, Publication[]>();
  visiblePubs.forEach((pub) => {
    const key = new Date(pub.date).toISOString().slice(0, 10);
    const list = byDate.get(key) ?? [];
    list.push(pub);
    byDate.set(key, list);
  });

  // ── Construir grilla del mes (semanas lunes→domingo) ──────────────────────
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Lunes = 0
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const cells: (Date | null)[] = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    return new Date(year, month, dayNum);
  });

  const today = todayKey();

  // ── Stats ─────────────────────────────────────────────────────────────────
  const postCount = visiblePubs.filter((p) => p.type === "POST").length;
  const historiaCount = visiblePubs.filter((p) => p.type === "HISTORIA").length;
  const reelCount = visiblePubs.filter((p) => p.type === "REEL").length;

  return (
    <div
      ref={calendarRef}
      className="flex-1 min-w-0 rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
    >
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 transition"
            aria-label="Mes anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <h2 className="min-w-[160px] text-center text-base font-semibold capitalize text-neutral-900">
            {MONTH_FMT.format(currentMonth)}
          </h2>

          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 transition"
            aria-label="Mes siguiente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            onClick={() =>
              setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1))
            }
            className="ml-1 rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 transition"
          >
            Hoy
          </button>
        </div>

        {/* Stats rápidas + botón PDF */}
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-700">
            {visiblePubs.length} total
          </span>
          {postCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
              {postCount} post{postCount !== 1 && "s"}
            </span>
          )}
          {historiaCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-700">
              {historiaCount} historia{historiaCount !== 1 && "s"}
            </span>
          )}
          {reelCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1 font-medium text-pink-700">
              {reelCount} reel{reelCount !== 1 && "s"}
            </span>
          )}

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
          >
            {isExporting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5 animate-spin"
              >
                <path
                  fillRule="evenodd"
                  d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08 1.011.75.75 0 1 1-1.3-.75 6 6 0 0 1 9.44-1.348l.842.841V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.348l-.842-.841v1.175a.75.75 0 0 1-1.5 0V9.5a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H4.076l.84.841a4.5 4.5 0 0 0 7.08-1.011.75.75 0 0 1 1.43.397Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.25 10.25a.75.75 0 0 0 1.5 0V4.56l1.97 1.97a.75.75 0 1 0 1.06-1.06l-3.25-3.25a.75.75 0 0 0-1.06 0L4.22 5.47a.75.75 0 0 0 1.06 1.06l1.97-1.97v5.69ZM3.5 13.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isExporting ? "Generando..." : "PDF"}
          </button>
        </div>
      </div>

      {/* ── Leyenda de clientes ──────────────────────────────────────────── */}
      {!selectedClientId && clients.filter((c) => c.active).length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-5 py-2.5">
          {clients
            .filter((c) => c.active)
            .map((client) => {
              const color = colorMap.get(client.id)!;
              return (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition hover:opacity-80 ${color.bg} ${color.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                  {client.name}
                </Link>
              );
            })}
        </div>
      )}

      {/* ── Cabecera días ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Grilla del calendario ────────────────────────────────────────── */}
      <div className="grid grid-cols-7 divide-x divide-y divide-neutral-100">
        {cells.map((date, i) => {
          if (!date) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-[90px] bg-neutral-50/60"
              />
            );
          }

          const key = toDateKey(date);
          const pubs = byDate.get(key) ?? [];
          const isToday = key === today;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isExpanded = expandedDays.has(key);
          const visiblePubsForDay =
            isExpanded || isExporting ? pubs : pubs.slice(0, 4);

          return (
            <div
              key={key}
              className={`relative p-1.5 transition ${
                isExporting ? "" : "min-h-[90px]"
              } ${
                isToday
                  ? "bg-neutral-300 text-white"
                  : isWeekend
                    ? "bg-neutral-50/70"
                    : "bg-white hover:bg-neutral-50"
              }`}
            >
              {/* Número del día */}
              <div
                className={`mb-1 flex items-center justify-end text-xs font-semibold ${
                  isToday ? "text-white" : "text-neutral-400"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    isToday ? "bg-white text-neutral-900" : ""
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Publicaciones */}
              <div className="space-y-0.5">
                {visiblePubsForDay.map((pub) => {
                  const color = colorMap.get(pub.clientId);
                  return (
                    <button
                      key={pub.id}
                      onClick={() => setSelectedPub(pub)}
                      title={`${pub.clientName} · ${TYPE_LABEL[pub.type] ?? pub.type}${pub.title ? ` · ${pub.title}` : ""}`}
                      className={`flex w-full items-center rounded-md px-1 py-[2px] text-left font-medium leading-none transition hover:opacity-80 ${
                        isExporting
                          ? "text-[8px]"
                          : "gap-1 truncate text-[10px]"
                      } ${
                        isToday
                          ? "bg-white/20 text-white"
                          : `${color?.bg ?? "bg-neutral-100"} ${color?.text ?? "text-neutral-700"}`
                      }`}
                    >
                      {!isExporting && (
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            isToday
                              ? "bg-white/80"
                              : (color?.dot ?? "bg-neutral-400")
                          }`}
                        />
                      )}
                      <span
                        className={
                          isExporting
                            ? "w-full break-all text-center leading-tight"
                            : "truncate"
                        }
                      >
                        {pub.title ??
                          `${TYPE_LABEL[pub.type] ?? pub.type} · ${pub.clientName}`}
                      </span>
                    </button>
                  );
                })}

                {/* Overflow: +N más / colapsar */}
                {pubs.length > 4 && !isExporting && (
                  <button
                    onClick={() => toggleExpand(key)}
                    className={`w-full text-left px-1.5 text-[10px] font-semibold transition hover:underline ${
                      isToday
                        ? "text-white/70"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {isExpanded ? "− Ver menos" : `+${pubs.length - 4} más`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Estado vacío ─────────────────────────────────────────────────── */}
      {visiblePubs.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 opacity-40"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>Sin publicaciones para este mes</span>
        </div>
      )}

      {/* ── Modal de publicación ──────────────────────────────────────────── */}
      {selectedPub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPub(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const color = colorMap.get(selectedPub.clientId);
                    return (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          color
                            ? `${color.bg} ${color.text}`
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {selectedPub.clientName}
                      </span>
                    );
                  })()}
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                    {TYPE_LABEL[selectedPub.type] ?? selectedPub.type}
                  </span>
                </div>
                <p className="mt-2 text-base font-semibold text-neutral-900">
                  {selectedPub.title ??
                    `${TYPE_LABEL[selectedPub.type] ?? selectedPub.type} sin título`}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {new Intl.DateTimeFormat("es-ES", {
                    dateStyle: "long",
                  }).format(new Date(selectedPub.date))}
                </p>
              </div>
              <button
                onClick={() => setSelectedPub(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 transition"
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

            {/* Estado */}
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  selectedPub.status === "COMPLETADA"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedPub.status === "EN_PROCESO"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {selectedPub.status === "COMPLETADA"
                  ? "Completada"
                  : selectedPub.status === "EN_PROCESO"
                    ? "En proceso"
                    : "Pendiente"}
              </span>
            </div>

            {/* Notas */}
            {selectedPub.notes && (
              <div className="mb-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Notas
                </p>
                <p>{selectedPub.notes}</p>
              </div>
            )}

            {/* URL */}
            {selectedPub.contentUrl && (
              <a
                href={selectedPub.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-neutral-400"
                >
                  <path d="M8.914 6.025a.75.75 0 1 0-1.042 1.08 2.5 2.5 0 0 1 0 3.79l-1.5 1.5a2.5 2.5 0 0 1-3.536-3.536l.75-.75a.75.75 0 0 0-1.06-1.06l-.75.75a4 4 0 1 0 5.656 5.656l1.5-1.5a4 4 0 0 0 0-5.657v.001Zm1.054-1.081a4 4 0 0 0-5.657 0l-1.5 1.5a4 4 0 0 0 5.657 5.657l.75-.75a.75.75 0 0 0-1.06-1.06l-.75.75a2.5 2.5 0 1 1-3.536-3.536l1.5-1.5a2.5 2.5 0 0 1 3.536 3.536.75.75 0 1 0 1.06 1.06 4 4 0 0 0 0-5.657Z" />
                </svg>
                <span className="truncate">{selectedPub.contentUrl}</span>
              </a>
            )}

            {/* Enlace al cliente */}
            <Link
              href={`/admin/clients/${selectedPub.clientId}`}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
              onClick={() => setSelectedPub(null)}
            >
              Ver cliente
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
