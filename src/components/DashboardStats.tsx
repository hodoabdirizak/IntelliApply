"use client";

import Card from "@/components/ui/Card";
import type { DashboardStats as StatsType } from "@/types";

const statCards = [
  { key: "total" as const, label: "Total", color: "text-accent-400", bar: "bg-accent-500" },
  { key: "interviewing" as const, label: "Interviewing", color: "text-blue-400", bar: "bg-blue-500" },
  { key: "offers" as const, label: "Offers", color: "text-amber-400", bar: "bg-amber-500" },
  { key: "responseRate" as const, label: "Response Rate", color: "text-emerald-400", bar: "bg-emerald-500", pct: true },
];

export default function DashboardStats({ stats }: { stats: StatsType }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((c) => (
        <Card key={c.key} variant="bordered" className="relative overflow-hidden">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted mb-2">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>
            {c.pct ? `${stats[c.key]}%` : stats[c.key]}
          </p>
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${c.bar} opacity-40`} />
        </Card>
      ))}
    </div>
  );
}
