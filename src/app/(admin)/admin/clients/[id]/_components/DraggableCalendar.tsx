"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicationModal from "./PublicationModal";

interface Publication {
  id: string;
  date: Date;
  type: "POST" | "HISTORIA" | "REEL" | "PAUTA";
  status: string;
  title?: string | null;
  notes?: string | null;
  contentUrl?: string | null;
  assignedAgentId?: string | null;
  monto?: number | null;
}

interface CalendarProps {
  plans?: Array<{
    id: string;
    startDate: Date;
    durationDays: number;
    cadence: string;
    publications: Publication[];
  }>;
  initialMonth?: Date | null;
  clientName: string;
  agents: Array<{ id: string; name: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

const monthFormatter = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
});

export default function DraggableCalendar({
  plans,
  initialMonth,
  clientName,
  agents,
}: CalendarProps) {
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const exportHeaderRef = useRef<HTMLDivElement | null>(null);
  const exportMonthRefsArray = useRef<(HTMLDivElement | null)[]>([]);
  const [draggedPub, setDraggedPub] = useState<string | null>(null);
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMonths, setExportMonths] = useState<Date[] | null>(null);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const safePlans = plans ?? [];

  const availableMonths = (() => {
    const periods: Date[] = [];
    const seen = new Set<string>();

    safePlans.forEach((plan) => {
      const planStart = new Date(plan.startDate);
      const planEnd = new Date(planStart);
      planEnd.setDate(planEnd.getDate() + plan.durationDays - 1);

      // Generar inicio de cada período mensual desde planStart
      let cursor = new Date(planStart);
      while (cursor <= planEnd) {
        const key = cursor.toISOString().split("T")[0];
        if (!seen.has(key)) {
          periods.push(new Date(cursor));
          seen.add(key);
        }
        // Avanzar exactamente 1 mes (mismo día del siguiente mes)
        const next = new Date(cursor);
        next.setMonth(next.getMonth() + 1);
        cursor = next;
      }
    });

    periods.sort((a, b) => a.getTime() - b.getTime());
    return periods;
  })();

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (availableMonths.length === 0) {
      return new Date();
    }

    const findPeriodContaining = (target: Date) =>
      availableMonths.find((periodStart) => {
        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        return target >= periodStart && target < periodEnd;
      });

    if (initialMonth) {
      const match = findPeriodContaining(initialMonth);
      if (match) return match;
    }

    const match = findPeriodContaining(new Date());
    return match ?? availableMonths[availableMonths.length - 1];
  });

  const activePlan = safePlans.find((plan) => {
    const start = new Date(plan.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays - 1);
    return currentMonth >= start && currentMonth <= end;
  });

  // Días del período actual: desde currentMonth hasta el mismo día del siguiente mes
  const getDaysInMonth = () => {
    if (!activePlan) return [];

    const periodStart = new Date(currentMonth);
    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const planEnd = new Date(activePlan.startDate);
    planEnd.setDate(planEnd.getDate() + activePlan.durationDays - 1);

    const rangeEnd = periodEnd < planEnd ? periodEnd : planEnd;

    const days: Date[] = [];
    for (
      let d = new Date(periodStart);
      d <= rangeEnd;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }
    return days;
  };

  const days = getDaysInMonth();

  // Group publications by date
  const publicationsByDate = new Map<string, Publication[]>();
  activePlan?.publications
    .filter((pub) => {
      if (selectedAgentId && pub.assignedAgentId !== selectedAgentId) {
        return false;
      }
      if (selectedStatus && pub.status !== selectedStatus) {
        return false;
      }
      return true;
    })
    .forEach((pub) => {
      const key = new Date(pub.date).toISOString().split("T")[0];
      const list = publicationsByDate.get(key) ?? [];
      list.push(pub);
      publicationsByDate.set(key, list);
    });

  const handleDragStart = (pubId: string) => {
    setDraggedPub(pubId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (dateKey: string) => {
    if (!draggedPub) return;

    try {
      const response = await fetch("/api/publications/move", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicationId: draggedPub,
          newDate: dateKey,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error moving publication:", error);
    }

    setDraggedPub(null);
  };

  const handlePublicationClick = (pub: Publication, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPub(pub);
  };

  const handleSavePublication = async (
    id: string,
    title: string,
    notes: string,
    contentUrl: string,
    assignedAgentId: string | null,
  ) => {
    try {
      const response = await fetch("/api/publications/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicationId: id,
          title,
          notes,
          contentUrl,
          assignedAgentId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating publication:", error);
      throw error;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "POST":
        return "Post";
      case "HISTORIA":
        return "Historia";
      case "REEL":
        return "Reel";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "POST":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "HISTORIA":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REEL":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "EN_PROCESO":
        return "bg-orange-200 text-orange-900";
      case "COMPLETADA":
        return "bg-emerald-200 text-emerald-900";
      case "PENDIENTE":
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };

  const getAgentInitials = (agentId?: string | null) => {
    if (!agentId) return "";
    const agent = agents.find((item) => item.id === agentId);
    if (!agent?.name) return "";
    const parts = agent.name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    return initials || agent.name[0]?.toUpperCase() || "";
  };

  const goToPreviousMonth = () => {
    if (availableMonths.length === 0) return;
    const index = availableMonths.findIndex(
      (month) => month.getTime() === currentMonth.getTime(),
    );
    if (index > 0) {
      setCurrentMonth(availableMonths[index - 1]);
    }
  };

  const goToNextMonth = () => {
    if (availableMonths.length === 0) return;
    const index = availableMonths.findIndex(
      (month) => month.getTime() === currentMonth.getTime(),
    );
    if (index >= 0 && index < availableMonths.length - 1) {
      setCurrentMonth(availableMonths[index + 1]);
    }
  };

  // ── Helpers para el export completo ─────────────────────────────────────
  const getPlanForMonth = (monthDate: Date) =>
    safePlans.find((plan) => {
      const start = new Date(plan.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + plan.durationDays - 1);
      return monthDate >= start && monthDate <= end;
    }) ?? null;

  const getDaysForPeriod = (
    monthDate: Date,
    plan: { startDate: Date; durationDays: number },
  ) => {
    const periodStart = new Date(monthDate);
    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const planEnd = new Date(plan.startDate);
    planEnd.setDate(planEnd.getDate() + plan.durationDays - 1);
    const rangeEnd = periodEnd < planEnd ? periodEnd : planEnd;
    const days: Date[] = [];
    for (
      let d = new Date(periodStart);
      d <= rangeEnd;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }
    return days;
  };

  const handleExportPdf = async (mode: "month" | "full") => {
    if (!activePlan) return;
    setShowPdfMenu(false);

    const monthsToExport = mode === "month" ? [currentMonth] : availableMonths;

    // Reset month refs array to match new length
    exportMonthRefsArray.current = [];
    setExportMonths(monthsToExport);
    setIsExporting(true);
    // Esperar a que React renderice el contenedor oculto
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const contentWidth = pageWidth - margin * 2;
      let currentY = margin;
      let firstPage = true;

      const captureEl = async (el: HTMLDivElement) => {
        const cvs = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
        });
        return {
          imgData: cvs.toDataURL("image/png"),
          height: (cvs.height * contentWidth) / cvs.width,
        };
      };

      const addBlock = async (el: HTMLDivElement | null) => {
        if (!el) return;
        const { imgData, height } = await captureEl(el);
        if (!firstPage && currentY + height > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        if (height > pageHeight - margin * 2) {
          const scale = (pageHeight - margin * 2) / height;
          const scaledH = height * scale;
          const scaledW = contentWidth * scale;
          pdf.addImage(
            imgData,
            "PNG",
            margin + (contentWidth - scaledW) / 2,
            currentY,
            scaledW,
            scaledH,
          );
          currentY += scaledH + 12;
        } else {
          pdf.addImage(imgData, "PNG", margin, currentY, contentWidth, height);
          currentY += height + 12;
        }
        firstPage = false;
      };

      // 1. Header
      await addBlock(exportHeaderRef.current);

      // 2. Each month block captured independently (no mid-cell cuts)
      for (const monthEl of exportMonthRefsArray.current) {
        await addBlock(monthEl);
      }

      const suffix =
        mode === "month"
          ? monthFormatter.format(currentMonth).replace(/\s+/g, "-")
          : "Completo";
      pdf.save(`Calendario-${clientName}-${suffix}.pdf`);
    } finally {
      setExportMonths(null);
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-4">
        <button
          onClick={goToPreviousMonth}
          disabled={
            availableMonths.findIndex(
              (month) => month.getTime() === currentMonth.getTime(),
            ) <= 0
          }
          className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          ← Mes anterior
        </button>
        <h3 className="text-lg font-semibold text-neutral-900">
          {(() => {
            const s = new Date(currentMonth);
            const e = new Date(s);
            e.setMonth(e.getMonth() + 1);
            return `${dateFormatter.format(s)} – ${dateFormatter.format(e)}`;
          })()}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700"
          >
            <option value="">Todos los agentes</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="COMPLETADA">Completada</option>
          </select>
        </div>
        {/* PDF dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPdfMenu((v) => !v)}
            disabled={!activePlan || isExporting}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {isExporting ? (
              "Generando PDF..."
            ) : (
              <>
                PDF
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
          {showPdfMenu && !isExporting && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowPdfMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
                <button
                  onClick={() => handleExportPdf("month")}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-neutral-50"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 10.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                      <path
                        fillRule="evenodd"
                        d="M3.75 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3h.75A2.25 2.25 0 0 1 14 5.25v7.5A2.25 2.25 0 0 1 11.75 15h-7.5A2.25 2.25 0 0 1 2 12.75v-7.5A2.25 2.25 0 0 1 4.25 3H5V1.75A.75.75 0 0 1 5.75 1h-2ZM3.5 7.75A.75.75 0 0 1 4.25 7h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      Este mes
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {dateFormatter.format(currentMonth)}
                    </span>
                  </span>
                </button>
                <div className="mx-4 border-t border-neutral-100" />
                <button
                  onClick={() => handleExportPdf("full")}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-neutral-50"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm5.5 4.25a.75.75 0 0 0-1.5 0v2.69l-.72-.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 0 0-1.06-1.06l-.72.72V6.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-semibold text-neutral-900">
                      Plan completo
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {activePlan
                        ? `${dateFormatter.format(new Date(activePlan.startDate))} – ${dateFormatter.format(new Date(new Date(activePlan.startDate).getTime() + activePlan.durationDays * 24 * 60 * 60 * 1000))}`
                        : `${availableMonths.length} mes${availableMonths.length !== 1 ? "es" : ""}`}
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
        <button
          onClick={goToNextMonth}
          disabled={
            availableMonths.findIndex(
              (month) => month.getTime() === currentMonth.getTime(),
            ) >=
            availableMonths.length - 1
          }
          className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Mes siguiente →
        </button>
      </div>

      {activePlan ? (
        <div
          ref={calendarRef}
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          {/* Encabezado visible solo en el PDF */}
          {isExporting && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl bg-neutral-50 px-5 py-4">
              <div className="space-y-1">
                <p className="text-base font-bold text-neutral-900">
                  {clientName}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Inicio:</span>{" "}
                  {dateFormatter.format(new Date(activePlan.startDate))}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Finalización:</span>{" "}
                  {dateFormatter.format(
                    new Date(
                      new Date(activePlan.startDate).getTime() +
                        activePlan.durationDays * 24 * 60 * 60 * 1000,
                    ),
                  )}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Paquete:</span>{" "}
                  {activePlan.cadence === "TRIMESTRAL"
                    ? "Trimestral"
                    : activePlan.cadence === "SEMESTRAL"
                      ? "Semestral"
                      : activePlan.cadence === "ANUAL"
                        ? "Anual"
                        : "Mensual"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Agencia
                </p>
                <p className="text-base font-bold text-neutral-900">
                  Eggs&amp;Bakey
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Calendario de contenido
            </p>
            <h4 className="mt-2 text-xl font-semibold text-neutral-900">
              {(() => {
                const s = new Date(currentMonth);
                const e = new Date(s);
                e.setMonth(e.getMonth() + 1);
                return `${dateFormatter.format(s)} – ${dateFormatter.format(e)}`;
              })()}
            </h4>
            <p className="mt-1 text-sm font-medium text-neutral-600">
              {clientName}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {days.map((date) => {
              const key = date.toISOString().split("T")[0];
              const entries = publicationsByDate.get(key) ?? [];

              return (
                <div
                  key={key}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(key)}
                  className="min-h-[120px] rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300"
                >
                  <p className="text-sm font-semibold text-neutral-900">
                    {dateFormatter.format(date)}
                  </p>
                  {entries.length === 0 ? (
                    <p className="mt-2 text-xs text-neutral-400">
                      Arrastra aquí
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          draggable
                          onDragStart={() => handleDragStart(entry.id)}
                          onClick={(e) => handlePublicationClick(entry, e)}
                          className={`flex items-start justify-between gap-2 cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition hover:shadow-md ${getTypeColor(entry.type)}`}
                        >
                          <div className="font-semibold">
                            {getTypeLabel(entry.type)}
                            {entry.title ? `: ${entry.title}` : ""}
                            {entry.type === "PAUTA" && entry.monto ? (
                              <div className="mt-0.5 font-normal text-amber-700">
                                $
                                {entry.monto.toLocaleString("es-MX", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            ) : null}
                          </div>
                          {entry.assignedAgentId ? (
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${getStatusBadgeColor(entry.status)}`}
                              title="Asignado"
                            >
                              {getAgentInitials(entry.assignedAgentId)}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          No hay un plan para este mes.
        </div>
      )}

      {/* ── Contenedor oculto para exportar PDF con todos los meses ────── */}
      {exportMonths && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "794px",
          }}
          aria-hidden="true"
        >
          {/* Encabezado del PDF */}
          <div ref={exportHeaderRef} className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-4 rounded-2xl bg-neutral-50 px-5 py-4">
              <div className="space-y-1">
                <p className="text-base font-bold text-neutral-900">
                  {clientName}
                </p>
                {activePlan && (
                  <>
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold">Inicio:</span>{" "}
                      {dateFormatter.format(new Date(activePlan.startDate))}
                    </p>
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold">Finalización:</span>{" "}
                      {dateFormatter.format(
                        new Date(
                          new Date(activePlan.startDate).getTime() +
                            activePlan.durationDays * 24 * 60 * 60 * 1000,
                        ),
                      )}
                    </p>
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold">Paquete:</span>{" "}
                      {activePlan.cadence === "TRIMESTRAL"
                        ? "Trimestral"
                        : activePlan.cadence === "SEMESTRAL"
                          ? "Semestral"
                          : activePlan.cadence === "ANUAL"
                            ? "Anual"
                            : "Mensual"}
                    </p>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Agencia
                </p>
                <p className="text-base font-bold text-neutral-900">
                  Eggs&amp;Bakey
                </p>
              </div>
            </div>
          </div>

          {/* Un bloque independiente por cada mes — capturado por separado */}
          {exportMonths.map((monthDate, idx) => {
            const plan = getPlanForMonth(monthDate);
            if (!plan) return null;
            const days = getDaysForPeriod(monthDate, plan);

            const pubsByDate = new Map<string, Publication[]>();
            plan.publications.forEach((pub) => {
              const key = new Date(pub.date).toISOString().split("T")[0];
              const list = pubsByDate.get(key) ?? [];
              list.push(pub);
              pubsByDate.set(key, list);
            });

            const periodEnd = new Date(monthDate);
            periodEnd.setMonth(periodEnd.getMonth() + 1);

            return (
              <div
                key={monthDate.toISOString()}
                ref={(el) => {
                  exportMonthRefsArray.current[idx] = el;
                }}
                className="bg-white px-6 py-4"
              >
                <h4 className="mb-3 text-sm font-semibold text-neutral-900">
                  {dateFormatter.format(monthDate)} &ndash;{" "}
                  {dateFormatter.format(periodEnd)}
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((date) => {
                    const key = date.toISOString().split("T")[0];
                    const entries = pubsByDate.get(key) ?? [];
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-neutral-200 bg-white p-2"
                      >
                        <p className="text-[10px] font-semibold text-neutral-700">
                          {dateFormatter.format(date)}
                        </p>
                        <div className="mt-1 space-y-0.5">
                          {entries.map((entry) => (
                            <div
                              key={entry.id}
                              className={`rounded px-1 py-0.5 text-[9px] font-medium leading-tight ${getTypeColor(entry.type)}`}
                            >
                              {getTypeLabel(entry.type)}
                              {entry.title ? `: ${entry.title}` : ""}
                              {entry.type === "PAUTA" && entry.monto ? (
                                <span className="ml-1 text-amber-700">
                                  $
                                  {entry.monto.toLocaleString("es-MX", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPub && (
        <PublicationModal
          publication={selectedPub}
          agents={agents}
          onClose={() => setSelectedPub(null)}
          onSave={handleSavePublication}
        />
      )}
    </div>
  );
}
