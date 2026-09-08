import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/funds", label: "All funds" },
  { href: "/methodology", label: "Methodology" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            New Zealand research
          </p>
          <p className="font-serif text-xl tracking-tight text-foreground">
            Core Cash &amp; MMF Desk
          </p>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
