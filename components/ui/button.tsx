"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "transition-all active:scale-[0.98]",
    "disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-brand/50",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-ds-brand hover:bg-ds-brand-hover text-white border border-ds-brand shadow-ds-sm",
        outline:
          "border border-ds-border-brand text-ds-brand hover:bg-ds-brand hover:text-white hover:border-ds-brand",
        ghost:
          "bg-ds-bg-subtle hover:bg-ds-bg-hover text-ds-text-secondary border border-ds-border",
        destructive:
          "border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500",
        link: "text-ds-brand underline-offset-4 hover:underline p-0 h-auto border-0 bg-transparent",
      },
      size: {
        sm:   "h-7  px-3 text-xs  rounded-lg",
        md:   "h-9  px-4 text-sm  rounded-xl",
        lg:   "h-11 px-6 text-sm  rounded-xl",
        xl:   "h-12 px-8 text-base rounded-xl",
        icon: "h-9  w-9           rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  fullWidth,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={13} className="animate-spin shrink-0" />}
      {children}
    </button>
  );
}

export { buttonVariants };
