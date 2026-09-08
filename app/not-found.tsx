import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl">That fund is not in the desk</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The page may have been renamed, or the fund is not in this survey.
      </p>
      <Button asChild className="mt-6">
        <Link href="/funds">Back to the fund list</Link>
      </Button>
    </div>
  );
}
