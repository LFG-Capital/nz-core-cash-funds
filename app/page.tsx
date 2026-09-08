import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { funds, marketStats, RESEARCH_AS_OF } from "@/lib/funds";
import { vehicleBadge } from "@/lib/labels";
import { formatDate, formatNzdMillion, formatPct } from "@/lib/utils";

const largest = [...funds]
  .filter((fund) => fund.fumMillion !== null)
  .sort((a, b) => (b.fumMillion ?? 0) - (a.fumMillion ?? 0))
  .slice(0, 6);

const cheapestOpen = [...funds]
  .filter((fund) => fund.open && fund.feePercent !== null)
  .sort((a, b) => (a.feePercent ?? 99) - (b.feePercent ?? 99))
  .slice(0, 5);

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border/70 bg-[linear-gradient(180deg,#10261e_0%,#163528_55%,#1c3d2e_100%)] text-[#f4efe6]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
            Fact-sheet survey · compiled {formatDate(RESEARCH_AS_OF)}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            Every dedicated New Zealand core cash and money-market fund we can
            document from public filings.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50/85">
            NZ does not run US-style SEC 2a-7 money-market funds. The local
            equivalent is a PIE cash or enhanced-cash mandate: bank bills,
            registered certificates of deposit, floating-rate notes, term
            deposits and short New Zealand credit, usually targeting the OCR or
            a bank-bill index.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/funds">Browse the full list</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-200/30 bg-transparent text-[#f4efe6] hover:bg-white/10">
              <Link href="/methodology">How the survey was built</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          {
            label: "Funds documented",
            value: String(marketStats.fundCount),
            hint: `${marketStats.retailCount} retail/ETF · ${marketStats.kiwiCount} KiwiSaver`,
          },
          {
            label: "Disclosed FUM",
            value: formatNzdMillion(marketStats.totalFum),
            hint: "Sum of latest published fund values. Some sleeves overlap.",
          },
          {
            label: "Fee range",
            value: `${formatPct(marketStats.minFee)}–${formatPct(marketStats.maxFee)}`,
            hint: `Median ${formatPct(marketStats.medianFee)} among funds that disclose a charge`,
          },
          {
            label: "Largest sleeve",
            value: marketStats.largest.name.replace(" Scheme", ""),
            hint: `${formatNzdMillion(marketStats.largest.fumMillion)} · ${formatDate(marketStats.largest.fumAsOf)}`,
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-2xl leading-snug">{stat.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {stat.hint}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5 text-[15px] leading-7 text-foreground/90">
            <h2 className="font-serif text-3xl">What “core cash” means in New Zealand</h2>
            <p>
              Morningstar’s New Zealand <strong>Cash</strong> category is the
              closest official MMF definition: PIE funds that invest
              predominantly in highly liquid instruments such as bank deposits
              and bank bills, with overall maturity expected to be under twelve
              months. Those funds are not star-rated. In 2025 the category held
              about 39 products.
            </p>
            <p>
              Advisers and platforms usually split the book into three working
              styles. <strong>Core cash / MMF</strong> stays in call cash,
              RCDs, bank bills and short FRNs and hugs a bank-bill or OCR
              benchmark. <strong>Enhanced cash</strong> (Harbour, Clarity,
              Octagon) is allowed more NZ government and credit duration —
              Harbour caps duration at two years and targets 90-day bills plus
              85 basis points. <strong>Bank-deposit PIEs</strong> such as
              Sharesies PIE Save hold only AA-rated NZ bank deposits and
              function as a taxed-as-PIE savings account rather than an active
              money-market portfolio.
            </p>
            <p>
              Almost every product here is a Portfolio Investment Entity.
              Investor tax is the prescribed investor rate (10.5%, 17.5% or
              28%), which is why cash PIEs remain the default parking place for
              higher-rate taxpayers versus a 39% RWT term deposit. KiwiSaver
              cash funds use the same instruments but lock money under KiwiSaver
              withdrawal rules.
            </p>
            <p>
              The disclosed FUM total above adds published fund values. It is
              not unique capital: Fisher’s retail, Premium and KiwiSaver cash
              funds share one underlying book; SuperLife Invest, SuperLife
              KiwiSaver, the Master Trust and Smart NZC share Smartshares’
              cash sleeve; Mercer KiwiSaver, FlexiSaver and InvestNow feed
              Macquarie NZ Cash; Clarity’s enhanced PIE is majority invested in
              Amova Wholesale NZ Cash.
            </p>
          </div>
          <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-serif text-xl">How to read the table</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>
                <strong className="text-foreground">Returns</strong> are after
                fees and tax unless labelled otherwise — the Sorted / Mindful
                Money standard, not the manager fact-sheet “before tax” line.
              </li>
              <li>
                <strong className="text-foreground">1-year 2026 figures</strong>{" "}
                are year-to-31 March in most QFUs, not a full calendar year.
              </li>
              <li>
                <strong className="text-foreground">FUM dates differ.</strong>{" "}
                We keep the as-of date on every card rather than forcing a
                single quarter.
              </li>
              <li>
                Bank on-call PIEs and term-deposit PIEs sold as deposit products
                are out of scope unless they file as a managed investment
                scheme.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">Largest disclosed sleeves</h2>
          <Link href="/funds" className="text-sm text-primary hover:underline">
            Full ranking
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {largest.map((fund) => (
            <Link
              key={fund.slug}
              href={`/funds/${fund.slug}`}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{fund.name}</p>
                  <p className="text-xs text-muted-foreground">{fund.manager}</p>
                </div>
                <Badge variant={vehicleBadge(fund.vehicle)}>{fund.vehicle}</Badge>
              </div>
              <p className="mt-3 font-serif text-2xl">
                {formatNzdMillion(fund.fumMillion)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(fund.fumAsOf)} · fee {formatPct(fund.feePercent)} ·
                3y {formatPct(fund.return3yAfterFeesTax)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="font-serif text-3xl">Cheapest open products</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Fee is not return. Tempo at 1.10% and Fisher Cashplus at 0.83% give
          up a large share of a 3% cash yield; Booster’s 0.04% and Simplicity’s
          0.12% do not.
        </p>
        <ol className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {cheapestOpen.map((fund, index) => (
            <li key={fund.slug}>
              <Link
                href={`/funds/${fund.slug}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
              >
                <span className="text-sm">
                  <span className="mr-3 tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  {fund.name}
                </span>
                <span className="tabular-nums text-sm font-medium">
                  {formatPct(fund.feePercent)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
