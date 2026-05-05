"use client";

import type { DashboardStats as StatsType } from "@/types";

const cards = [
  { key: "total" as const,        label: "Total" },
  { key: "interviewing" as const, label: "Interviewing" },
  { key: "offers" as const,       label: "Offers" },
  { key: "responseRate" as const, label: "Response rate", pct: true },
];

export default function DashboardStats({ stats }: { stats: StatsType }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-2xl border border-line bg-surface px-5 py-5"
        >
          <p className="text-[12px] font-medium text-ink-mute mb-2 tracking-tight">
            {c.label}
          </p>
          <p className="text-[32px] font-semibold text-ink tracking-[-0.03em] tabular-nums leading-none">
            {c.pct ? `${stats[c.key]}%` : stats[c.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
