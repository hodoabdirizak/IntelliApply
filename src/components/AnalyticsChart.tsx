"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

const tooltipStyle = {
  backgroundColor: "#12121a",
  border: "1px solid #2a2a36",
  borderRadius: "0.5rem",
  color: "#e5e5e5",
  fontSize: "0.8rem",
};

interface StatusData { name: string; value: number; color: string }
interface WeeklyData { week: string; count: number }
interface CompanyData { company: string; count: number }

export function StatusPieChart({ data }: { data: StatusData[] }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <Card variant="bordered">
      <CardHeader><CardTitle>Status Breakdown</CardTitle></CardHeader>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filtered} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
              {filtered.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-1">
        {filtered.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function WeeklyChart({ data }: { data: WeeklyData[] }) {
  return (
    <Card variant="bordered">
      <CardHeader><CardTitle>Applications Over Time</CardTitle></CardHeader>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#6b6b80", fontSize: 11 }} axisLine={{ stroke: "#2a2a36" }} tickLine={false} />
            <YAxis tick={{ fill: "#6b6b80", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function TopCompaniesChart({ data }: { data: CompanyData[] }) {
  return (
    <Card variant="bordered">
      <CardHeader><CardTitle>Top Companies</CardTitle></CardHeader>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b6b80", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis dataKey="company" type="category" tick={{ fill: "#6b6b80", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
