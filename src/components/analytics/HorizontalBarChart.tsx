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
  color = "#3D6BFF",
  xAxisLabel,
}: Props<T>) {
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-[#5A6478]">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-[#5A6478]">No data available</div>
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) =>
      (b[dataKey as keyof T] as number) - (a[dataKey as keyof T] as number),
  );

  return (
    <div>
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              type="number"
              stroke="#5A6478"
              tick={{ fontSize: 12 }}
              domain={[0, 5]}
              label={
                xAxisLabel ?
                  { value: xAxisLabel, position: "bottom", fill: "#5A6478" }
                : undefined
              }
            />
            <YAxis
              type="category"
              dataKey={nameKey}
              stroke="#5A6478"
              width={120}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#121A2E",
                border: "none",
                borderRadius: "8px",
                color: "#F4F6FA",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "#8E97AE", fontSize: "12px" }}
              itemStyle={{ color: "#F4F6FA", fontSize: "13px" }}
            />
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
