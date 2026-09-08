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
        super sleeves. Open a fund for mandate, holdings, annual returns and
        sources. Empty cells mean the manager has not published that figure in
        the filings we could reach.
      </p>
      <div className="mt-8">
        <FundsExplorer />
      </div>
    </div>
  );
}
