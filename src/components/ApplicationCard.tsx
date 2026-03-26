"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
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
    <Link href={`/applications/${application.id}`}>
      <Card variant="bordered" className="hover:border-border-light transition-colors cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 shrink-0 rounded-md bg-surface-3 border border-border flex items-center justify-center">
                <span className="text-xs font-semibold text-muted">
                  {application.company.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-200 truncate group-hover:text-accent-400 transition-colors">
                  {application.role}
                </h3>
                <p className="text-xs text-muted truncate">{application.company}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <Badge status={application.status} />
              {application.remote && (
                <span className="text-[11px] font-medium text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  Remote
                </span>
              )}
              {application.location && (
                <span className="text-[11px] text-muted">{application.location}</span>
              )}
              {salary && <span className="text-[11px] text-muted">{salary}</span>}
            </div>
          </div>
          <p className="text-[11px] text-muted shrink-0">
            {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
          </p>
        </div>
      </Card>
    </Link>
  );
}
