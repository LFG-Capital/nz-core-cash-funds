# Reconstruction plan — NZ Core Cash & MMF Desk

This document is enough to rebuild the full output of the 8 September 2026 research thread if the app or dataset is lost. The intended local checkout is:

```text
/Users/remor/Projects/nz-core-cash-funds
```

Compiled date: **8 September 2026**. Figures keep the as-of date of each filing. This is not financial advice.

---

## 1. What the thread produced

A Next.js research desk that lists dedicated New Zealand **core cash / money-market / cash-PIE** funds with fact-sheet fields:

- fund name, manager, FND id, vehicle, mandate style
- FUM (NZ$ millions) and as-of date
- investor count (where filed)
- inception date
- total annual fund charge, manager fee, other admin fee
- FMA risk indicator
- 3-year and 1-year returns after fees and tax (Sorted / Mindful Money convention)
- optional 1-year after fees before tax (manager fact-sheet convention)
- annual return history (year to 31 March)
- mandate text, benchmark, target/actual mix, liquidity, minimum, distributions
- top holdings
- source URLs plus a Disclose Register search link

The live app has four routes:

| Route | Purpose |
|---|---|
| `/` | Market briefing, stat cards, largest sleeves, cheapest open products |
| `/funds` | Filterable table (search, vehicle, mandate style, sort) |
| `/funds/[slug]` | Full fact sheet |
| `/methodology` | Scope, conventions, canonical links |

Dev server binds **127.0.0.1:43173**.

---

## 2. Materialise this repo on the Mac

This cloud workspace cannot write to `/Users/remor/...`. After the GitHub (or other) remote exists:

```bash
mkdir -p /Users/remor/Projects
git clone <REMOTE_URL> /Users/remor/Projects/nz-core-cash-funds
cd /Users/remor/Projects/nz-core-cash-funds
npm install
npm run dev
```

Open http://127.0.0.1:43173

If you only have a zip or this working tree, copy the project root (everything except `node_modules/` and `.next/`) into that path and run the same `npm` commands.

---

## 3. Rebuild the app from a blank directory

Requires Node 22+ and npm.

```bash
mkdir -p /Users/remor/Projects/nz-core-cash-funds
cd /tmp
npx create-next-app@16.3.4 tmp-scaffold \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --use-npm --turbopack --yes

# create-next-app must target a subdirectory (not the repo root) —
# scaffolding into `.` can fail with a false "path is not writable" error.
rsync -a --exclude node_modules --exclude .next tmp-scaffold/ \
  /Users/remor/Projects/nz-core-cash-funds/
cd /Users/remor/Projects/nz-core-cash-funds

npm install lucide-react clsx tailwind-merge class-variance-authority \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-select
```

Set `package.json` `name` to `nz-core-cash-funds` and scripts to:

```json
{
  "dev": "next dev --port 43173 --hostname 127.0.0.1",
  "start": "next start --port 43173 --hostname 127.0.0.1"
}
```

Then recreate these files from this repo (or from the file map in §5):

```text
lib/utils.ts
lib/labels.ts
lib/funds.ts
components/ui/button.tsx
components/ui/badge.tsx
components/ui/input.tsx
components/site-header.tsx
components/funds-explorer.tsx
app/globals.css
app/layout.tsx
app/page.tsx
app/funds/page.tsx
app/funds/[slug]/page.tsx
app/methodology/page.tsx
app/not-found.tsx
```

Fonts in `app/layout.tsx`: Google `Source_Sans_3` (`--font-source-sans`) and `Source_Serif_4` (`--font-source-serif`).

Design tokens in `app/globals.css`:

| Token | Hex | Role |
|---|---|---|
| `--background` | `#f4efe6` | Paper page |
| `--foreground` | `#1c1915` | Body text |
| `--card` | `#fffdf8` | Surfaces |
| `--muted` | `#ebe3d4` | Table header / chips |
| `--muted-foreground` | `#6b6256` | Secondary text |
| `--primary` | `#0f4c3a` | NZ forest green |
| `--border` / `--input` | `#d9d0c1` | Rules |
| Hero | `#10261e` → `#1c3d2e` | Overview banner |

Vehicle badge colours: KiwiSaver emerald, retail sky, ETF amber, workplace violet, closed stone.

No database, auth, or env secrets. All research is static TypeScript.

---

## 4. Rebuild the research dataset

The dataset is `lib/funds.ts`. There is no scraper in-repo. Reconstruction is a manual filing pass.

### 4.1 Definition of “core cash” in New Zealand

New Zealand has no SEC 2a-7 money-market statute. Use this working definition:

- Morningstar **NZ OE Cash / Cash PIE**: predominantly bank deposits and bank bills; overall maturity expected under 12 months; not star-rated.
- FMA / Sorted **defensive single-sector cash**: 100% (or near-100%) income assets labelled cash / cash equivalents / short NZ fixed interest.
- Adviser styles:
  - **Core cash / MMF** — call cash, RCDs, bank bills, short FRNs; OCR or bank-bill benchmark.
  - **Enhanced cash** — extra NZ government / credit duration (Harbour max 2 years; target 90-day + ~85 bps).
  - **Cash-plus / short duration** — OCR+ with a large short NZ FI sleeve (Milford).
  - **Bank-deposit PIE** — only AA-rated NZ bank deposits (Sharesies PIE Save).

**In scope:** standalone retail cash PIEs, Smart NZ Cash ETF, KiwiSaver cash / CashPlus / NZ Cash funds, workplace/master-trust cash options with their own FUM.

**Out of scope:** bank on-call and term-deposit PIEs sold as deposits; conservative multi-asset funds; SuperLife UK Cash (sterling); wholesale-only books unless they appear as an underlying (Amova Wholesale, Fisher Institutional).

**Known gaps from the original pass:** Booster KiwiSaver cash, Aon cash, Pathfinder cash, some Consilium wrappers — they may exist on Disclose but lacked a complete 2026 extract.

### 4.2 Canonical discovery sources

Work these in order. Prefer the quarterly fund update (QFU) for FUM, fees, risk and top 10.

1. [Mindful Money — all managed funds](https://mindfulmoney.nz/managed/all/) — extract every name containing Cash, CashPlus, Cash Plus, Enhanced Cash, Money Market.
2. [Mindful Money KiwiSaver search](https://mindfulmoney.nz/) — same for KiwiSaver cash.
3. [Sorted Smart Investor](https://smartinvestor.sorted.org.nz/) — confirm FND / OFR / SCH ids and download the latest QFU PDF.
4. [FMA Disclose Register](https://disclose-register.companiesoffice.govt.nz/) — PDS, SIPO, full holdings xlsx.
5. [MoneyHub cash funds guide](https://www.moneyhub.co.nz/cash-funds.html) (updated 27 July 2026) — retail product checklist.
6. [ManagedFundsNZ cash category](https://managedfunds.nz/asset-class/cash/funds/) — incomplete (six retail names only); use as a cross-check, not the universe.
7. Morningstar NZ category PDF: *Morningstar NZ Category Definitions* (Cash / Cash GIF / Cash Non-PIE).
8. Manager fact sheets for yield, duration and before-tax returns (Harbour, Clarity, Milford, ANZ, Kernel, Sharesies).

Mindful Money cash names found in the 2026 managed-fund list:

Amova NZ Cash; AMP New Zealand Cash; AMP Select Cash; BNZ Private Wealth Series Cash; Booster Enhanced Cash Portfolio; Clarity Enhanced Cash PIE; Fisher Funds Cashplus; Fisher Funds Premium Cash; Generate CashPlus Managed; Harbour Enhanced Cash; Kernel Cash Plus; MAS Cash; Mercer Defence Force Cash; Mercer FlexiSaver Cash; Mercer Macquarie NZ Cash; Milford Cash; NZ Funds Cash Portfolio; Octagon Enhanced Cash; Simplicity NZ Cash; Smart NZ Cash ETF; SuperLife NZ Cash; SuperLife UK Cash (exclude); Tempo Cash.

Plus products not on that HTML list: Wedge Savings; Sharesies PIE Save; Lifetime Cash; InvestNow Macquarie feeder; the KiwiSaver / workplace twins.

### 4.3 Field mapping from a QFU

| `Fund` field | Where it lives |
|---|---|
| `name`, `manager` | QFU cover / Sorted header |
| `fnd` | Sorted URL `.../FNDxxxxx/` or Disclose |
| `vehicle` | KiwiSaver scheme vs managed fund vs NZX ETF vs workplace trust vs closed |
| `style` | Read the SIPO objective (OCR vs bank bill vs “enhanced” / duration cap vs bank deposits only) |
| `fumMillion`, `fumAsOf` | “Total value of the fund” + quarter end |
| `members` | “Number of investors” (KiwiSaver / some PIEs) |
| `started` | “The date the fund started” |
| `feePercent` | “Total fund charges” for the year to 31 March |
| `managerFee` / `otherFee` | Breakdown under total management and administration |
| `riskIndicator` | FMA 1–7 graphic |
| `return1yAfterFeesTax` | “Annual return (after deductions for charges and tax)” |
| `return1yAfterFeesBeforeTax` | “after charges but before tax” |
| `return3yAfterFeesTax` | Mindful Money “Past Returns” (3-year average after fees and tax) |
| `annualReturns[]` | Mindful Money / Sorted year-to-31-March table (`2026` = year to 31 Mar 2026, not a calendar year) |
| `mandate` | “Description of this fund” / PDS objective |
| `benchmark` | Market index named in the QFU |
| `targetMix` / `actualMix` | Target vs actual investment mix |
| `holdings` | Top 10 table |
| `sources` | Mindful Money card, Sorted card, QFU PDF, fact sheet |

**Do not convert** manager before-tax returns into the after-tax column. The desk prefers after-tax for peers and notes before-tax in `return1yAfterFeesBeforeTax` or `notes`.

**Do not add FUM across wrappers** and call it unique capital. Fisher retail / Premium / KiwiSaver share one book; SuperLife Invest / KS / SMT / Smart NZC share Smartshares; Mercer KS / FlexiSaver / InvestNow feed Macquarie NZ Cash; Clarity is majority Amova Wholesale NZ Cash; Kernel retail and KS are the same strategy family.

### 4.4 Fund inventory to restore (39 products)

Keep these slugs. Re-pull FUM/fees from the latest QFU rather than copying stale numbers.

| Slug | Name | FND | Vehicle |
|---|---|---|---|
| `milford-cash-fund` | Milford Cash Fund | FND13445 | Retail PIE |
| `booster-enhanced-cash-portfolio` | Booster Enhanced Cash Portfolio | FND1312 | Retail PIE |
| `amova-nz-cash-fund` | Amova NZ Cash Fund (ex Nikko AM) | FND383 | Retail PIE |
| `superlife-nz-cash-fund` | SuperLife NZ Cash Fund | FND2407 | Retail PIE |
| `mercer-macquarie-nz-cash-fund` | Mercer Macquarie NZ Cash Fund | FND78 | Retail PIE |
| `harbour-enhanced-cash-fund` | Harbour Enhanced Cash Fund | FND15505 | Retail PIE |
| `kernel-cash-plus-fund` | Kernel Cash Plus Fund | FND40596 | Retail PIE |
| `nz-funds-cash-portfolio` | NZ Funds Cash Portfolio | FND1605 | Retail PIE |
| `clarity-enhanced-cash-pie` | Clarity Enhanced Cash PIE | FND50928 | Retail PIE |
| `bnz-private-wealth-cash-fund` | BNZ Private Wealth Series Cash Fund | FND3629 | Retail PIE |
| `octagon-enhanced-cash-fund` | Octagon Enhanced Cash Fund | FND44200 | Retail PIE |
| `wedge-savings-fund` | Wedge Savings Fund | — | Retail PIE |
| `sharesies-pie-save` | Sharesies PIE Save Fund | — | Retail PIE |
| `simplicity-nz-cash-fund` | Simplicity NZ Cash Fund | FND43090 | Retail PIE |
| `smart-nz-cash-etf` | Smart NZ Cash ETF (NZC) | FND1104 | ETF |
| `mas-cash-fund` | MAS Cash Fund | FND47119 | Retail PIE |
| `amp-new-zealand-cash-fund` | AMP New Zealand Cash Fund | FND757 | Retail PIE |
| `tempo-cash-fund` | Tempo Cash Fund | FND45298 | Retail PIE |
| `fisher-funds-cashplus-fund` | Fisher Funds Cashplus Fund | FND1060 | Retail PIE |
| `generate-cashplus-managed-fund` | Generate CashPlus Managed Fund | FND56148 | Retail PIE |
| `mercer-flexisaver-cash-fund` | Mercer FlexiSaver Cash Fund | FND39 | Workplace / Super |
| `amp-select-cash-fund` | AMP Select Cash Fund | FND779 | Closed |
| `lifetime-cash-fund` | Lifetime Cash Fund | FND51095 | Workplace / Super |
| `fisher-funds-premium-cash-fund` | Fisher Funds Premium Cash Fund | — | Retail PIE |
| `anz-kiwisaver-cash-fund` | ANZ KiwiSaver Scheme Cash Fund | FND2189 | KiwiSaver |
| `asb-kiwisaver-nz-cash-fund` | ASB KiwiSaver NZ Cash Fund | FND528 | KiwiSaver |
| `westpac-kiwisaver-cash-fund` | Westpac KiwiSaver Cash Fund | FND339 | KiwiSaver |
| `fisher-funds-kiwisaver-cash-fund` | Fisher Funds KiwiSaver Plan Cash Fund | FND550 | KiwiSaver |
| `bnz-kiwisaver-cash-fund` | BNZ KiwiSaver Cash Fund | FND514 | KiwiSaver |
| `milford-kiwisaver-cash-fund` | Milford KiwiSaver Cash Fund | FND17982 | KiwiSaver |
| `amp-kiwisaver-cash-fund` | AMP KiwiSaver Cash Fund | FND130 | KiwiSaver |
| `generate-kiwisaver-cashplus-fund` | Generate KiwiSaver CashPlus Fund | — | KiwiSaver |
| `amp-nzrt-cash-fund` | AMP Cash Fund (NZRT workplace) | — | Workplace / Super |
| `superlife-kiwisaver-nz-cash-fund` | SuperLife KiwiSaver NZ Cash Fund | FND2465 | KiwiSaver |
| `superlife-smt-nz-cash-fund` | SuperLife Master Trust NZ Cash Fund | — | Workplace / Super |
| `anz-default-kiwisaver-cash-fund` | ANZ Default KiwiSaver Cash Fund | — | KiwiSaver |
| `mercer-kiwisaver-cash-fund` | Mercer KiwiSaver Cash Fund | FND11 | KiwiSaver |
| `kernel-kiwisaver-cash-plus-fund` | Kernel KiwiSaver Cash Plus Fund | FND40600 | KiwiSaver |
| `summer-new-zealand-cash` | Summer New Zealand Cash | — | KiwiSaver |

### 4.5 Snapshot figures from the original pass (for regression)

Use these only to check you landed on the same filings. Prefer a newer QFU if one exists.

Largest disclosed sleeves (original extract):

- ANZ KiwiSaver Cash — $1,340m, 31 Mar 2026, 0.22%, 3.43% 3y after tax, 48,163 members
- Milford Cash — $1,070m, 31 Mar 2026, 0.20%, 3.33% 3y
- ASB KiwiSaver NZ Cash — $921m, 31 Mar 2026, 0.35%, 37,006 members
- Westpac KiwiSaver Cash — $710m, 31 Mar 2026, 0.25%, 3.54% 3y
- Fisher KiwiSaver Cash — $463m, 31 Mar 2026, 0.45%, 3.56% 3y
- Booster Enhanced Cash — $384m, 31 Mar 2026, 0.04%, 3.08% 3y
- Amova NZ Cash — $384.4m, 31 Mar 2026, 0.30%, 3.58% 3y
- BNZ KiwiSaver Cash — $365m Mar 2026 / $357.9m Jun 2026, 0.30%
- SuperLife NZ Cash — $246.8m, 31 Mar 2026, 0.42%, 3.17% 3y
- Mercer Macquarie NZ Cash — $233m, 31 Mar 2026, 0.30%, 3.28% 3y (inception 1 Jun 1995)
- Harbour Enhanced Cash — $228m QFU / ~$260m Jun 2026 fact sheet, 0.26%, 3.74% 3y, duration cap 2 years
- Kernel Cash Plus (retail) — $209m, 31 Mar 2026, 0.25%, 3.79% 3y

Other retail / ETF / workplace figures worth matching:

- NZ Funds Cash $145m (31 Dec 2025), 0.41%
- Clarity Enhanced Cash $138m (31 Jan 2026 fact sheet) / $125m (31 Mar 2026 Mindful Money), 0.25–0.26%
- BNZ Private Wealth Cash $132m (31 Dec 2025), 0.27%
- Octagon Enhanced Cash $125m, 0.36%, OCR+
- Wedge Savings $114.5m (30 Jun 2026)
- Sharesies PIE Save $112.9m (30 Jun 2026), advertised 0% fee / bank spread; 1y after tax 1.77%, before tax 2.26% vs index 2.55%
- Simplicity NZ Cash $91.5m, 0.12%
- Smart NZC $36.8m, 0.20%, 3.41% 3y
- MAS Cash $30.2m (31 Dec 2025), 0.24%
- AMP NZ Cash $29.1m, 0.50%
- Tempo Cash $26.5m, 1.10% (highest open fee)
- Fisher Cashplus $12.6m, 0.83%
- Generate CashPlus retail $3.92m, 0.46%, started 30 Apr 2025
- Mercer FlexiSaver Cash $4.02m (31 Dec 2025), 0.46%
- AMP Select Cash $1.42m, 0.80%, **closed**
- Lifetime Cash $0.154m, 0.65%, 98.47% Fisher Institutional NZ Cash
- Fisher Premium Cash $0.25m, started 10 Mar 2026, 0.40%

Other KiwiSaver / workplace:

- Milford KS Cash $148m (30 Sep 2025), 0.20%
- AMP KS Cash $114m, 0.57%
- Generate KS CashPlus $96.8m (older QFU), renamed from Defensive Fund 30 Apr 2025
- AMP NZRT Cash $78.9m (30 Jun 2026)
- SuperLife KS NZ Cash $74.6m, 0.52%
- SuperLife SMT NZ Cash $56.5m (31 Mar 2026)
- ANZ Default KS Cash $39.2m (30 Jun 2025)
- Mercer KS Cash $35.7m, 0.32%
- Kernel KS Cash Plus $17.6m (30 Jun 2026), 0.25%, 1y before tax 3.46%
- Summer NZ Cash $5.07m, ~0.50–0.62% (filings disagree — use latest PDS)

Fee range in the original extract: **0.00% (Sharesies advertised) to 1.10% (Tempo)**; median among disclosed charges about **0.30%**.

### 4.6 Primary source URLs used in the original extract

Rebuild from these if the cards have not moved:

- Mindful Money pattern: `https://mindfulmoney.nz/managed/{FND}/{slug}/` or `/kiwisaver/{FND}/{slug}/`
- Sorted pattern: `https://smartinvestor.sorted.org.nz/kiwisaver-and-managed-funds/{SCH}/{OFR}/{FND}/`
- Clarity Jan 2026 fact sheet: `https://clarityfunds.co.nz/sites/default/files/documents/Enhanced%20Cash%20PIE%20Factsheet%20January%202026_0.pdf`
- Harbour fact sheet: `https://www.harbourasset.co.nz/assets/Fact-Sheets/Fund-fact-sheet-Enhanced-Cash.pdf`
- Amova Q1 2026 QFU: `https://www.goalsgetter.co.nz/hubfs/Downloads/HistoricQFUs/2026/Q1_Retail/AmovaNZCashFund_Mar26.pdf`
- Simplicity QFU 31 Mar 2026: `https://simplicity.kiwi/assets/Uploads/Simplicity-NZ-Cash-Fund-update-31-March-2026.pdf`
- SuperLife Invest NZ Cash QFU: `https://www.superlife.co.nz/files/LegalDocs/SLI-FundUpdates/2026-Mar/superlife%20invest%20fund%20update_nz_cash_fund.pdf`
- SuperLife SMT NZ Cash QFU: `https://www.superlife.co.nz/files/LegalDocs/MT-FundUpdates/2026-Mar/superlife%20superannuation%20master%20trust%20fund%20update_superlife_superannuation_master_trust_nz_cash_fund.pdf`
- Sharesies PIE Save QFU Jun 2026: `https://assets.ctfassets.net/eg3voq9njjf7/2AWr1TglwnnhkuPWkmgxP/8aee133c8a02597fcfc6a9be7316d731/Sharesies_Pie_Save__June_2026_.pdf`
- Sharesies PDS 5 Dec 2024: `https://assets.ctfassets.net/eg3voq9njjf7/1TPFKz0Ro8bfehSIczv8Xz/c033675c036af33caadb076d6651395e/Product_Disclosure_Statement__PDS__-_Sharesies_PIE_Save__5_December_2024_.pdf`
- Wedge QFU 30 Jun 2026 (Sorted disclose-document)
- Fisher KS / Premium QFUs: `https://assets.fisherfunds.co.nz/kiwisaver-plan-cash-fund-update-march-2026` and `.../premium-cash-fund-update-march-2026`
- ANZ KS performance: `https://www.anz.co.nz/personal/kiwisaver/compare-funds/performance-fees/anz-kiwisaver-scheme-cash-fund/`
- ANZ Default KS QFU 30 Jun 2025 on anz.co.nz disclosures
- Westpac KS QFU 31 Dec 2025 on westpac.co.nz DAM
- BNZ KS QFU 30 Jun 2026 on Sorted disclose-document
- Kernel KS QFU 30 Jun 2026 on Sorted disclose-document
- AMP NZRT QFU 30 Jun 2026: `https://www.amp.co.nz/content/dam/ampnz/documents/investments/NZRT/quarterly-fund-updates/2026-jun/AMP-NZRT-QFU-AMP-Cash-Fund-2026-June.pdf`
- Lifetime product page: `https://www.lifetimeinvestments.co.nz/investments/superannuation-master-trust/smt-fund-options/lifetime-cash-fund/`
- Milford KS monthly fact sheet: `https://milfordasset.com/funds-performance/kiwisaver-cash-fund/monthly-fact-sheets/latest`
- Morningstar NZC: `https://www.morningstar.com/etfs/xnze/nzc/performance`
- MoneyHub: `https://www.moneyhub.co.nz/cash-funds.html`

Each fund object already stores its source list. After a refresh, keep those URLs and add the new QFU.

---

## 5. File map

```text
README.md
docs/RECONSTRUCTION.md          ← this plan
package.json                    ← name nz-core-cash-funds; port 43173
app/layout.tsx                  ← fonts, header, disclaimer footer
app/page.tsx                    ← overview / research briefing
app/funds/page.tsx              ← FundsExplorer
app/funds/[slug]/page.tsx       ← generateStaticParams from funds[]
app/methodology/page.tsx        ← scope notes
app/not-found.tsx
app/globals.css                 ← paper + forest tokens
lib/funds.ts                    ← schema + 39 funds + marketStats
lib/utils.ts                    ← cn, formatNzdMillion, formatPct, formatDate
lib/labels.ts                   ← vehicleBadge
components/site-header.tsx
components/funds-explorer.tsx   ← client filters
components/ui/{button,badge,input}.tsx
```

Helpers:

- `formatNzdMillion`: ≥1000 → `$x.xxb`; ≥1 → `$xm`; else `$xk`
- `formatDate`: `en-NZ` UTC
- `marketStats` is derived from `funds` (count, total FUM, retail/KS counts, min/median/max fee, largest sleeve)

Copy rules for the overview page:

- Lead with the NZ-vs-US MMF distinction.
- Stat cards: fund count, disclosed FUM, fee range, largest sleeve.
- Explain PIE tax, the three mandate styles, and wrapper overlap.
- Explain that 2026 annual columns are year-to-31-March after an OCR cut.
- Cheapest-open list: `open && feePercent != null`, sort ascending.
- Largest: sort `fumMillion` descending, take six.

---

## 6. Verification (must match the original pass)

```bash
npx tsc --noEmit
npm run lint
npm run dev
```

Browser (desktop and ~390px):

1. `/` shows the green hero, four stat cards, research copy, largest-sleeve cards, cheapest list.
2. `/funds` table lists every fund; search `Milford` → two rows; vehicle `KiwiSaver` → KS only; `zzzznope` → empty state (“No funds match those filters”).
3. `/funds/milford-cash-fund` shows ~$1.07b, 0.20%, OCR mandate, holdings, annual returns, sources.
4. `/methodology` shows in-scope / out-of-scope.
5. Header nav works on mobile; the table scrolls horizontally.

---

## 7. Refresh cadence

After each 31 March / 30 June / 30 September / 31 December QFU cycle:

1. Walk the slug table in §4.4.
2. Replace FUM, fee, members, holdings, and the new annual-return row.
3. Bump `RESEARCH_AS_OF`.
4. Re-read MoneyHub and Mindful Money’s full list for new names (Wedge, Generate CashPlus retail, Fisher Premium were 2024–2026 additions).
5. Keep wrapper notes up to date when managers merge or rebrand (Nikko → Amova; QuayStreet → Octagon).

---

## 8. Legal / product constraints

- FMC Act QFUs are unaudited and may be updated.
- Do not present the desk as a complete statutory register.
- Do not add auth, a database, or a second component library unless the product changes.
- Always link Disclose and tell the reader to read the current PDS/SIPO.
