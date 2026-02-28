"use client";

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "w-full px-3.5 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
            "transition-colors duration-200",
            error
              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
              : "border-gray-700 hover:border-gray-600",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

// Textarea variant
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            "w-full px-3.5 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
            "transition-colors duration-200 resize-y min-h-[100px]",
            error
              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
              : "border-gray-700 hover:border-gray-600",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
