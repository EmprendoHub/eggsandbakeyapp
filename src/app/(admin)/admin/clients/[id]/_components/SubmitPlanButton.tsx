"use client";

import { useFormStatus } from "react-dom";

interface Props {
  isExisting: boolean;
}

export default function SubmitPlanButton({ isExisting }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-70"
    >
      {pending && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 animate-spin"
        >
          <path
            fillRule="evenodd"
            d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08 1.011.75.75 0 1 1-1.3-.75 6 6 0 0 1 9.44-1.348l.842.841V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.348l-.842-.841v1.175a.75.75 0 0 1-1.5 0V9.5a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H4.076l.84.841a4.5 4.5 0 0 0 7.08-1.011.75.75 0 0 1 1.43.397Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {pending
        ? isExisting
          ? "Guardando…"
          : "Creando…"
        : isExisting
          ? "Guardar cambios"
          : "Crear plan y calendario"}
    </button>
  );
}
