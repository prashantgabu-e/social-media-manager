import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>}
      <textarea
        className={cn(
          "min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ink",
          error && "border-rosewood",
          className,
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-rosewood">{error}</span>}
    </label>
  );
}
