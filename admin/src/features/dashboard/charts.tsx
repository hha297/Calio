'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-[10px] bg-bone/60 px-4 text-center">
      <p className="text-sm font-medium text-body">{label}</p>
      <p className="mt-1 max-w-xs text-xs text-ash">
        Charts use live Supabase rows. Empty means no matching activity in this range.
      </p>
    </div>
  );
}

export function TrendLine({
  data,
  color = '#00D95F',
}: {
  data: Array<{ date: string; value: number }>;
  color?: string;
}) {
  const hasSignal = data.some((point) => point.value > 0);
  if (!data.length || !hasSignal) {
    return <EmptyChart label="No activity in this range" />;
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e0d8" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#8d8d8d' }}
            axisLine={false}
            tickLine={false}
            hide={data.length > 20}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8d8d8d' }}
            width={36}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e4e0d8',
              boxShadow: 'none',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RankBars({
  data,
}: {
  data: Array<{ name: string; count: number }>;
}) {
  if (!data.length) {
    return <EmptyChart label="No logged workouts yet" />;
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e0d8" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#8d8d8d' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11, fill: '#3a3a3a' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e4e0d8',
              boxShadow: 'none',
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill="#00D95F" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
