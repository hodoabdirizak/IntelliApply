"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { Application } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const salaryDisplay =
    application.salaryMin && application.salaryMax
      ? `${application.currency} ${(application.salaryMin / 1000).toFixed(0)}k - ${(application.salaryMax / 1000).toFixed(0)}k`
      : application.salaryMin
        ? `${application.currency} ${(application.salaryMin / 1000).toFixed(0)}k+`
        : null;

  return (
    <Link href={`/applications/${application.id}`}>
      <Card
        variant="bordered"
        className="hover:border-brand-500/30 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600/20 to-blue-600/20 border border-brand-500/20">
                <span className="text-sm font-bold text-brand-300">
                  {application.company.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                  {application.role}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {application.company}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge status={application.status} />
              {application.remote && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500/15 text-teal-300 border border-teal-500/20">
                  Remote
                </span>
              )}
              {application.location && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {application.location}
                </span>
              )}
              {salaryDisplay && (
                <span className="text-xs text-gray-500">{salaryDisplay}</span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(application.appliedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
