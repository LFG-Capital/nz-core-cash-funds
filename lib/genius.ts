import type { Fund, GeniusReserve, Holding } from "@/lib/funds";

/** Statutory per-instrument cap for Treasuries (GENIUS Act §4(a)(1)(A)(iii)). */
export const GENIUS_INSTRUMENT_MAX_DAYS = 93;

/** OCC March 2026 proposed portfolio weighted-average maturity cap. */
export const GENIUS_PORTFOLIO_WAM_DAYS = 20;

/** OCC weekly-liquidity bucket: due unconditionally within five business days. */
export const GENIUS_WEEKLY_LIQUIDITY_DAYS = 7;

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const SLEEVE_SLUG: Record<string, string> = {
  "amova wholesale nz cash fund": "amova-nz-cash-fund",
  "fisher institutional new zealand cash fund": "fisher-funds-cashplus-fund",
};

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function parseAsOf(iso: string | null): Date | null {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return utcDate(year, month, day);
}

function parseDateFromName(name: string): Date | null {
  const slash = name.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (slash) return utcDate(Number(slash[3]), Number(slash[2]), Number(slash[1]));

  const dayMonth = name.match(
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\b/i,
  );
  if (dayMonth) {
    const month = MONTHS[dayMonth[2].slice(0, 3).toLowerCase()];
    return utcDate(Number(dayMonth[3]), month, Number(dayMonth[1]));
  }

  const monthDay = name.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})\s+(\d{4})\b/i,
  );
  if (monthDay) {
    const month = MONTHS[monthDay[1].slice(0, 3).toLowerCase()];
    return utcDate(Number(monthDay[3]), month, Number(monthDay[2]));
  }

  const monthYear = name.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})\b/i,
  );
  if (monthYear) {
    const month = MONTHS[monthYear[1].slice(0, 3).toLowerCase()];
    const year = Number(monthYear[2]);
    return utcDate(year, month, 28);
  }

  return null;
}

function isCreditLike(name: string): boolean {
  return /\b(frn|rcd|td\b|term deposit|notice|commercial paper|nzcp|bond|stock|mortgage|rda)\b/.test(
    name.toLowerCase(),
  );
}

function isCallCash(name: string): boolean {
  if (isCreditLike(name)) return false;
  const n = name.toLowerCase();
  return /\b(call account|cash call|cash at bank|current account|deposit account|trust account|nz cash \(|bank of china deposit)\b/.test(
    n,
  );
}

function isBareBankName(name: string): boolean {
  if (isCreditLike(name) || parseDateFromName(name)) return false;
  return /^(bank of china|bank of new zealand|westpac new zealand|westpac|anz|asb|bnz|kiwibank)\b/i.test(
    name,
  );
}

function noticeDays(name: string): number | null {
  const lower = name.toLowerCase();
  const match = lower.match(/\b(\d{2,3})-?\s*day\b/);
  if (match && /notice|rda|registered deposit/.test(lower)) {
    return Number(match[1]);
  }
  return null;
}

function sleeveSlug(name: string): string | null {
  return SLEEVE_SLUG[name.toLowerCase()] ?? null;
}

/** Remaining tenor in days from the QFU as-of date. Call cash is 0. */
export function holdingTenorDays(
  holding: Holding,
  asOf: Date | null,
  universe: Fund[] = [],
  visiting: Set<string> = new Set(),
): number | null {
  const notice = noticeDays(holding.name);
  if (notice !== null) return notice;

  const slug = sleeveSlug(holding.name);
  if (slug && !visiting.has(slug)) {
    const sleeve = universe.find((fund) => fund.slug === slug);
    if (sleeve) {
      const inner = assessGenius(sleeve, universe, new Set(visiting).add(slug));
      if (inner.wadDays !== null) return inner.wadDays;
    }
  }

  if (isCallCash(holding.name) || isBareBankName(holding.name)) return 0;

  const maturity = parseDateFromName(holding.name);
  if (maturity && asOf) {
    return Math.max(0, Math.round((maturity.getTime() - asOf.getTime()) / 86_400_000));
  }

  return null;
}

export function isIneligibleReserveAsset(name: string): boolean {
  const n = name.toLowerCase();
  return (
    /mortgage|nzms/.test(n) ||
    /infratil|auckland airport|contact energy|port of tauranga|transpower/.test(n) ||
    /government stock/.test(n)
  );
}

export type GeniusAssessment = {
  reserve: GeniusReserve;
  wadDays: number | null;
  coveragePct: number;
  dailyPct: number | null;
  weeklyPct: number | null;
  ineligible: boolean;
  onlyMaturedDated: boolean;
  summary: string;
  note: string;
};

function cashLikeMandate(fund: Fund): boolean {
  return /100% cash|cash equivalent|cash call account/i.test(
    `${fund.targetMix} ${fund.actualMix ?? ""} ${fund.mandate}`,
  );
}

function statedLongDuration(fund: Fund): boolean {
  return /duration cap 2 years|two-year duration/i.test(
    `${fund.mandate} ${fund.notes ?? ""} ${fund.targetMix}`,
  );
}

function mandateIneligible(fund: Fund): boolean {
  return /mortgage-backed|first-mortgage|corporate bonds|corporate commercial paper/i.test(
    `${fund.mandate} ${fund.notes ?? ""}`,
  );
}

/**
 * Value-weighted remaining maturity of dated or call holdings.
 *
 * WAM = Σ (weight_i × remaining_maturity_i) / Σ weight_i
 *
 * remaining_maturity_i is legal remaining tenor from the QFU date:
 * cash/call = 0; notice paper = the notice period; dated paper = calendar
 * days to stated maturity. FRN interest-rate resets are ignored. Unnamed
 * residual book is excluded (not assumed to be overnight).
 */
export function assessGenius(
  fund: Fund,
  universe: Fund[] = [],
  visiting: Set<string> = new Set(),
): GeniusAssessment {
  const asOf = parseAsOf(fund.fumAsOf);
  let weightedDays = 0;
  let coveredWeight = 0;
  let dailyWeight = 0;
  let weeklyWeight = 0;
  let knownWeight = 0;
  let datedWeight = 0;
  let maturedDatedWeight = 0;
  let ineligible = mandateIneligible(fund);

  for (const holding of fund.holdings) {
    if (isIneligibleReserveAsset(holding.name)) ineligible = true;
    if (holding.weight <= 0) continue;
    knownWeight += holding.weight;

    const maturity = parseDateFromName(holding.name);
    if (maturity && asOf && !noticeDays(holding.name)) {
      datedWeight += holding.weight;
      if (maturity.getTime() < asOf.getTime()) maturedDatedWeight += holding.weight;
    }

    const tenor = holdingTenorDays(holding, asOf, universe, visiting);
    if (tenor === null) continue;
    coveredWeight += holding.weight;
    weightedDays += holding.weight * tenor;
    if (tenor <= 0) dailyWeight += holding.weight;
    if (tenor <= GENIUS_WEEKLY_LIQUIDITY_DAYS) weeklyWeight += holding.weight;
  }

  const wadDays = coveredWeight > 0 ? weightedDays / coveredWeight : null;
  const coveragePct = coveredWeight;
  const dailyPct = knownWeight > 0 ? dailyWeight : null;
  const weeklyPct = knownWeight > 0 ? weeklyWeight : null;
  const onlyMaturedDated = datedWeight > 0 && maturedDatedWeight === datedWeight;

  const singleCall =
    fund.holdings.length === 1 &&
    fund.holdings[0].weight >= 99 &&
    holdingTenorDays(fund.holdings[0], asOf, universe, visiting) === 0 &&
    !ineligible;

  let reserve: GeniusReserve;
  if (singleCall) {
    reserve = "Yes";
  } else if (ineligible) {
    reserve = "No";
  } else if (
    wadDays !== null &&
    wadDays <= GENIUS_PORTFOLIO_WAM_DAYS &&
    coveragePct >= 40 &&
    !onlyMaturedDated
  ) {
    reserve = "Yes";
  } else if (wadDays !== null && wadDays <= GENIUS_INSTRUMENT_MAX_DAYS) {
    reserve = "Partial";
  } else if (wadDays !== null && wadDays > GENIUS_INSTRUMENT_MAX_DAYS && coveragePct < 25) {
    reserve = "Partial";
  } else if (
    wadDays === null &&
    (cashLikeMandate(fund) || fund.style === "Core cash / MMF")
  ) {
    reserve = "Partial";
  } else if (wadDays === null && statedLongDuration(fund)) {
    reserve = "No";
  } else if (wadDays !== null && wadDays > GENIUS_INSTRUMENT_MAX_DAYS) {
    reserve = "No";
  } else {
    reserve = "No";
  }

  const wadLabel =
    wadDays === null ? "WAM not measurable from the extract" : `WAM ${formatGeniusWad(wadDays)}`;
  const coverLabel =
    coveredWeight > 0
      ? `on ${coveragePct.toFixed(coveragePct >= 10 ? 0 : 1)}% of fund value in the extract`
      : "no dated top holdings";
  const liquidityLabel =
    dailyPct === null
      ? ""
      : ` Named-book liquidity analog: ${Math.round(dailyPct)}% daily (call), ${Math.round(weeklyPct ?? 0)}% weekly (≤${GENIUS_WEEKLY_LIQUIDITY_DAYS} days).`;

  const note = `${wadLabel} ${coverLabel}. Duration is the value-weighted remaining maturity of the named book (GENIUS “average tenor” / OCC WAM), not a single-name test: cash/call = 0 days; notice paper uses the notice period; dated paper uses legal maturity from the QFU date; FRN resets are ignored. Residual unnamed holdings are excluded, not treated as overnight. OCC March 2026 proposal would cap reserve WAM at ${GENIUS_PORTFOLIO_WAM_DAYS} days and ask for ≥10% daily / ≥30% weekly liquidity; the Act caps each Treasury at ${GENIUS_INSTRUMENT_MAX_DAYS} days.${liquidityLabel} ${
    ineligible
      ? "Disclosed names or mandate include assets that are not cash, demand deposits or ≤93-day government paper (credit, mortgages, long government stock or corporate CP)."
      : "Named holdings are still NZD bank or agency paper, not US Treasuries or US IDI demand deposits."
  }`;

  const summary =
    wadDays === null
      ? "WAM —"
      : `WAM ${formatGeniusWad(wadDays)}${coveredWeight > 0 ? ` · ${Math.round(coveragePct)}% named` : ""}`;

  return {
    reserve,
    wadDays,
    coveragePct,
    dailyPct,
    weeklyPct,
    ineligible,
    onlyMaturedDated,
    summary,
    note,
  };
}

export function formatGeniusWad(days: number | null): string {
  if (days === null) return "—";
  if (days < 1) return "0 days";
  if (days < 10) return `${days.toFixed(1)} days`;
  return `${Math.round(days)} days`;
}

export function formatHoldingTenor(days: number | null): string {
  if (days === null) return "—";
  if (days <= 0) return "call";
  return `${Math.round(days)}d`;
}
