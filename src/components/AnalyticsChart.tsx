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

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E8E8E5",
  borderRadius: "10px",
  color: "#1D1D1F",
  fontSize: "12.5px",
  padding: "8px 10px",
  boxShadow: "0 8px 24px rgb(0 0 0 / 0.06)",
};

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

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-[15px] font-semibold text-ink tracking-tight mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function StatusPieChart({ data }: { data: StatusData[] }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <ChartCard title="Status breakdown">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {filtered.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-1.5 text-[12px]"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-ink-soft font-medium">{item.name}</span>
            <span className="text-ink-mute tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function WeeklyChart({ data }: { data: WeeklyData[] }) {
  return (
    <ChartCard title="Applications over time">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D1D1F" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#1D1D1F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F0F0EC"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "#6E6E73", fontSize: 11 }}
              axisLine={{ stroke: "#E8E8E5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6E6E73", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1D1D1F"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopCompaniesChart({ data }: { data: CompanyData[] }) {
  return (
    <ChartCard title="Top companies">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            barSize={14}
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F0F0EC"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#6E6E73", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="company"
              type="category"
              tick={{ fill: "#1D1D1F", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F5F5F1" }} />
            <Bar dataKey="count" fill="#1D1D1F" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
