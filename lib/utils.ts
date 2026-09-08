import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNzdMillion(value: number | null): string {
  if (value === null) return "Not disclosed";
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}b`;
  if (value >= 1) return `$${value.toFixed(value >= 100 ? 0 : 1)}m`;
  return `$${(value * 1000).toFixed(0)}k`;
}

export function formatPct(value: number | null, digits = 2): string {
  if (value === null) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
