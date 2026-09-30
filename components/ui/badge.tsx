import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium rounded-full border",
  {
    variants: {
      variant: {
        default:     "text-ds-text-secondary  bg-ds-bg-subtle   border-ds-border",
        brand:       "text-ds-brand           bg-ds-brand-muted border-ds-border-brand",
        success:     "text-emerald-400        bg-emerald-400/8  border-emerald-400/20",
        error:       "text-red-400            bg-red-400/8      border-red-400/20",
        warning:     "text-yellow-400         bg-yellow-400/8   border-yellow-400/20",
        info:        "text-blue-400           bg-blue-400/8     border-blue-400/20",
      },
      size: {
        sm: "text-[10px] px-2   py-0.5",
        md: "text-xs     px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };
