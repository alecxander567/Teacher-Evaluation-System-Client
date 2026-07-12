// src/components/analytics/AverageScorePerCriterion.tsx
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
import { FiBarChart2 } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";

interface QuestionAnalytics {
  avg_rating: number;
  category: string;
  question: string;
  question_id: number;
  total_responses: number;
}

interface AverageScorePerCriterionProps {
  data: QuestionAnalytics[];
  loading?: boolean;
  title?: string;
}

// Custom tooltip component - declared outside of render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: QuestionAnalytics;
    value: number;
    name: string;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E4E8F0]">
        <p className="text-sm font-semibold text-[#101625]">{data.question}</p>
        <p className="text-xs text-[#5A6478] mt-1">
          Category: <span className="font-medium">{data.category}</span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Average Rating:{" "}
          <span className="font-medium text-[#3D6BFF]">
            {data.avg_rating.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-[#5A6478]">
          Total Responses:{" "}
          <span className="font-medium">{data.total_responses}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const AverageScorePerCriterion: React.FC<
  AverageScorePerCriterionProps
> = ({
  data,
  loading = false,
  title = "Average Score per Evaluation Criterion",
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
          <FiBarChart2 className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
          <p className="text-sm text-[#5A6478]">No data available</p>
        </div>
      </div>
    );
  }

  // Sort by average rating descending
  const sortedData = [...data].sort((a, b) => b.avg_rating - a.avg_rating);

  // Get color based on rating
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
            margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" />
            <XAxis
              dataKey="question"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11, fill: "#5A6478" }}
              interval={0}
            />
            <YAxis
              domain={[0, 5]}
              tickCount={6}
              tick={{ fontSize: 12, fill: "#5A6478" }}
              label={{
                value: "Average Rating",
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
              dataKey="avg_rating"
              name="Average Rating"
              radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.avg_rating)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
