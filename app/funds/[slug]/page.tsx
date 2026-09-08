import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { GENIUS_HINT, SETTLEMENT_HINT, funds, getFund } from "@/lib/funds";
import { assessGenius, formatGeniusWad, formatHoldingTenor, holdingTenorDays } from "@/lib/genius";
import { geniusBadge, vehicleBadge } from "@/lib/labels";
import { formatDate, formatNzdMillion, formatPct } from "@/lib/utils";

export function generateStaticParams() {
  return funds.map((fund) => ({ slug: fund.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = getFund(slug);
  if (!fund) return { title: "Fund not found" };
  return { title: fund.name };
}

export default async function FundPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = getFund(slug);
  if (!fund) notFound();
  const genius = assessGenius(fund, funds);
  const asOf = fund.fumAsOf ? new Date(`${fund.fumAsOf}T00:00:00Z`) : null;

  const facts = [
    { label: "FUM", value: formatNzdMillion(fund.fumMillion), hint: formatDate(fund.fumAsOf) },
    { label: "Annual fee", value: formatPct(fund.feePercent), hint: fund.managerFee !== undefined ? `Manager ${formatPct(fund.managerFee ?? null)}` : "From latest QFU" },
    { label: "3-year return", value: formatPct(fund.return3yAfterFeesTax), hint: "After fees and tax" },
    { label: "1-year return", value: formatPct(fund.return1yAfterFeesTax), hint: fund.return1yAfterFeesBeforeTax !== undefined ? `${formatPct(fund.return1yAfterFeesBeforeTax)} before tax` : "After fees and tax" },
    { label: "Risk indicator", value: fund.riskIndicator ? `${fund.riskIndicator} / 7` : "—", hint: "FMA scale" },
    { label: "Investors", value: fund.members ? fund.members.toLocaleString("en-NZ") : "—", hint: "Where disclosed" },
    { label: "GENIUS reserve", value: genius.reserve, hint: genius.summary },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/funds" className="text-sm text-primary hover:underline">
        ← All funds
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={vehicleBadge(fund.vehicle)}>{fund.vehicle}</Badge>
            <Badge variant="muted">{fund.style}</Badge>
            {fund.pie ? <Badge variant="outline">PIE</Badge> : null}
            {!fund.open ? <Badge variant="closed">Closed</Badge> : null}
            <Badge variant={geniusBadge(genius.reserve)}>
              GENIUS {genius.reserve}
            </Badge>
          </div>
          <h1 className="mt-3 font-serif text-4xl">{fund.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {fund.manager}
            {fund.fnd ? ` · ${fund.fnd}` : ""}
            {fund.started ? ` · started ${formatDate(fund.started)}` : ""}
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <article key={fact.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-1 font-serif text-2xl">{fact.value}</p>
            <p className="text-xs text-muted-foreground">{fact.hint}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl">Mandate</h2>
            <p className="mt-2 text-[15px] leading-7">{fund.mandate}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FactBlock title="Benchmark" body={fund.benchmark} />
            <FactBlock title="Target mix" body={fund.targetMix} />
            <FactBlock title="Actual mix" body={fund.actualMix ?? "See latest QFU"} />
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Liquidity
              </p>
              <p className="mt-1 font-serif text-2xl tabular-nums">{fund.settlement}</p>
              <p className="mt-1 text-sm leading-6">{SETTLEMENT_HINT[fund.settlement]}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {fund.liquidity}
              </p>
            </div>
            <FactBlock title="Minimum" body={fund.minInvestment ?? "Not stated"} />
            <FactBlock title="Distributions" body={fund.distributions} />
            <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                GENIUS Act reserve collateral
              </p>
              <p className="mt-1 font-serif text-2xl">{genius.reserve}</p>
              <p className="mt-1 text-sm leading-6">{GENIUS_HINT[genius.reserve]}</p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">WAM</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">{formatGeniusWad(genius.wadDays)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Daily analog</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">
                    {genius.dailyPct === null ? "—" : formatPct(genius.dailyPct, 0)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Weekly analog</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">
                    {genius.weeklyPct === null ? "—" : formatPct(genius.weeklyPct, 0)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {genius.note}
              </p>
            </div>
          </div>
          {fund.notes ? (
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-6">
              {fund.notes}
            </div>
          ) : null}
        </div>
        <aside className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl">Top holdings</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Weight and remaining tenor from the QFU date (call = 0).
            </p>
            {fund.holdings.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Holdings were not captured in the filing extract. The full
                portfolio file sits on Disclose.
              </p>
            ) : (
              <ol className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
                {fund.holdings.map((holding) => (
                  <li
                    key={holding.name}
                    className="flex items-start justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <span>
                      {holding.name}
                      {holding.type ? (
                        <span className="block text-xs text-muted-foreground">
                          {holding.type}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-right tabular-nums text-muted-foreground">
                      <span className="block">
                        {holding.weight > 0 ? formatPct(holding.weight, 2) : "—"}
                      </span>
                      <span className="block text-xs">
                        {formatHoldingTenor(holdingTenorDays(holding, asOf, funds))}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </section>

      {fund.annualReturns.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Annual returns after fees and tax</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Year to 31 Mar</th>
                  <th className="px-3 py-2 text-left font-medium">Fund</th>
                  <th className="px-3 py-2 text-left font-medium">Category avg</th>
                </tr>
              </thead>
              <tbody>
                {fund.annualReturns.map((row) => (
                  <tr key={row.year} className="border-t border-border/80">
                    <td className="px-3 py-2">{row.year}</td>
                    <td className="px-3 py-2 tabular-nums">{formatPct(row.fundAfterFeesTax)}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatPct(row.categoryAverage ?? null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {fund.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {source.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`https://disclose-register.companiesoffice.govt.nz/search?searchType=ALL&q=${encodeURIComponent(fund.name)}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              FMA Disclose Register search
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

function FactBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6">{body}</p>
    </div>
  );
}
