// src/components/analytics/TeachersRequiringImprovementTable.tsx

import React from "react";
import type { TeacherRequiringImprovement } from "../../types/analytics";

interface Props {
  data: TeacherRequiringImprovement[];
  loading: boolean;
}

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  // Determine status based on avg_rating
  const getStatusConfig = (avgRating: number) => {
    if (avgRating <= 2.0) {
      return { color: "bg-red-100 text-red-800", label: "Critical" };
    } else if (avgRating <= 2.5) {
      return { color: "bg-orange-100 text-orange-800", label: "At Risk" };
    } else if (avgRating <= 3.0) {
      return {
        color: "bg-yellow-100 text-yellow-800",
        label: "Needs Improvement",
      };
    } else {
      return { color: "bg-green-100 text-green-800", label: "On Track" };
    }
  };

  const config = getStatusConfig(parseFloat(status));

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
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
      <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
        <h3
          className="text-lg font-semibold text-[#101826] mb-4"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Teachers Requiring Improvement
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-[#5B6472]">Loading table data...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
        <h3
          className="text-lg font-semibold text-[#101826] mb-4"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Teachers Requiring Improvement
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-[#5B6472]">
            No teachers requiring improvement.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
      <h3
        className="text-lg font-semibold text-[#101826] mb-4"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        Teachers Requiring Improvement
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E4E1D9]">
          <thead className="bg-[#FAFAF6]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Teacher Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Average Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E4E1D9]">
            {data.map((teacher) => (
              <tr
                key={teacher.teacher_id}
                className="hover:bg-[#FAFAF6] transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-[#101826]">
                  {teacher.teacher_name}
                </td>
                <td className="px-4 py-4 text-sm text-[#5B6472]">
                  {teacher.subject_name}
                </td>
                <td className="px-4 py-4 text-sm text-[#101826]">
                  {teacher.avg_rating.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={teacher.avg_rating.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
