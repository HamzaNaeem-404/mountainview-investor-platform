import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[13px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--mv-forest)] text-white",
        secondary:
          "border-transparent bg-[var(--mv-sage)] text-[var(--mv-forest-deep)]",
        outline: "border-[var(--mv-border)] text-[var(--mv-ink)] bg-white",
        shortlisted:
          "border-amber-200 bg-amber-50 text-amber-900",
        diligence:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        stopped:
          "border-stone-200 bg-stone-100 text-stone-600",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800",
        danger:
          "border-red-200 bg-red-50 text-red-800",
        muted:
          "border-stone-200 bg-stone-50 text-stone-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
