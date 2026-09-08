import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NZ Core Cash & MMF Desk",
    template: "%s · NZ Core Cash & MMF Desk",
  },
  description:
    "Research desk covering New Zealand core cash, money-market and cash-PIE funds: mandates, FUM, fees and performance from published fact sheets and quarterly fund updates.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NZ"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/70 bg-card/60">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted-foreground sm:px-6">
            General information compiled from publicly filed New Zealand
            quarterly fund updates, manager fact sheets, Sorted Smart Investor
            and Mindful Money. Not financial advice. Past performance is not a
            reliable indicator of future returns. Always read the current PDS
            and SIPO on the FMA Disclose Register before investing.
          </div>
        </footer>
      </body>
    </html>
  );
}
