import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}

export function Modal({ open, title, children, onClose, wide }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-0 sm:items-center sm:p-4">
      <div
        className={cn(
          "max-h-[92vh] w-full overflow-hidden rounded-t-2xl border border-line bg-paper shadow-soft sm:rounded-2xl",
          wide ? "max-w-5xl" : "max-w-2xl",
        )}
      >
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close" className="h-10 w-10 p-0">
            <X size={20} />
          </Button>
        </div>
        <div className="max-h-[calc(92vh-4rem)] overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
