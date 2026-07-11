// src/components/teachers/TeacherCard.tsx
import React from "react";
import { FiMail, FiUser, FiEdit2, FiTrash2, FiBriefcase } from "react-icons/fi";
import type { Teacher } from "../../types/teacher";

interface TeacherCardProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
  departmentName?: string;
}

const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACTUAL: "Contractual",
};

const employmentTypeBadgeClasses: Record<string, string> = {
  FULL_TIME: "bg-green-50 text-green-600",
  PART_TIME: "bg-amber-50 text-amber-600",
  CONTRACTUAL: "bg-blue-50 text-blue-600",
};

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onEdit,
  onDelete,
  departmentName,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#E4E8F0] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-[#EAF0FF] flex items-center justify-center flex-shrink-0">
            <FiUser className="h-5 w-5 text-[#3D6BFF]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#101625] truncate">
              {teacher.fullName}
            </h3>
            <p className="text-xs text-[#5A6478] truncate">
              {teacher.position || "No position"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(teacher)}
            className="p-1.5 rounded-lg hover:bg-[#EAF0FF] text-[#5A6478] hover:text-[#3D6BFF] transition-colors"
            title="Edit teacher">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(teacher.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-[#5A6478] hover:text-red-500 transition-colors"
            title="Delete teacher">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {teacher.employmentType && (
        <div className="mt-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              employmentTypeBadgeClasses[teacher.employmentType] ||
              "bg-gray-50 text-gray-600"
            }`}>
            {employmentTypeLabels[teacher.employmentType] ||
              teacher.employmentType}
          </span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#E4E8F0] space-y-1">
        <div className="flex items-center space-x-2 text-xs text-[#5A6478]">
          <FiMail className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{teacher.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#5A6478]">
          <FiBriefcase className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            {departmentName ||
              `Department ID: ${teacher.departmentId || "None"}`}
          </span>
        </div>
      </div>
    </div>
  );
};
