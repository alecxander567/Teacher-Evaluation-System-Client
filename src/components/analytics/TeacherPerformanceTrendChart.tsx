// src/components/analytics/TeacherPerformanceTrendChart.tsx

import React, { useEffect, useState } from "react";
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
import type { TeacherPerformanceTrend } from "../../types/analytics";
import { analyticsService } from "../../services/analyticsService";

interface Props {
  teacherId: number;
}

export const TeacherPerformanceTrendChart: React.FC<Props> = ({
  teacherId,
}) => {
  const [data, setData] = useState<TeacherPerformanceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) return;

    let isCancelled = false;

    const fetchTrend = async () => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await analyticsService.getTeacherPerformanceTrend(teacherId);
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load trend data",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrend();

    return () => {
      isCancelled = true;
    };
  }, [teacherId]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#5B6472]">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#E74C3C]">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
        <div className="text-[#5B6472]">
          No performance trend data available for this teacher.
        </div>
      </div>
    );
  }

  // x-axis label combining period + academic year (semester shown via tooltip)
  const chartData = data.map((d) => ({
    ...d,
    label: `${d.period} (${d.academic_year})`,
  }));

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
      <h3
        className="text-lg font-semibold text-[#101826] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        Teacher Performance Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D9" />
            <XAxis dataKey="label" stroke="#5B6472" />
            <YAxis domain={[0, 5]} stroke="#5B6472" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101826",
                border: "none",
                borderRadius: "8px",
                color: "#FAFAF6",
              }}
              formatter={(value) => {
                if (typeof value !== "number") return ["", "Avg Rating"];
                return [value.toFixed(2), "Avg Rating"];
              }}
              labelFormatter={(label, payload) => {
                const semester = payload?.[0]?.payload?.semester;
                return semester ? `${label} — ${semester}` : label;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_rating"
              name="Average Rating"
              stroke="#E8A23D"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
