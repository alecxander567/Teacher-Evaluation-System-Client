// src/components/analytics/DepartmentPerformanceTrendChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DepartmentTrendData {
  academic_year: string;
  avg_rating: number;
  department_name: string;
  period: string;
  semester: string;
}

interface Props {
  data: DepartmentTrendData[];
  loading: boolean;
}

export const DepartmentPerformanceTrendChart: React.FC<Props> = ({
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
          <p className="text-sm">No department trend data available.</p>
        </div>
      </div>
    );
  }

  // Group data by department
  const departments = [...new Set(data.map((d) => d.department_name))];

  // Create chart data with all departments
  const chartData = data.map((d) => ({
    period: `${d.period} (${d.academic_year})`,
    [d.department_name]: d.avg_rating,
    semester: d.semester,
  }));

  // Colors for different departments
  const departmentColors: { [key: string]: string } = {
    "Computing Department": "#3D6BFF",
    "Education Department": "#6E8CFF",
    "Engineering Department": "#4CAF50",
    "Business Department": "#FF9800",
    "Arts Department": "#E53935",
  };

  // Get unique departments with their colors
  const uniqueDepartments = departments.map((dept) => ({
    name: dept,
    color: departmentColors[dept] || "#3D6BFF",
  }));

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        Department Performance Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis dataKey="period" stroke="#5A6478" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} stroke="#5A6478" tick={{ fontSize: 12 }} />
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
                return [value.toFixed(2), "Avg Rating"];
              }}
              labelFormatter={(label, payload) => {
                const semester = payload?.[0]?.payload?.semester;
                return semester ? `${label} — ${semester}` : label;
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#5A6478" }} />
            {uniqueDepartments.map((dept) => (
              <Line
                key={dept.name}
                type="monotone"
                dataKey={dept.name}
                name={dept.name}
                stroke={dept.color}
                strokeWidth={2}
                dot={{ r: 4, fill: dept.color, stroke: dept.color }}
                activeDot={{
                  r: 6,
                  fill: dept.color,
                  stroke: "#F4F6FA",
                  strokeWidth: 2,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
