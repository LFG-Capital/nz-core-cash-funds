import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        outline: "text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        kiwi: "border-transparent bg-emerald-100 text-emerald-900",
        retail: "border-transparent bg-sky-100 text-sky-900",
        etf: "border-transparent bg-amber-100 text-amber-900",
        work: "border-transparent bg-violet-100 text-violet-900",
        closed: "border-transparent bg-stone-200 text-stone-700",
        pass: "border-transparent bg-emerald-100 text-emerald-900",
        warn: "border-transparent bg-amber-100 text-amber-950",
        fail: "border-transparent bg-rose-100 text-rose-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
