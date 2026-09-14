import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-white px-2 py-1 text-xs font-bold text-ink/70",
        className,
      )}
    >
      {children}
    </span>
  );
}
