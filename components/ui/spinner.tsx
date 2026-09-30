import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = { sm: 13, md: 18, lg: 24 } as const;

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizes;
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 size={sizes[size]} className="animate-spin text-ds-text-tertiary" />
    </span>
  );
}
