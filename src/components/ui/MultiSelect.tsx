import { Check } from "lucide-react";
import { cn, titleCase } from "../../lib/utils";

interface Props<T extends string> {
  label: string;
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  error?: string;
}

export function MultiSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: Props<T>) {
  function toggle(option: T) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition",
                active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:bg-paper",
              )}
            >
              {active && <Check size={16} />}
              {titleCase(option)}
            </button>
          );
        })}
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-rosewood">{error}</span>}
    </div>
  );
}
