// src/components/analytics/TeacherRatingDistribution.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  type PieLabelRenderProps,
} from "recharts";
import { FiPieChart } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import { useRatingDistribution } from "../../hooks/useTeacherAnalytics";
import type { RatingDistribution as RatingDistributionType } from "../../services/teacherAnalyticsService";

interface TeacherRatingDistributionProps {
  teacherId?: number;
  title?: string;
}

const COLORS = ["#4CAF50", "#8BC34A", "#FFC107", "#FF9800", "#F44336"];

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: {
      rating: string;
      count: number;
    };
    value: number;
    name: string;
  }>;
  label?: string;
}

interface CustomLabelProps extends PieLabelRenderProps {
  rating?: string;
  percent?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Calculate total from all data points
    const total = payload.reduce((sum, item) => sum + item.payload.count, 0);
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E4E8F0]">
        <p className="text-sm font-semibold text-[#101625]">{data.rating}</p>
        <p className="text-xs text-[#5A6478] mt-1">
          Count:{" "}
          <span className="font-medium text-[#3D6BFF]">{data.count}</span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Percentage:{" "}
          <span className="font-medium">
            {((data.count / total) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const renderPieLabel = (props: CustomLabelProps) => {
  const { rating, percent } = props;
  return `${rating ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`;
};

export const TeacherRatingDistribution: React.FC<
  TeacherRatingDistributionProps
> = ({ teacherId = 12, title = "Rating Distribution" }) => {
  const { data: apiData, loading, error } = useRatingDistribution(teacherId);

  // Transform API data to match chart format
  const chartData =
    apiData?.map((item: RatingDistributionType) => ({
      rating: `${item.rating} ${item.rating === 1 ? "Star" : "Stars"}`,
      count: item.count,
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
          <FiPieChart className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="count"
              label={renderPieLabel}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5A6478" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
