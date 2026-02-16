"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas.");
      return;
    }

    window.location.href = result?.url ?? "/admin";
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Panel de administración
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-white/60">
            Accede con tu correo y contraseña.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-white/70">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="tu@email.com"
              />
            </label>
            <label className="block text-sm text-white/70">
              Contraseña
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="********"
              />
            </label>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-white/90 disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-neutral-950 text-white" />}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
