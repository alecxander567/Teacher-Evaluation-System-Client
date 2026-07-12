// src/components/analytics/TeacherPerformanceTrend.tsx
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
  type TooltipProps,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import { usePerformanceTrend } from "../../hooks/useTeacherAnalytics";
import type { PerformanceTrend as PerformanceTrendType } from "../../services/teacherAnalyticsService";

interface TeacherPerformanceTrendProps {
  teacherId?: number;
  title?: string;
  teacherName?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      rating: number;
      academicYear: string;
      semester: string;
    };
    value: number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E4E8F0]">
        <p className="text-sm font-semibold text-[#101625]">{data.date}</p>
        <p className="text-xs text-[#5A6478] mt-1">Semester: {data.semester}</p>
        <p className="text-xs text-[#5A6478]">
          Rating:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.rating.toFixed(2)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const TeacherPerformanceTrend: React.FC<
  TeacherPerformanceTrendProps
> = ({
  teacherId = 12,
  title = "Performance Trend",
  teacherName = "Current Teacher",
}) => {
  const { data: apiData, loading, error } = usePerformanceTrend(teacherId);

  // Transform API data to match chart format
  const chartData =
    apiData?.map((item: PerformanceTrendType) => ({
      date: item.period,
      rating: item.avg_rating,
      academicYear: item.academic_year,
      semester: item.semester,
    })) || [];

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <LoadingSpinner label="Loading chart data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-center text-red-500">
          <p className="text-sm">Error loading data</p>
          <p className="text-xs text-[#5A6478]">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
        <div className="text-center">
          <FiTrendingUp className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  // Get teacher name from the first data item if available
  const displayTeacherName = teacherName || "Current Teacher";

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-[#101625]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {title}
        </h3>
        <span className="text-sm text-[#5A6478]">{displayTeacherName}</span>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5A6478" }} />
            <YAxis tick={{ fontSize: 11, fill: "#5A6478" }} domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5A6478" }} />
            <Line
              type="monotone"
              dataKey="rating"
              name="Rating"
              stroke="#3D6BFF"
              strokeWidth={2.5}
              dot={{ fill: "#3D6BFF", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
