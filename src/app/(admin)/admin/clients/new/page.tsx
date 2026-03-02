import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminShell from "../../_components/AdminShell";
import NewClientForm from "./NewClientForm";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      title="Nuevo cliente"
      subtitle="Agrega un cliente de marketing."
    >
      <NewClientForm />
    </AdminShell>
  );
}
