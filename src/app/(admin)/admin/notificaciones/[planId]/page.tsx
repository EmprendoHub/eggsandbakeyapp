"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Cadencia } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

function getCadenciaLabel(cadencia: Cadencia) {
  switch (cadencia) {
    case "MENSUAL":
      return "Mensual";
    case "TRIMESTRAL":
      return "Trimestral";
    case "SEMESTRAL":
      return "Semestral";
    case "ANUAL":
      return "Anual";
    default:
      return cadencia;
  }
}

export default function PlanNotificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<{
    id: string;
    clientId: string;
    startDate: Date;
    durationDays: number;
    cadence: Cadencia;
    postsCount: number;
    historiasCount: number;
    reelsCount: number;
    pautasCount: number;
    pautaMonto: number;
    client: { name: string; brandName: string | null };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewCadence, setRenewCadence] = useState<Cadencia>("MENSUAL");
  const [renewStartDate, setRenewStartDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/plan-detail?planId=${planId}`);
        if (!res.ok) {
          const errorData = await res.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.details || "Failed to fetch plan details");
        }
        const data = await res.json();
        setPlan(data.plan);

        // Set default renewal values
        setRenewCadence(data.plan.cadence);
        const nextDate = new Date(data.plan.startDate);
        nextDate.setDate(nextDate.getDate() + data.plan.durationDays);
        setRenewStartDate(nextDate.toISOString().slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  const handleRenew = async () => {
    setActionLoading(true);
    setError(null);
    try {
      // Calculate duration based on cadence
      const monthsToAdd =
        renewCadence === "TRIMESTRAL"
          ? 3
          : renewCadence === "SEMESTRAL"
            ? 6
            : renewCadence === "ANUAL"
              ? 12
              : 1;

      const [year, month, day] = renewStartDate.split("-").map(Number);
      const startDate = new Date(
        Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12, 0, 0),
      );
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
      const diffMs = endDate.getTime() - startDate.getTime();
      const renewDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      const res = await fetch(`/api/admin/renew-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          renewDays,
          cadence: renewCadence,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to renew plan");
      }
      router.push("/admin/notificaciones?success=renewed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmMsg =
      "Estoy seguro de cancelar. El cliente se desactivará cuando expire.";
    if (!confirm(confirmMsg)) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/cancel-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) {
        throw new Error("Failed to cancel plan");
      }
      router.push("/admin/notificaciones?success=canceled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-neutral-900">
            Calendario no encontrado
          </h1>
          <Link href="/admin/notificaciones" className="mt-4 text-blue-600">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  const expirationDate = new Date(plan.startDate);
  expirationDate.setDate(expirationDate.getDate() + plan.durationDays);

  const daysUntilExpiration = Math.ceil(
    (expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <Link href="/admin/notificaciones" className="text-sm text-blue-600">
          Volver
        </Link>

        {/* Card */}
        <div className="mt-8 rounded-3xl border border-neutral-200 bg-white shadow-lg">
          {/* Status Banner */}
          <div className="border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {plan.client.name}
                </h1>
                {plan.client.brandName && (
                  <p className="mt-1 text-sm text-neutral-600">
                    {plan.client.brandName}
                  </p>
                )}
              </div>
              <div className="rounded-full bg-amber-100 px-4 py-2">
                <span className="text-sm font-semibold text-amber-700">
                  {daysUntilExpiration} días
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 px-8 py-8">
            {/* Plan Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                Información del calendario
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Inicia
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {dateFormatter.format(new Date(plan.startDate))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Expira
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {dateFormatter.format(expirationDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Cadencia
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {getCadenciaLabel(plan.cadence)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Posts
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {plan.postsCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Historias
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {plan.historiasCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Reels
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {plan.reelsCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Pautas
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {plan.pautasCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Renew Section */}
            <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Renovar calendario
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Configura la nueva cadencia y fecha de inicio del calendario
                  renovado.
                </p>
              </div>
              <div className="grid gap-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Cadencia
                  <select
                    value={renewCadence}
                    onChange={(e) =>
                      setRenewCadence(e.target.value as Cadencia)
                    }
                    className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="MENSUAL">Mensual</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-neutral-700">
                  Fecha de inicio
                  <input
                    type="date"
                    value={renewStartDate}
                    onChange={(e) => setRenewStartDate(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
              </div>
              <button
                onClick={handleRenew}
                disabled={actionLoading}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? "Procesando..." : "Renovar calendario"}
              </button>
            </div>

            {/* Cancel Section */}
            <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50 p-6">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Cancelar calendario
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  El cliente y sus calendarios se desactivaran después de la
                  fecha de expiracion.
                </p>
              </div>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="w-full rounded-lg border-2 border-red-600 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {actionLoading ? "Procesando..." : "Cancelar calendario"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
