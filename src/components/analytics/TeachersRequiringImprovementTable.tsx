// src/components/analytics/TeachersRequiringImprovementTable.tsx
import React from "react";
import type { TeacherRequiringImprovement } from "../../types/analytics";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

interface Props {
  data: TeacherRequiringImprovement[];
  loading: boolean;
}

const StatusBadge: React.FC<{
  avgRating: number;
}> = ({ avgRating }) => {
  const getStatusConfig = () => {
    if (avgRating <= 2.0) {
      return {
        color: "bg-[#FBEEF0] text-[#E53935] border-[#F0CBD1]",
        label: "Critical",
        icon: <FiXCircle className="h-3 w-3 mr-1" />,
      };
    } else if (avgRating <= 2.5) {
      return {
        color: "bg-[#FFF3E0] text-[#FF9800] border-[#FFE0B2]",
        label: "At Risk",
        icon: <FiAlertTriangle className="h-3 w-3 mr-1" />,
      };
    } else if (avgRating <= 3.0) {
      return {
        color: "bg-[#FFFDE7] text-[#F59E0B] border-[#FDE68A]",
        label: "Needs Improvement",
        icon: <FiClock className="h-3 w-3 mr-1" />,
      };
    } else {
      return {
        color: "bg-[#E8F5E9] text-[#4CAF50] border-[#A5D6A7]",
        label: "On Track",
        icon: <FiCheckCircle className="h-3 w-3 mr-1" />,
      };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export const TeachersRequiringImprovementTable: React.FC<Props> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
        <h3
          className="text-lg font-semibold text-[#101625] mb-4"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Teachers Requiring Improvement
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-[#5A6478]">Loading table data...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
        <h3
          className="text-lg font-semibold text-[#101625] mb-4"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Teachers Requiring Improvement
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-[#5A6478] flex flex-col items-center gap-2">
            <FiCheckCircle className="h-8 w-8 text-[#4CAF50]" />
            <p className="text-sm">All teachers are performing well!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-[#101625]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Teachers Requiring Improvement
        </h3>
        <span className="text-sm text-[#5A6478]">
          {data.length} teacher{data.length > 1 ? "s" : ""} need attention
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E4E8F0]">
          <thead className="bg-[#F4F6FA]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5A6478] uppercase tracking-wider">
                Teacher Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5A6478] uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5A6478] uppercase tracking-wider">
                Average Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5A6478] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E4E8F0]">
            {data.map((teacher) => (
              <tr
                key={teacher.teacher_id}
                className="hover:bg-[#F4F6FA] transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-[#101625]">
                  {teacher.teacher_name}
                </td>
                <td className="px-4 py-4 text-sm text-[#5A6478]">
                  {teacher.subject_name}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-[#101625]">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FE] text-[#3D6BFF]">
                    {teacher.avg_rating.toFixed(2)} / 5.0
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge avgRating={teacher.avg_rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
