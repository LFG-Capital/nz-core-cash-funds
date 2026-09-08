import { FundsExplorer } from "@/components/funds-explorer";

export const metadata = {
  title: "All core cash funds",
};

export default function FundsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Fact sheets
      </p>
      <h1 className="mt-2 font-serif text-4xl">All documented NZ cash funds</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
        Retail PIEs, the NZX cash ETF, KiwiSaver cash options and workplace
        super sleeves. Liquidity is the typical cash-available settlement after
        a valid redemption: T+0 same-day, T+1 next business day, T+2 / T+3
        standard PIE or NZX settlement. KiwiSaver is Restricted. GENIUS
        reserve scores the named book against US permitted-reserve liquidity
        and duration: daily/weekly buckets and a value-weighted remaining
        maturity (WAM), not a single-name 93-day fail. It is not a
        US-eligibility opinion. Open a fund for mandate, holdings, annual
        returns and sources.
      </p>
      <div className="mt-8">
        <FundsExplorer />
      </div>
    </div>
  );
}
