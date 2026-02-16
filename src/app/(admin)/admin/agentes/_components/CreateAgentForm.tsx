"use client";

import { useState } from "react";

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

  const handleGenerate = () => {
    setPassword(generatePassword());
  };

  return (
    <form action={onCreate} className="mt-6 grid gap-4">
      <label className="block text-sm font-medium text-neutral-700">
        Nombre
        <input
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Email
        <input
          name="email"
          type="email"
          required
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
  );
}
