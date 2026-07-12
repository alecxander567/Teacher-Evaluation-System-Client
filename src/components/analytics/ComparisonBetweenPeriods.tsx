// src/components/analytics/ComparisonBetweenPeriods.tsx
import React, { useMemo } from "react";
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
import { useEvaluationAnalytics } from "../../hooks/useEvaluationAnalytics";

interface ComparisonBetweenPeriodsProps {
  title?: string;
}

interface ChartDatum {
  period: string;
  averageScore: number;
  academic_year: string;
  semester: string;
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
          Average Rating:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.averageScore.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Academic Year: {data.academic_year}
        </p>
        <p className="text-xs text-[#5A6478]">Semester: {data.semester}</p>
      </div>
    );
  }
  return null;
};

export const ComparisonBetweenPeriods: React.FC<
  ComparisonBetweenPeriodsProps
> = ({ title = "Comparison Between Evaluation Periods" }) => {
  const { periodsComparison, loading, error } = useEvaluationAnalytics();

  const chartData = useMemo<ChartDatum[]>(() => {
    if (!periodsComparison || periodsComparison.length === 0) return [];
    return periodsComparison.map((item) => ({
      period: item.period,
      averageScore: item.avg_rating,
      academic_year: item.academic_year,
      semester: item.semester,
    }));
  }, [periodsComparison]);

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
          <FiBarChart2 className="h-12 w-12 text-red-400 mx-auto mb-3" />
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
          <FiBarChart2 className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  const getBarColor = (score: number) => {
    if (score >= 4.5) return "#4CAF50";
    if (score >= 4.0) return "#8BC34A";
    if (score >= 3.5) return "#FFC107";
    if (score >= 3.0) return "#FF9800";
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
            <YAxis tick={{ fontSize: 11, fill: "#5A6478" }} domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5A6478" }} />
            <Bar
              dataKey="averageScore"
              name="Average Rating"
              radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.averageScore)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
