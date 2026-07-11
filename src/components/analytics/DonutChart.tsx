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
  "#3D6BFF",
  "#6E8CFF",
  "#9BAEFF",
  "#1A3A8A",
  "#4A7AFF",
  "#2A5AF0",
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

  const renderCustomLabel = (props: LabelProps) => {
    const { name, percent } = props;
    if (percent === undefined || name === undefined) return null;
    return `${(percent * 100).toFixed(0)}%`;
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
    <div>
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
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
                backgroundColor: "#121A2E",
                border: "none",
                borderRadius: "8px",
                color: "#F4F6FA",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "#8E97AE", fontSize: "12px" }}
              itemStyle={{ color: "#F4F6FA", fontSize: "13px" }}
              formatter={formatTooltip}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#5A6478" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
