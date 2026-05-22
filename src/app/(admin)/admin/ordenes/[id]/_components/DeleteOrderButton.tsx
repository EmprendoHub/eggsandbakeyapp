"use client";

interface Props {
  id: string;
  action: (formData: FormData) => Promise<void>;
}

export default function DeleteOrderButton({ id, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar esta orden?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Eliminar orden
      </button>
    </form>
  );
}
