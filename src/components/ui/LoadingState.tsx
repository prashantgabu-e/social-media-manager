import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading planner" }: { label?: string }) {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-xl border border-line bg-white">
      <div className="flex items-center gap-3 text-sm font-bold text-ink/60">
        <Loader2 className="animate-spin" size={20} />
        {label}
      </div>
    </div>
  );
}
