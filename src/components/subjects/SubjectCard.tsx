// src/components/subjects/SubjectCard.tsx
import React from "react";
import { FiBook, FiEdit2, FiTrash2, FiBriefcase } from "react-icons/fi";
import type { Subject } from "../../types/subject.types";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
  onDelete,
  onClick,
}) => {
  return (
    <div
      className="bg-[#FBFCFE] rounded-lg border border-[#E4E8F0] p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(subject.id)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-[#EBF0FE] flex items-center justify-center flex-shrink-0">
            <FiBook className="h-5 w-5 text-[#3D6BFF]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#101625] truncate">
              {subject.subjectName}
            </h3>
            <p className="text-xs text-[#5A6478] truncate">
              {subject.subjectCode}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject);
            }}
            className="p-1.5 rounded-lg hover:bg-[#EBF0FE] text-[#5A6478] hover:text-[#3D6BFF] transition-colors"
            title="Edit subject">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subject.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-[#5A6478] hover:text-red-500 transition-colors"
            title="Delete subject">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#E4E8F0] space-y-1">
        {subject.description && (
          <p className="text-xs text-[#5A6478] line-clamp-2">
            {subject.description}
          </p>
        )}
        <div className="flex items-center space-x-2 text-xs text-[#5A6478]">
          <FiBriefcase className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{subject.departmentName || "No Department"}</span>
        </div>
      </div>
    </div>
  );
};
