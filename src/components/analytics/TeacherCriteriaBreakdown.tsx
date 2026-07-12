// src/components/analytics/TeacherCriteriaBreakdown.tsx
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
  type TooltipProps,
} from "recharts";
import { FiBarChart2 } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import { useCriteriaBreakdown } from "../../hooks/useTeacherAnalytics";
import type { CriteriaBreakdown as CriteriaBreakdownType } from "../../services/teacherAnalyticsService";

interface TeacherCriteriaBreakdownProps {
  teacherId?: number;
  title?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: {
      criteria: string;
      rating: number;
    };
    value: number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E4E8F0]">
        <p className="text-sm font-semibold text-[#101625]">{label}</p>
        <p className="text-xs text-[#5A6478] mt-1">
          Rating:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {(data.rating ?? 0).toFixed(2)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const TeacherCriteriaBreakdown: React.FC<
  TeacherCriteriaBreakdownProps
> = ({ teacherId = 12, title = "Criteria Breakdown" }) => {
  const { data: apiData, loading, error } = useCriteriaBreakdown(teacherId);

  // Transform API data to match chart format
  const chartData =
    apiData?.map((item: CriteriaBreakdownType) => ({
      criteria: item.category,
      rating: item.avg_rating,
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
          <FiBarChart2 className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  const sortedData = [...chartData].sort((a, b) => b.rating - a.rating);

  const getBarColor = (rating: number) => {
    if (rating >= 4.5) return "#4CAF50";
    if (rating >= 4.0) return "#8BC34A";
    if (rating >= 3.5) return "#FFC107";
    if (rating >= 3.0) return "#FF9800";
    return "#F44336";
  };

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
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="criteria"
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: "#5A6478" }}
            />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#5A6478" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5A6478" }} />
            <Bar dataKey="rating" name="Rating" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rating)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
