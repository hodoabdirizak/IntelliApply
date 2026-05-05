"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Application } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function ApplicationCard({ application }: { application: Application }) {
  const salary =
    application.salaryMin && application.salaryMax
      ? `${application.currency} ${(application.salaryMin / 1000).toFixed(0)}k–${(application.salaryMax / 1000).toFixed(0)}k`
      : application.salaryMin
        ? `${application.currency} ${(application.salaryMin / 1000).toFixed(0)}k+`
        : null;

  return (
    <Link
      href={`/applications/${application.id}`}
      className="group block rounded-2xl border border-line bg-surface px-5 py-4 transition-all hover:border-line-strong hover:bg-surface-2/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-[13px] font-semibold text-ink-soft">
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14.5px] font-semibold text-ink truncate group-hover:text-ink tracking-tight">
                {application.role}
              </h3>
              <p className="text-[13px] text-ink-mute truncate mt-0.5">
                {application.company}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge status={application.status} />
                {application.remote && (
                  <span className="text-[11.5px] font-medium text-ink-soft bg-surface-2 px-2 py-0.5 rounded-full">
                    Remote
                  </span>
                )}
                {application.location && (
                  <span className="text-[12px] text-ink-mute">{application.location}</span>
                )}
                {salary && <span className="text-[12px] text-ink-mute tabular-nums">{salary}</span>}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[12px] text-ink-faint shrink-0 whitespace-nowrap pt-1">
          {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
}
