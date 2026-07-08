// src/components/analytics/BarChart.tsx

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Use a simpler generic approach
interface Props<T extends object> {
  data: T[];
  dataKey: string;
  nameKey: string;
  title: string;
  loading: boolean;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function BarChart<T extends object>({
  data,
  dataKey,
  nameKey,
  title,
  loading,
  color = "#4A90E2",
  xAxisLabel,
  yAxisLabel,
}: Props<T>) {
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#5B6472]">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
      <h3
        className="text-lg font-semibold text-[#101826] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D9" />
            <XAxis
              dataKey={nameKey}
              stroke="#5B6472"
              label={
                xAxisLabel ?
                  { value: xAxisLabel, position: "bottom" }
                : undefined
              }
            />
            <YAxis
              stroke="#5B6472"
              label={
                yAxisLabel ?
                  { value: yAxisLabel, angle: -90, position: "left" }
                : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101826",
                border: "none",
                borderRadius: "8px",
                color: "#FAFAF6",
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
