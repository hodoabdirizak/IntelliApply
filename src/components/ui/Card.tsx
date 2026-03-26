import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({ className, variant = "default", padding = "md", children, ...props }: CardProps) {
  const variants = {
    default: "bg-surface-1",
    elevated: "bg-surface-1 shadow-lg shadow-black/20",
    bordered: "bg-surface-1 border border-border",
  };

  const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-7" };

  return (
    <div className={clsx("rounded-lg", variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex items-center justify-between mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx("text-sm font-semibold text-gray-200", className)} {...props}>
      {children}
    </h3>
  );
}
