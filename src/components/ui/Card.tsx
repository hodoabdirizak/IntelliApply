import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  className,
  variant = "default",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-surface border border-line",
    elevated: "bg-surface shadow-[0_4px_20px_rgb(0_0_0_/_0.04)] border border-line",
    bordered: "bg-surface border border-line-strong",
  };

  const paddings = { none: "", sm: "p-5", md: "p-6", lg: "p-8" };

  return (
    <div
      className={clsx("rounded-2xl", variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("flex items-center justify-between mb-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx("text-[15px] font-semibold text-ink tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
