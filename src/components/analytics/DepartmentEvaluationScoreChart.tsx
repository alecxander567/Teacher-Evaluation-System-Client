// src/components/analytics/DepartmentEvaluationScoreChart.tsx
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

interface DepartmentScoreData {
  department_id: number;
  department_name: string;
  avg_rating: number;
}

interface Props {
  data: DepartmentScoreData[];
  loading: boolean;
}

export const DepartmentEvaluationScoreChart: React.FC<Props> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-[#5A6478]">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-[#5A6478] flex flex-col items-center gap-2">
          <p className="text-sm">No department evaluation data available.</p>
        </div>
      </div>
    );
  }

  // Sort by avg_rating descending
  const sortedData = [...data].sort((a, b) => b.avg_rating - a.avg_rating);

  // Color gradient based on rating
  const getBarColor = (rating: number) => {
    if (rating >= 4.0) return "#4CAF50";
    if (rating >= 3.0) return "#3D6BFF";
    if (rating >= 2.0) return "#FF9800";
    return "#E53935";
  };

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        Department Evaluation Scores
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="department_name"
              stroke="#5A6478"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 5]}
              stroke="#5A6478"
              tick={{ fontSize: 12 }}
              label={{
                value: "Average Rating",
                angle: -90,
                position: "left",
                fill: "#5A6478",
                fontSize: 12,
              }}
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
              formatter={(value) => {
                if (typeof value !== "number") return ["", "Avg Rating"];
                return [value.toFixed(2), "Average Rating"];
              }}
            />
            <Bar
              dataKey="avg_rating"
              name="Average Rating"
              radius={[4, 4, 0, 0]}
              barSize={50}>
              {sortedData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="avg_rating"
                  fill={getBarColor(entry.avg_rating)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
