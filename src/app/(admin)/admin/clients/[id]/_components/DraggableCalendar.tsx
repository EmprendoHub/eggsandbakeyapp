"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicationModal from "./PublicationModal";

interface Publication {
  id: string;
  date: Date;
  type: "POST" | "HISTORIA" | "REEL";
  status: string;
  title?: string | null;
  notes?: string | null;
  contentUrl?: string | null;
  assignedAgentId?: string | null;
}

interface CalendarProps {
  plans?: Array<{
    id: string;
    startDate: Date;
    durationDays: number;
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
  const [draggedPub, setDraggedPub] = useState<string | null>(null);
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const safePlans = plans ?? [];

  const availableMonths = (() => {
    const months: Date[] = [];
    const seen = new Set<string>();

    safePlans.forEach((plan) => {
      const start = new Date(plan.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + plan.durationDays - 1);

      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

      while (cursor <= endMonth) {
        const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
        if (!seen.has(key)) {
          months.push(new Date(cursor));
          seen.add(key);
        }
        cursor.setMonth(cursor.getMonth() + 1);
      }
    });

    months.sort((a, b) => a.getTime() - b.getTime());
    return months;
  })();

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (availableMonths.length === 0) {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (initialMonth) {
      const initialKey = new Date(
        initialMonth.getFullYear(),
        initialMonth.getMonth(),
        1,
      ).getTime();
      const initialMatch = availableMonths.find(
        (month) => month.getTime() === initialKey,
      );
      if (initialMatch) {
        return initialMatch;
      }
    }

    const now = new Date();
    const nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const match = availableMonths.find(
      (month) => month.getTime() === nowMonth.getTime(),
    );
    return match ?? availableMonths[availableMonths.length - 1];
  });

  const activePlan = (() => {
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    return safePlans.find((plan) => {
      const start = new Date(plan.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + plan.durationDays - 1);
      return start <= monthEnd && end >= monthStart;
    });
  })();

  // Get days for current month
  const getDaysInMonth = () => {
    if (!activePlan) {
      return [];
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];
    const start = new Date(activePlan.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + activePlan.durationDays - 1);

    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      if (current >= start && current <= end) {
        days.push(new Date(current));
      }
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

  const handleExportPdf = async () => {
    if (!calendarRef.current || !activePlan) {
      return;
    }

    setIsExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let remainingHeight = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight - margin * 2;

      while (remainingHeight > 0) {
        pdf.addPage();
        position = margin - (imgHeight - remainingHeight);
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight - margin * 2;
      }

      const fileName = `Calendario-${clientName}-${monthFormatter
        .format(currentMonth)
        .replace(/\s+/g, "-")}.pdf`;
      pdf.save(fileName);
    } finally {
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
          {monthFormatter.format(currentMonth)}
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
        <button
          onClick={handleExportPdf}
          disabled={!activePlan || isExporting}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {isExporting ? "Generando PDF..." : "Crear PDF"}
        </button>
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
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Calendario mensual
            </p>
            <h4 className="mt-2 text-xl font-semibold text-neutral-900">
              {monthFormatter.format(currentMonth)}
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
