import { cn, titleCase } from "../../lib/utils";
import type { ContentStatus } from "../../types";

const tone: Record<ContentStatus, string> = {
  idea: "bg-white text-ink/70 border-line",
  brief: "bg-gold/10 text-gold border-gold/20",
  "shoot-planned": "bg-moss/10 text-moss border-moss/20",
  shot: "bg-moss/15 text-moss border-moss/25",
  editing: "bg-rosewood/10 text-rosewood border-rosewood/20",
  ready: "bg-ink text-white border-ink",
  scheduled: "bg-gold text-white border-gold",
  published: "bg-moss text-white border-moss",
  cancelled: "bg-ink/10 text-ink/55 border-ink/10",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-bold", tone[status])}>
      {titleCase(status)}
    </span>
  );
}
