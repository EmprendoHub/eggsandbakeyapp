"use client";

import { useState } from "react";

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*?";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

export default function ResetPasswordButton({ agentId }: { agentId: string }) {
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!confirm("¿Generar una nueva contraseña para este agente?")) return;
    setLoading(true);
    const pwd = generatePassword();
    try {
      const res = await fetch("/api/agents/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, newPassword: pwd }),
      });
      if (res.ok) {
        setNewPassword(pwd);
        setCopied(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!newPassword) return;
    await navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (newPassword) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5">
        <span className="flex-1 font-mono text-xs text-green-800">
          {newPassword}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 text-xs font-semibold text-green-700 hover:underline"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="mt-1 text-xs text-neutral-400 hover:text-neutral-700 disabled:opacity-50"
    >
      {loading ? "Generando…" : "Resetear contraseña"}
    </button>
  );
}
