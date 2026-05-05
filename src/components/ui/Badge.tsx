import { clsx } from "clsx";
import type { ApplicationStatus } from "@/types";

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED:        "bg-surface-2 text-ink-soft",
  APPLIED:      "bg-info-50 text-info-700",
  SCREENING:    "bg-purple-50 text-purple-700",
  INTERVIEWING: "bg-warn-50 text-warn-700",
  OFFER:        "bg-success-50 text-success-700",
  ACCEPTED:     "bg-success-500 text-white",
  REJECTED:     "bg-danger-50 text-danger-700",
  WITHDRAWN:    "bg-surface-3 text-ink-mute",
};

const statusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default function Badge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium tracking-tight",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
