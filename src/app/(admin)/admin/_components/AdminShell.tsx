import Link from "next/link";
import SignOutButton from "./SignOutButton";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AdminShell({
  title,
  subtitle,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Panel de administración
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm font-medium text-neutral-600 md:flex">
              <Link className="hover:text-neutral-900" href="/admin">
                Clientes
              </Link>
              <Link className="hover:text-neutral-900" href="/admin/agentes">
                Agentes
              </Link>
              <Link className="hover:text-neutral-900" href="/admin/users">
                Administradores
              </Link>
            </nav>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
