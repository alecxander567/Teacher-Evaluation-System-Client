// src/components/analytics/StudentParticipationByDepartment.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FiUsers } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";

interface DepartmentSubmissionAnalytics {
  department_name: string;
  total_submissions: number;
  unique_students_participated: number;
}

interface StudentParticipationByDepartmentProps {
  data: DepartmentSubmissionAnalytics[];
  loading?: boolean;
  title?: string;
}

// Custom tooltip component - declared outside of render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DepartmentSubmissionAnalytics;
    value: number;
    name: string;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E4E8F0]">
        <p className="text-sm font-semibold text-[#101625]">
          {data.department_name}
        </p>
        <p className="text-xs text-[#5A6478] mt-1">
          Total Submissions:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.total_submissions}
          </span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Unique Students:{" "}
          <span className="font-medium text-[#4CAF50]">
            {data.unique_students_participated}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const StudentParticipationByDepartment: React.FC<
  StudentParticipationByDepartmentProps
> = ({
  data,
  loading = false,
  title = "Student Participation by Department",
}) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <LoadingSpinner label="Loading chart data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-center">
          <FiUsers className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  // Sort by total submissions descending
  const sortedData = [...data].sort(
    (a, b) => b.total_submissions - a.total_submissions,
  );

  // Get color based on total submissions
  const getBarColor = (submissions: number, maxSubmissions: number) => {
    const ratio = submissions / maxSubmissions;
    if (ratio >= 0.8) return "#3D6BFF";
    if (ratio >= 0.5) return "#6E8CFF";
    if (ratio >= 0.3) return "#9DAFFF";
    return "#C5D0E8";
  };

  const maxSubmissions = Math.max(
    ...sortedData.map((d) => d.total_submissions),
  );

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="department_name"
              angle={-25}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 11, fill: "#5A6478" }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#5A6478" }}
              label={{
                value: "Number of Submissions",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#5A6478", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#5A6478" }}
              iconType="circle"
            />
            <Bar
              dataKey="total_submissions"
              name="Total Submissions"
              radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.total_submissions, maxSubmissions)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="unique_students_participated"
              name="Unique Students"
              radius={[4, 4, 0, 0]}
              fill="#4CAF50"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
