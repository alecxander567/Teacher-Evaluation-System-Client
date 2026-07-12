// src/components/analytics/CompletionRatePerPeriod.tsx
import React, { useMemo } from "react";
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
import { useEvaluationAnalytics } from "../../hooks/useEvaluationAnalytics";

interface CompletionRatePerPeriodProps {
  title?: string;
}

interface ChartDatum {
  period: string;
  completionRate: number;
  totalSubmitted: number;
  totalLinks: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: ChartDatum;
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
          Completion Rate:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.completionRate.toFixed(1)}%
          </span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Submitted: {data.totalSubmitted} / {data.totalLinks}
        </p>
      </div>
    );
  }
  return null;
};

export const CompletionRatePerPeriod: React.FC<
  CompletionRatePerPeriodProps
> = ({ title = "Completion Rate per Evaluation Period" }) => {
  const { completionRatePerPeriod, loading, error } = useEvaluationAnalytics();

  const chartData = useMemo<ChartDatum[]>(() => {
    if (!completionRatePerPeriod || completionRatePerPeriod.length === 0)
      return [];
    return completionRatePerPeriod.map((item) => ({
      period: item.period,
      completionRate: item.completion_rate,
      totalSubmitted: item.total_submitted,
      totalLinks: item.total_links,
    }));
  }, [completionRatePerPeriod]);

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
          <FiTrendingUp className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-sm">Error loading data</p>
          <p className="text-xs text-[#5A6478]">{error}</p>
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

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <h3
        className="text-lg font-semibold text-[#101625] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "#5A6478" }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#5A6478" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5A6478" }} />
            <Line
              type="monotone"
              dataKey="completionRate"
              name="Completion Rate"
              stroke="#4CAF50"
              strokeWidth={2.5}
              dot={{ fill: "#4CAF50", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
