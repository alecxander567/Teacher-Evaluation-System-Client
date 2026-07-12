// src/components/analytics/EvaluationActivityOverTime.tsx
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
import { FiCalendar } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";

interface SubmissionAnalytics {
  submission_date: string;
  total_submissions: number;
}

interface EvaluationActivityOverTimeProps {
  data: SubmissionAnalytics[];
  loading?: boolean;
  title?: string;
}

// Custom tooltip component - declared outside of render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SubmissionAnalytics;
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
          {new Date(data.submission_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-[#5A6478] mt-1">
          Submissions:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.total_submissions}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const EvaluationActivityOverTime: React.FC<
  EvaluationActivityOverTimeProps
> = ({ data, loading = false, title = "Evaluation Activity Over Time" }) => {
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
          <FiCalendar className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate total submissions
  const totalSubmissions = data.reduce(
    (sum, item) => sum + item.total_submissions,
    0,
  );

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-[#101625]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-[#EBF0FE] text-[#3D6BFF] font-medium">
            Total: {totalSubmissions}
          </span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="submission_date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "#5A6478" }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
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
            <Line
              type="monotone"
              dataKey="total_submissions"
              name="Submissions"
              stroke="#3D6BFF"
              strokeWidth={2.5}
              dot={{
                fill: "#3D6BFF",
                strokeWidth: 2,
                r: 5,
                stroke: "#fff",
              }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "#3D6BFF",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
