"use client";

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const inputBase =
  "w-full px-3.5 py-2.5 bg-surface border rounded-xl text-ink text-[14px] placeholder-ink-faint focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 transition-all";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-ink-soft"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          inputBase,
          error
            ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10"
            : "border-line hover:border-line-strong",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-700 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-ink-mute">{helperText}</p>
      )}
    </div>
  )
);
Input.displayName = "Input";
export default Input;

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-ink-soft"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={clsx(
          inputBase,
          "resize-y min-h-[120px] leading-relaxed",
          error
            ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10"
            : "border-line hover:border-line-strong",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-700 font-medium">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";
