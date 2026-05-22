"use client";

export default function LogoutButton() {
  return (
    <form method="POST" action="/api/auth/signout">
      <input type="hidden" name="callbackUrl" value="/admin/login" />
      <button
        type="submit"
        className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
