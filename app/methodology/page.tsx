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
        <h2 className="font-serif text-2xl">Liquidity convention</h2>
        <p>
          The table uses a compact settlement code for typical cash available
          after a valid redemption instruction, not the legal maximum in a PDS
          (often “within 10 business days”). <strong>T+0</strong> is same-day /
          on-call access (Sharesies PIE Save, Booster Enhanced Cash, Wedge).{" "}
          <strong>T+1</strong> is next-business-day dealing (Kernel, Simplicity,
          MAS). <strong>T+2</strong> is the default for daily-dealing retail
          PIEs, workplace super sleeves and the NZX cash ETF.{" "}
          <strong>T+3</strong> is used where the manager states cash in three
          further business days (Clarity). <strong>Restricted</strong> means
          KiwiSaver withdrawal rules; intra-scheme switches still usually
          settle like the underlying cash book. <strong>Closed</strong> is
          existing investors only.
        </p>
        <h2 className="font-serif text-2xl">GENIUS Act reserve screen</h2>
        <p>
          The GENIUS Act (Pub. L. 119–27, 12 U.S.C. § 5903) lets a permitted
          payment stablecoin issuer hold reserves only in US currency and
          Federal Reserve balances; demand deposits withdrawable on request at
          insured depository institutions; Treasuries with remaining or
          original maturity of 93 days or less; overnight Treasury repo or
          reverse repo; government money-market funds invested solely in those
          assets; and other similarly liquid federal assets if a federal
          regulator later approves them. Corporate paper, longer Treasuries,
          foreign sovereigns and crypto (other than tokenized permitted
          assets) are out. These NZ cash funds are NZD PIEs, not 1940 Act
          government MMFs, so none of them is a permitted US reserve
          instrument in its own right.
        </p>
        <p>
          Duration is scored as{" "}
          <strong>portfolio weighted-average remaining maturity</strong> of
          the named book — the same idea as the Act’s monthly “average tenor”
          disclosure and the OCC’s March 2026 proposed weighted-average
          maturity (WAM) test — not as “any single name longer than 93 days
          fails.” The formula is WAM = Σ (weight × remaining tenor) / Σ
          weight, using only holdings with a measurable tenor. Call cash and
          on-call deposits are 0 days. Notice paper uses the notice period
          (a 45-day notice deposit is 45 days, not demand). Dated bills, TDs
          and bonds use calendar days from the QFU as-of date to legal
          maturity. FRN interest-rate resets do not shorten tenor; GENIUS
          does not adopt SEC Rule 2a-7 reset-shortening. Residual unnamed
          holdings are left out of the average. They are not assumed to be
          overnight.
        </p>
        <p>
          Liquidity is a separate analog of the OCC proposal (comment closed
          about 1 May 2026; not final). Daily liquidity is paper payable
          immediately (call / demand). Weekly liquidity is paper
          unconditionally due within five business days (treated here as ≤7
          calendar days). The remainder of a permitted reserve book would
          have to sit in other allowed assets, each Treasury still capped at
          93 days. The OCC diversification safe harbor / Option B would also
          cap the <em>portfolio</em> WAM at 20 days. The 93-day figure in
          the statute is a per-Treasury cap, not a substitute for that
          portfolio average.
        </p>
        <p>
          <strong>Yes</strong> means no hard-ineligible assets and a measured
          WAM of 20 days or less on a meaningful named extract (or a 100%
          call-cash book). <strong>Partial</strong> means a cash-equivalent
          book whose WAM is inside 93 days, or an incomplete extract that
          should not be failed on a thin slice of long names.{" "}
          <strong>No</strong> means measured WAM above 93 days on a
          substantial named book, or disclosed mortgages, corporate CP,
          infrastructure credit or multi-year government stock. A single
          99-day term deposit does not fail the fund if the value-weighted
          average stays inside the band. This is research, not legal advice
          and not a determination that an issuer may hold the fund.
        </p>
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
          <li>
            <a className="text-primary hover:underline" href="https://www.congress.gov/119/plaws/publ27/PLAW-119publ27.pdf">
              GENIUS Act, Pub. L. 119–27 (permitted reserves)
            </a>
          </li>
          <li>
            <a className="text-primary hover:underline" href="https://www.federalregister.gov/documents/2026/03/02/2026-04089/implementing-the-guiding-and-establishing-national-innovation-for-us-stablecoins-act-for-the">
              OCC March 2026 GENIUS implementing proposal (daily / weekly liquidity and 20-day WAM)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
