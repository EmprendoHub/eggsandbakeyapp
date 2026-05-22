"use client";

import { useRef, useState } from "react";

interface CreateAgentFormProps {
  onCreate: (formData: FormData) => void;
}

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*?";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

export default function CreateAgentForm({ onCreate }: CreateAgentFormProps) {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState<{ name: string; password: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleGenerate = () => setPassword(generatePassword());

  async function handleSubmit(formData: FormData) {
    const agentName = String(formData.get("name") ?? "").trim();
    const agentPassword = String(formData.get("password") ?? "");
    await onCreate(formData);
    setSaved({ name: agentName, password: agentPassword });
    setName("");
    setEmail("");
    setPassword("");
    formRef.current?.reset();
  }

  async function copyPassword() {
    if (!saved) return;
    await navigator.clipboard.writeText(saved.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {saved ? (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm text-green-800">
            <span className="font-semibold">{saved.name}</span> creado —{" "}
            <span className="font-mono">{saved.password}</span>
          </p>
          <button
            type="button"
            onClick={copyPassword}
            className="ml-4 shrink-0 rounded-xl border border-green-300 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
          >
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      ) : null}

      <form ref={formRef} action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block text-sm font-medium text-neutral-700">
          Nombre
          <input
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Email
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Contraseña
          <div className="mt-2 flex gap-2">
            <input
              name="password"
              type="text"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
            />
            <button
              type="button"
              onClick={handleGenerate}
              className="whitespace-nowrap rounded-2xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Generar
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="w-fit rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Guardar agente
        </button>
      </form>
    </>
  );
}
