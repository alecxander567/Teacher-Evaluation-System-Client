// src/components/analytics/HorizontalBarChart.tsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props<T extends object> {
  data: T[];
  dataKey: string;
  nameKey: string;
  title: string;
  loading: boolean;
  color?: string;
  xAxisLabel?: string;
}

export function HorizontalBarChart<T extends object>({
  data,
  dataKey,
  nameKey,
  title,
  loading,
  color = "#E8A23D",
  xAxisLabel,
}: Props<T>) {
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#5B6472]">Loading chart data...</div>
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) =>
      (b[dataKey as keyof T] as number) - (a[dataKey as keyof T] as number),
  );

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
      <h3
        className="text-lg font-semibold text-[#101826] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D9" />
            <XAxis
              type="number"
              stroke="#5B6472"
              label={
                xAxisLabel ?
                  { value: xAxisLabel, position: "bottom" }
                : undefined
              }
            />
            <YAxis
              type="category"
              dataKey={nameKey}
              stroke="#5B6472"
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101826",
                border: "none",
                borderRadius: "8px",
                color: "#FAFAF6",
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
