"use client";

interface DateInputProps {
  name: string;
  required?: boolean;
  className?: string;
}

export default function DateInput({
  name,
  required,
  className,
}: DateInputProps) {
  return (
    <input
      name={name}
      type="date"
      required={required}
      className={className}
      onClick={(e) => {
        try {
          (e.currentTarget as HTMLInputElement).showPicker();
        } catch {
          // showPicker not supported in all browsers, falls back to native behavior
        }
      }}
    />
  );
}
