"use client";

import { useState, useEffect, useMemo } from "react";
import {
  StatusPieChart,
  WeeklyChart,
  TopCompaniesChart,
} from "@/components/AnalyticsChart";
import type { Application } from "@/types";
import { format, startOfWeek, subWeeks } from "date-fns";

// Refined editorial palette — muted, deliberate.
const STATUS_COLORS: Record<string, string> = {
  Saved:        "#A1A1A6",
  Applied:      "#3B82F6",
  Screening:    "#8B5CF6",
  Interviewing: "#F59E0B",
  Offer:        "#10B981",
  Accepted:     "#047857",
  Rejected:     "#EF4444",
  Withdrawn:    "#6E6E73",
};

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app) => {
      const label = app.status.charAt(0) + app.status.slice(1).toLowerCase();
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#A1A1A6",
    }));
  }, [applications]);

  const weeklyApplications = useMemo(() => {
    const weeks: Record<string, number> = {};
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const key = format(weekStart, "MMM d");
      weeks[key] = 0;
    }
    applications.forEach((app) => {
      const weekStart = startOfWeek(new Date(app.appliedAt));
      const key = format(weekStart, "MMM d");
      if (key in weeks) weeks[key]++;
    });
    return Object.entries(weeks).map(([week, count]) => ({ week, count }));
  }, [applications]);

  const topCompanies = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app) => {
      counts[app.company] = (counts[app.company] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([company, count]) => ({ company, count }));
  }, [applications]);

  const summary = useMemo(() => {
    const total = applications.length;
    const withResponse = applications.filter((a) =>
      ["SCREENING", "INTERVIEWING", "OFFER", "ACCEPTED", "REJECTED"].includes(
        a.status
      )
    ).length;
    const offers = applications.filter((a) =>
      ["OFFER", "ACCEPTED"].includes(a.status)
    ).length;
    const avgSalaryApps = applications.filter(
      (a) => a.salaryMin && a.salaryMax
    );
    const avgSalary =
      avgSalaryApps.length > 0
        ? Math.round(
            avgSalaryApps.reduce(
              (sum, a) => sum + (a.salaryMin! + a.salaryMax!) / 2,
              0
            ) / avgSalaryApps.length
          )
        : 0;

    return {
      total,
      responseRate: total > 0 ? Math.round((withResponse / total) * 100) : 0,
      offerRate:
        withResponse > 0 ? Math.round((offers / withResponse) * 100) : 0,
      avgSalary,
    };
  }, [applications]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <div className="h-9 w-48 bg-surface-2 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-line bg-surface animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl border border-line bg-surface animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
      {/* Header */}
      <div>
        <p className="eyebrow mb-3">Analytics</p>
        <h1 className="display-2 text-ink">Where you stand.</h1>
        <p className="text-[15px] text-ink-mute mt-3 max-w-md">
          A read on response rates, conversion, and where your applications go.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total applied", value: summary.total },
          { label: "Response rate", value: `${summary.responseRate}%` },
          { label: "Offer rate", value: `${summary.offerRate}%` },
          {
            label: "Avg. salary",
            value: summary.avgSalary
              ? `$${(summary.avgSalary / 1000).toFixed(0)}k`
              : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-surface px-5 py-5"
          >
            <p className="text-[12px] font-medium text-ink-mute mb-2 tracking-tight">
              {stat.label}
            </p>
            <p className="text-[32px] font-semibold text-ink tracking-[-0.03em] tabular-nums leading-none">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-24 text-center">
          <h3 className="text-[18px] font-semibold text-ink mb-2 tracking-tight">
            Nothing to chart yet
          </h3>
          <p className="text-[14px] text-ink-mute max-w-sm mx-auto">
            Once you've added a few applications, this is where the trends will
            live.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <StatusPieChart data={statusBreakdown} />
          <WeeklyChart data={weeklyApplications} />
          <div className="lg:col-span-2">
            <TopCompaniesChart data={topCompanies} />
          </div>
        </div>
      )}
    </div>
  );
}
