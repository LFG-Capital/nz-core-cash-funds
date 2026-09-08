export const metadata = {
  title: "Methodology",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Research notes
      </p>
      <h1 className="mt-2 font-serif text-4xl">How this survey was built</h1>
      <div className="mt-6 space-y-5 text-[15px] leading-7">
        <p>
          New Zealand has no single statutory “money-market fund” register. We
          assembled the universe from products that file as cash or
          cash-equivalent single-sector funds on the FMA Disclose Register and
          that Sorted Smart Investor or Mindful Money classify as defensive
          cash.
        </p>
        <p>
          Primary sources were quarterly fund updates (the FMC Act document
          that states FUM, fees, risk indicator and top 10 holdings), manager
          fact sheets, Sorted Smart Investor fund cards, Mindful Money fund
          cards, MoneyHub’s July 2026 cash-funds guide, ManagedFundsNZ’s cash
          asset-class page, and Morningstar’s NZ OE Cash category definition.
        </p>
        <h2 className="font-serif text-2xl">In scope</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Standalone retail cash PIEs and enhanced-cash PIEs.</li>
          <li>The NZX-listed Smart NZ Cash ETF.</li>
          <li>KiwiSaver cash / CashPlus / NZ Cash single-sector funds.</li>
          <li>
            Workplace and master-trust cash options that publish a separate
            FUM figure (AMP NZRT, SuperLife SMT, Mercer FlexiSaver, Lifetime).
          </li>
        </ul>
        <h2 className="font-serif text-2xl">Out of scope or incomplete</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Bank on-call and term-deposit PIEs sold as deposit products rather
            than managed funds.
          </li>
          <li>
            Conservative multi-asset funds that merely hold a cash sleeve.
          </li>
          <li>
            SuperLife UK Cash (sterling cash, not an NZ MMF).
          </li>
          <li>
            Wholesale-only cash books that do not file a retail QFU, except
            where they appear as an underlying holding (Amova Wholesale, Fisher
            Institutional).
          </li>
          <li>
            Some scheme cash options (Booster KiwiSaver cash, Aon, Pathfinder,
            Consilium wrappers) were not captured with a complete 2026 QFU
            extract. They may still exist on Disclose.
          </li>
        </ul>
        <h2 className="font-serif text-2xl">Performance convention</h2>
        <p>
          Mindful Money and Sorted publish after-fees-and-tax annual returns
          for the year to 31 March. Manager fact sheets often show after-fees
          before-tax versus a pre-fee index. We prefer the after-tax series for
          peer comparison and note before-tax figures when a manager
          highlights them (ANZ, Kernel, Sharesies, Harbour).
        </p>
        <p>
          The 2026 “annual” column in most QFUs is the year to 31 March 2026,
          covering a period when the OCR was already falling. That is why many
          2026 numbers sit near 2.0–2.7% after tax, below the 3.6–4.3% printed
          for the year to 31 March 2025.
        </p>
        <h2 className="font-serif text-2xl">Canonical links</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a className="text-primary hover:underline" href="https://disclose-register.companiesoffice.govt.nz/">
              FMA Disclose Register
            </a>
          </li>
          <li>
            <a className="text-primary hover:underline" href="https://smartinvestor.sorted.org.nz/">
              Sorted Smart Investor
            </a>
          </li>
          <li>
            <a className="text-primary hover:underline" href="https://mindfulmoney.nz/managed/all/">
              Mindful Money managed-fund list
            </a>
          </li>
          <li>
            <a className="text-primary hover:underline" href="https://www.moneyhub.co.nz/cash-funds.html">
              MoneyHub cash funds guide
            </a>
          </li>
          <li>
            <a className="text-primary hover:underline" href="https://managedfunds.nz/asset-class/cash/funds/">
              ManagedFundsNZ cash category
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
