# NZ Core Cash & MMF Desk

A research desk for New Zealand core cash, money-market and cash-PIE funds. It lists dedicated cash mandates with published fact-sheet data: fund name, manager, vehicle, mandate, FUM, fees, risk indicator, performance and top holdings.

This is general information compiled from public quarterly fund updates, manager fact sheets, [Sorted Smart Investor](https://smartinvestor.sorted.org.nz/) and [Mindful Money](https://mindfulmoney.nz/). It is not financial advice.

## Run locally

```bash
npm install
npm run dev
```

The app serves on [http://127.0.0.1:43173](http://127.0.0.1:43173).

## What is in the data

`lib/funds.ts` holds the surveyed funds. Figures keep their original as-of dates. Some scheme cash options were not captured with a complete 2026 filing extract; see the Methodology page.

## Stack

Next.js, TypeScript, Tailwind CSS and shadcn-style UI primitives.
