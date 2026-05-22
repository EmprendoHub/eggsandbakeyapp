"use client";

import { useState } from "react";

interface Props {
  workOrderId: string;
  nextStatus: string;
  label: string;
}

export default function WorkOrderStatusButton({
  workOrderId,
  nextStatus,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch("/api/work-orders/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId, newStatus: nextStatus }),
      });
      if (res.ok) {
        setDone(true);
        // Reload page so server component re-fetches updated state
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || done}
      className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
    >
      {loading ? "Guardando…" : label}
    </button>
  );
}
