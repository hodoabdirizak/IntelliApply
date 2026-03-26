"use client";

import { useState, useEffect, useMemo } from "react";
import {
  StatusPieChart,
  WeeklyChart,
  TopCompaniesChart,
} from "@/components/AnalyticsChart";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import type { Application } from "@/types";
import { format, startOfWeek, subWeeks } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  Saved: "#6b7280",
  Applied: "#3b82f6",
  Screening: "#06b6d4",
  Interviewing: "#10b981",
  Offer: "#f59e0b",
  Accepted: "#10b981",
  Rejected: "#ef4444",
  Withdrawn: "#f97316",
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
      const label =
        app.status.charAt(0) + app.status.slice(1).toLowerCase();
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#6b7280",
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

  const summaryStats = useMemo(() => {
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
              (sum, a) => sum + ((a.salaryMin! + a.salaryMax!) / 2),
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
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-2 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-surface-1 rounded-lg border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-surface-1 rounded-lg border border-border animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-muted mt-1">
          Insights into your job search performance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applied",
            value: summaryStats.total,
            color: "text-accent-400",
          },
          {
            label: "Response Rate",
            value: `${summaryStats.responseRate}%`,
            color: "text-blue-400",
          },
          {
            label: "Offer Rate",
            value: `${summaryStats.offerRate}%`,
            color: "text-emerald-400",
          },
          {
            label: "Avg Salary",
            value: summaryStats.avgSalary
              ? `$${(summaryStats.avgSalary / 1000).toFixed(0)}k`
              : "N/A",
            color: "text-amber-400",
          },
        ].map((stat) => (
          <Card key={stat.label} variant="bordered">
            <p className="text-xs text-muted mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {applications.length === 0 ? (
        <Card variant="bordered" className="text-center py-16">
          <div className="inline-flex p-4 rounded-full bg-surface-2 mb-4">
            <svg
              className="w-10 h-10 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No data to display
          </h3>
          <p className="text-muted text-sm">
            Start tracking applications to see analytics here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
