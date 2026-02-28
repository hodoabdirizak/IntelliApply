import { clsx } from "clsx";
import type { ApplicationStatus } from "@/types";

interface BadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  SAVED: {
    label: "Saved",
    className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  },
  APPLIED: {
    label: "Applied",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  SCREENING: {
    label: "Screening",
    className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  INTERVIEWING: {
    label: "Interviewing",
    className: "bg-brand-500/20 text-brand-300 border-brand-500/30",
  },
  OFFER: {
    label: "Offer",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
};

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
