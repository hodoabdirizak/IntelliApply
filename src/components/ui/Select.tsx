"use client";

import { clsx } from "clsx";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-ink-soft"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={clsx(
          "w-full px-3.5 py-2.5 bg-surface border rounded-xl text-ink text-[14px]",
          "focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10",
          "transition-all appearance-none cursor-pointer",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236E6E73%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:1.1rem] bg-[position:right_0.75rem_center] bg-no-repeat pr-10",
          error
            ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10"
            : "border-line hover:border-line-strong",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-700 font-medium">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
export default Select;
