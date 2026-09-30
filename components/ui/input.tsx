"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase = [
  "flex h-10 w-full rounded-xl px-4 text-sm",
  "bg-ds-bg-subtle border border-ds-border",
  "text-ds-text-primary placeholder:text-ds-text-muted",
  "transition-colors outline-none",
  "focus:border-ds-brand focus:bg-ds-bg-card",
  "disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ");

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        inputBase,
        error && "border-ds-error/60 focus:border-ds-error",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ── Password input with show/hide toggle ──────────────────────────────────────

type PasswordInputProps = Omit<InputProps, "type">;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          ref={ref}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
