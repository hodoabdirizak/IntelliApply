import { clsx } from "clsx";
import type { ApplicationStatus } from "@/types";

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  APPLIED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SCREENING: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  INTERVIEWING: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  OFFER: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ACCEPTED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  WITHDRAWN: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const statusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Saved", APPLIED: "Applied", SCREENING: "Screening",
  INTERVIEWING: "Interviewing", OFFER: "Offer", ACCEPTED: "Accepted",
  REJECTED: "Rejected", WITHDRAWN: "Withdrawn",
};

export default function Badge({ status, className }: { status: ApplicationStatus; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border", statusStyles[status], className)}>
      {statusLabels[status]}
    </span>
  );
}
