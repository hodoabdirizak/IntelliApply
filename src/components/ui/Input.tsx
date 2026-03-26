"use client";

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const inputBase = "w-full px-3 py-2 bg-surface-2 border rounded-md text-gray-200 text-sm placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-accent-500/40 focus:border-accent-500/50 transition-colors";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label htmlFor={id} className="block text-[13px] font-medium text-gray-300">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={clsx(inputBase, error ? "border-red-500/60" : "border-border hover:border-border-light", className)}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  )
);
Input.displayName = "Input";
export default Input;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label htmlFor={id} className="block text-[13px] font-medium text-gray-300">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={clsx(inputBase, "resize-y min-h-[100px]", error ? "border-red-500/60" : "border-border hover:border-border-light", className)}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";
