"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  SETTLEMENT_HINT,
  SETTLEMENTS,
  funds,
  type Settlement,
  type Style,
  type Vehicle,
} from "@/lib/funds";
import { vehicleBadge } from "@/lib/labels";
import { formatDate, formatNzdMillion, formatPct } from "@/lib/utils";

const settlementRank: Record<Settlement, number> = {
  "T+0": 0,
  "T+1": 1,
  "T+2": 2,
  "T+3": 3,
  Restricted: 4,
  Closed: 5,
};

const vehicles: Array<"All" | Vehicle> = [
  "All",
  "Retail PIE",
  "KiwiSaver",
  "Workplace / Super",
  "ETF",
  "Closed",
];

const styles: Array<"All" | Style> = [
  "All",
  "Core cash / MMF",
  "Enhanced cash",
  "Bank-deposit PIE",
  "Cash-plus / short duration",
];

export function FundsExplorer() {
  const [query, setQuery] = useState("");
  const [vehicle, setVehicle] = useState<(typeof vehicles)[number]>("All");
  const [style, setStyle] = useState<(typeof styles)[number]>("All");
  const [settlement, setSettlement] = useState<"All" | Settlement>("All");
  const [sort, setSort] = useState<"fum" | "fee" | "return" | "name" | "liquidity">("fum");

  const rows = useMemo(() => {
    const filtered = funds.filter((fund) => {
      const haystack =
        `${fund.name} ${fund.manager} ${fund.fnd ?? ""} ${fund.benchmark} ${fund.settlement} ${fund.liquidity}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesVehicle = vehicle === "All" || fund.vehicle === vehicle;
      const matchesStyle = style === "All" || fund.style === style;
      const matchesSettlement = settlement === "All" || fund.settlement === settlement;
      return matchesQuery && matchesVehicle && matchesStyle && matchesSettlement;
    });

    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "fee") return (a.feePercent ?? 99) - (b.feePercent ?? 99);
      if (sort === "liquidity") {
        return settlementRank[a.settlement] - settlementRank[b.settlement];
      }
      if (sort === "return") {
        return (b.return3yAfterFeesTax ?? -1) - (a.return3yAfterFeesTax ?? -1);
      }
      return (b.fumMillion ?? -1) - (a.fumMillion ?? -1);
    });
  }, [query, vehicle, style, settlement, sort]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Fund, manager, FND, T+0"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Vehicle
          </span>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={vehicle}
            onChange={(event) =>
              setVehicle(event.target.value as (typeof vehicles)[number])
            }
          >
            {vehicles.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mandate style
          </span>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={style}
            onChange={(event) =>
              setStyle(event.target.value as (typeof styles)[number])
            }
          >
            {styles.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Liquidity
          </span>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={settlement}
            onChange={(event) =>
              setSettlement(event.target.value as "All" | Settlement)
            }
          >
            <option value="All">All</option>
            {SETTLEMENTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">
          {rows.length} fund{rows.length === 1 ? "" : "s"}
        </p>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as typeof sort)
            }
          >
            <option value="fum">FUM (largest)</option>
            <option value="fee">Fee (lowest)</option>
            <option value="return">3-year return</option>
            <option value="liquidity">Liquidity (fastest)</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3 font-medium">Fund</th>
              <th className="px-3 py-3 font-medium">Vehicle</th>
              <th className="px-3 py-3 font-medium">Liquidity</th>
              <th className="px-3 py-3 font-medium">FUM</th>
              <th className="px-3 py-3 font-medium">Fee</th>
              <th className="px-3 py-3 font-medium">3y ret.</th>
              <th className="px-3 py-3 font-medium">1y ret.</th>
              <th className="px-3 py-3 font-medium">Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                  No funds match those filters. Clear search or switch vehicle.
                </td>
              </tr>
            ) : (
              rows.map((fund) => (
                <tr key={fund.slug} className="border-t border-border/80 hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <Link href={`/funds/${fund.slug}`} className="font-medium text-foreground hover:text-primary">
                      {fund.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {fund.manager}
                      {fund.fnd ? ` · ${fund.fnd}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={vehicleBadge(fund.vehicle)}>{fund.vehicle}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{fund.style}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium tabular-nums">{fund.settlement}</p>
                    <p className="text-xs text-muted-foreground">
                      {SETTLEMENT_HINT[fund.settlement]}
                    </p>
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {formatNzdMillion(fund.fumMillion)}
                    <p className="text-xs text-muted-foreground">{formatDate(fund.fumAsOf)}</p>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{formatPct(fund.feePercent)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatPct(fund.return3yAfterFeesTax)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatPct(fund.return1yAfterFeesTax)}</td>
                  <td className="max-w-[220px] px-3 py-3 text-xs text-muted-foreground">
                    {fund.benchmark}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
