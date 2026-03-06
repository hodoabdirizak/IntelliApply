"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface WeeklyData {
  week: string;
  count: number;
}

interface CompanyData {
  company: string;
  count: number;
}

export function StatusPieChart({ data }: { data: StatusData[] }) {
  const filtered = data.filter((d) => d.value > 0);

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {filtered.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                color: "#f3f4f6",
                fontSize: "0.875rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {filtered.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-400">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function WeeklyChart({ data }: { data: WeeklyData[] }) {
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Applications Over Time</CardTitle>
      </CardHeader>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#843dff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#843dff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                color: "#f3f4f6",
                fontSize: "0.875rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#843dff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function TopCompaniesChart({ data }: { data: CompanyData[] }) {
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Top Companies Applied To</CardTitle>
      </CardHeader>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="company"
              type="category"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                color: "#f3f4f6",
                fontSize: "0.875rem",
              }}
            />
            <Bar dataKey="count" fill="#843dff" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
