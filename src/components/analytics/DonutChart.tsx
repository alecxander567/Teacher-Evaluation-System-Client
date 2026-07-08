// src/components/analytics/DonutChart.tsx

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props<T extends object> {
  data: T[];
  dataKey: keyof T & string;
  nameKey: keyof T & string;
  title: string;
  loading: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#E8A23D",
  "#4A90E2",
  "#2ECC71",
  "#E74C3C",
  "#9B59B6",
  "#F39C12",
];

interface LabelProps {
  name?: string;
  percent?: number;
}

export function DonutChart<T extends object>({
  data,
  dataKey,
  nameKey,
  title,
  loading,
  colors = DEFAULT_COLORS,
}: Props<T>) {
  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#5B6472]">Loading chart data...</div>
      </div>
    );
  }

  const renderCustomLabel = (props: LabelProps) => {
    const { name, percent } = props;
    if (percent === undefined || name === undefined) return null;
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  const formatTooltip = (
    value: number | string | readonly (string | number)[] | undefined,
  ) => {
    if (typeof value === "number") {
      return [`${value} teachers`, "Count"];
    }
    return [value ?? "", "Count"];
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
      <h3
        className="text-lg font-semibold text-[#101826] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              innerRadius={50}
              dataKey={dataKey}
              nameKey={nameKey}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#101826",
                border: "none",
                borderRadius: "8px",
                color: "#FAFAF6",
              }}
              formatter={formatTooltip}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
