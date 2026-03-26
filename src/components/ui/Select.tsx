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
      {label && <label htmlFor={id} className="block text-[13px] font-medium text-gray-300">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={clsx(
          "w-full px-3 py-2 bg-surface-2 border rounded-md text-gray-200 text-sm",
          "focus:outline-none focus:ring-1 focus:ring-accent-500/40 focus:border-accent-500/50",
          "transition-colors appearance-none cursor-pointer",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b6b80%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:1.25rem] bg-[position:right_0.5rem_center] bg-no-repeat pr-9",
          error ? "border-red-500/60" : "border-border hover:border-border-light",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
export default Select;
