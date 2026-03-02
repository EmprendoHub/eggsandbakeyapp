"use client";

import { useState } from "react";
import ClientsSubmenu from "./ClientsSubmenu";
import GlobalCalendar from "./GlobalCalendar";
import ClientsFilterPanel from "./ClientsFilterPanel";

export interface ClientInfo {
  id: string;
  name: string;
  active: boolean;
}

export interface PublicationInfo {
  id: string;
  date: string; // ISO string
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
  clients: ClientInfo[];
  publications: PublicationInfo[];
}

export default function GlobalCalendarView({ clients, publications }: Props) {
  // Panel izquierdo: selección única para "enfocar" un cliente en el sidebar
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Panel derecho: set de clientes visibles en el calendario (todos activos por defecto)
  const [visibleClientIds, setVisibleClientIds] = useState<Set<string>>(
    () => new Set(clients.map((c) => c.id)),
  );

  const handleSelect = (id: string) => {
    setSelectedClientId((prev) => (prev === id ? null : id));
  };

  const handleClear = () => setSelectedClientId(null);

  const handleToggleVisible = (id: string) => {
    setVisibleClientIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleShowAll = () =>
    setVisibleClientIds(new Set(clients.map((c) => c.id)));

  const handleHideAll = () => setVisibleClientIds(new Set());

  // Filtrar publicaciones según los clientes visibles
  const filteredPublications = publications.filter((p) =>
    visibleClientIds.has(p.clientId),
  );

  return (
    <div className="flex gap-4 items-start">
      <ClientsSubmenu
        clients={clients}
        selectedClientId={selectedClientId}
        onSelect={handleSelect}
        onClear={handleClear}
      />
      <GlobalCalendar
        publications={filteredPublications}
        clients={clients}
        selectedClientId={selectedClientId}
        visibleClientIds={visibleClientIds}
      />
      <ClientsFilterPanel
        clients={clients}
        visibleClientIds={visibleClientIds}
        onToggle={handleToggleVisible}
        onShowAll={handleShowAll}
        onHideAll={handleHideAll}
      />
    </div>
  );
}
