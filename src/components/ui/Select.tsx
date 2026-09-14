import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>}
      <select
        className={cn(
          "min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-ink",
          error && "border-rosewood",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs font-semibold text-rosewood">{error}</span>}
    </label>
  );
}
