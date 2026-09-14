import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(value: string) {
  return value
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(value?: Date | string | null) {
  if (!value) return "No date";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "No date" : format(date, "dd MMM yyyy");
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) return "No date";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "No date"
    : format(date, "dd MMM yyyy, h:mm a");
}

export function isValidExternalUrl(value?: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
