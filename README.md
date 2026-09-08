# NZ Core Cash & MMF Desk

Dedicated repository for the New Zealand core cash / money-market / cash-PIE research desk.

Intended local checkout:

```text
/Users/remor/Projects/nz-core-cash-funds
```

The desk lists dedicated cash mandates with published fact-sheet data: fund name, manager, vehicle, mandate, FUM, fees, risk indicator, performance and top holdings.

This is general information compiled from public quarterly fund updates, manager fact sheets, [Sorted Smart Investor](https://smartinvestor.sorted.org.nz/) and [Mindful Money](https://mindfulmoney.nz/). It is not financial advice.

## Reconstruct or refresh

The full rebuild plan — sources, field mapping, fund inventory, snapshot figures, scaffold commands and browser checks — is in:

**[docs/RECONSTRUCTION.md](docs/RECONSTRUCTION.md)**

Use that document if this tree is lost, if you are standing up the folder on a new machine, or if you are updating FUM and performance after a new quarterly fund-update cycle.

## Run locally

```bash
mkdir -p /Users/remor/Projects
git clone <REMOTE_URL> /Users/remor/Projects/nz-core-cash-funds
cd /Users/remor/Projects/nz-core-cash-funds
npm install
npm run dev
```

The app serves on [http://127.0.0.1:43173](http://127.0.0.1:43173).

## Hosted page

The static export is published to GitHub Pages:

**[https://lfg-capital.github.io/nz-core-cash-funds/](https://lfg-capital.github.io/nz-core-cash-funds/)**

Pushes to `main` rebuild and redeploy it.

## Layout

| Path | Role |
|---|---|
| `lib/funds.ts` | Survey dataset (39 funds) and derived market stats |
| `app/page.tsx` | Research overview |
| `app/funds/` | Filterable table and fact-sheet pages |
| `app/methodology/page.tsx` | Scope and conventions |
| `docs/RECONSTRUCTION.md` | How to rebuild the whole output |

## Stack

Next.js 16, TypeScript, Tailwind CSS v4, and shadcn-style UI primitives. No database and no secrets.
