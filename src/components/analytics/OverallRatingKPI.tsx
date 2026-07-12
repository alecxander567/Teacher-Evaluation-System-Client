// src/components/analytics/OverallRatingKPI.tsx
import React from "react";
import { FiStar } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import { useOverallRating } from "../../hooks/useTeacherAnalytics";

interface OverallRatingKPIProps {
  teacherId?: number;
  teacherName?: string;
}

export const OverallRatingKPI: React.FC<OverallRatingKPIProps> = ({
  teacherId = 12,
  teacherName = "Current Teacher",
}) => {
  const { data, loading, error } = useOverallRating(teacherId);

  if (loading) {
    return (
      <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6 h-40 flex items-center justify-center">
        <LoadingSpinner label="Loading KPI data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
        <div className="text-center text-red-500">
          <p className="text-sm">Error loading rating data</p>
          <p className="text-xs text-[#5A6478]">{error.message}</p>
        </div>
      </div>
    );
  }

  // Get the first item from the API response
  const ratingData = data?.[0];

  if (!ratingData) {
    return (
      <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
        <div className="text-center">
          <p className="text-sm text-[#5A6478]">No rating data available</p>
        </div>
      </div>
    );
  }

  const rating = ratingData.overall_rating || 0;
  const totalEvaluations = ratingData.total_evaluations || 0;
  const teacherNameDisplay = ratingData.teacher_name || teacherName;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Function to render stars with half-star support
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <FiStar
            key={i}
            className="h-4 w-4 text-yellow-400 fill-yellow-400"
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star - we'll use a full star with a gradient or just use a filled star for simplicity
        stars.push(
          <FiStar
            key={i}
            className="h-4 w-4 text-yellow-400 fill-yellow-400"
          />,
        );
      } else {
        // Empty star
        stars.push(<FiStar key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-[#EBF0FE]">
          <FiStar className="h-6 w-6 text-[#3D6BFF]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#5A6478]">Overall Rating</p>
            <p className="text-xs text-[#5A6478]">{teacherNameDisplay}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#101625]">
              {rating.toFixed(2)}
            </span>
            <span className="text-sm text-[#5A6478]">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars()}
            <span className="text-xs text-[#5A6478] ml-2">
              ({totalEvaluations}{" "}
              {totalEvaluations === 1 ? "evaluation" : "evaluations"})
            </span>
          </div>
          {/* Additional info */}
          <div className="mt-3 pt-3 border-t border-[#E4E8F0]">
            <div className="flex items-center justify-between text-xs text-[#5A6478]">
              <span>Teacher ID: {ratingData.teacher_id}</span>
              <span className="text-[#3D6BFF]">
                {rating >= 4.5 ?
                  "⭐ Excellent"
                : rating >= 4.0 ?
                  "👍 Good"
                : rating >= 3.0 ?
                  "📊 Average"
                : "📉 Needs Improvement"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
