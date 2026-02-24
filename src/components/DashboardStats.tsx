"use client";

import Card from "@/components/ui/Card";
import type { DashboardStats as StatsType } from "@/types";

interface DashboardStatsProps {
  stats: StatsType;
}

const statCards = [
  {
    key: "total" as const,
    label: "Total Applications",
    gradient: "from-brand-600 to-brand-400",
    iconBg: "bg-brand-500/20",
  },
  {
    key: "interviewing" as const,
    label: "Interviewing",
    gradient: "from-blue-600 to-cyan-400",
    iconBg: "bg-blue-500/20",
  },
  {
    key: "offers" as const,
    label: "Offers",
    gradient: "from-amber-600 to-yellow-400",
    iconBg: "bg-amber-500/20",
  },
  {
    key: "responseRate" as const,
    label: "Response Rate",
    gradient: "from-emerald-600 to-teal-400",
    iconBg: "bg-emerald-500/20",
    isPercentage: true,
  },
];

const icons = [
  <svg
    key="total"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>,
  <svg
    key="interview"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
    />
  </svg>,
  <svg
    key="offer"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>,
  <svg
    key="rate"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>,
];

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card
          key={card.key}
          variant="bordered"
          className="relative overflow-hidden group hover:border-gray-600/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">
                {card.isPercentage
                  ? `${stats[card.key]}%`
                  : stats[card.key]}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl ${card.iconBg} text-white/80`}
            >
              {icons[index]}
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
          />
        </Card>
      ))}
    </div>
  );
}
