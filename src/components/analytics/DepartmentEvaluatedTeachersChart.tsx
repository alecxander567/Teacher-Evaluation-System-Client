// src/components/analytics/DepartmentEvaluatedTeachersChart.tsx
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

interface DepartmentTeacherCountData {
  department_id: number;
  department_name: string;
  evaluated_teacher_count: number;
}

interface Props {
  data: DepartmentTeacherCountData[];
  loading: boolean;
}

export const DepartmentEvaluatedTeachersChart: React.FC<Props> = ({
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
          <p className="text-sm">No department teacher count data available.</p>
        </div>
      </div>
    );
  }

  // Sort by count descending
  const sortedData = [...data].sort(
    (a, b) => b.evaluated_teacher_count - a.evaluated_teacher_count,
  );

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        Number of Evaluated Teachers per Department
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
              stroke="#5A6478"
              tick={{ fontSize: 12 }}
              label={{
                value: "Number of Teachers",
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
                if (typeof value !== "number") return ["", "Teachers"];
                return [`${value} teacher${value > 1 ? "s" : ""}`, "Count"];
              }}
            />
            <Bar
              dataKey="evaluated_teacher_count"
              name="Teachers Evaluated"
              fill="#6E8CFF"
              radius={[4, 4, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
