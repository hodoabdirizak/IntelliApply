"use client";

import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-full transition-all focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

    const variants = {
      primary: "bg-ink text-white hover:opacity-90 active:opacity-95",
      secondary:
        "bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2",
      ghost: "bg-transparent text-ink-soft hover:bg-surface-2 hover:text-ink",
      danger: "bg-danger-500 text-white hover:bg-danger-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[12.5px] gap-1.5",
      md: "px-4 py-2 text-[13.5px] gap-2",
      lg: "px-6 py-3 text-[15px] gap-2",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
