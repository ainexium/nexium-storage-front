"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[90px] w-full rounded-xl px-4 py-3 text-sm",
        "bg-ds-bg-subtle border border-ds-border",
        "text-ds-text-primary placeholder:text-ds-text-muted",
        "transition-colors outline-none resize-none",
        "focus:border-ds-brand focus:bg-ds-bg-card",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        error && "border-ds-error/60 focus:border-ds-error",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
