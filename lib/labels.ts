import type { GeniusReserve, Vehicle } from "@/lib/funds";

export function vehicleBadge(
  vehicle: Vehicle,
): "kiwi" | "retail" | "etf" | "work" | "closed" {
  if (vehicle === "KiwiSaver") return "kiwi";
  if (vehicle === "ETF") return "etf";
  if (vehicle === "Workplace / Super") return "work";
  if (vehicle === "Closed") return "closed";
  return "retail";
}

export function geniusBadge(status: GeniusReserve): "pass" | "warn" | "fail" {
  if (status === "Yes") return "pass";
  if (status === "Partial") return "warn";
  return "fail";
}
