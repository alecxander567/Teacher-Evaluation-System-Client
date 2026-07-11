// src/components/assignments/AssignmentCard.tsx
import React from "react";
import { FiUser, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";

interface AssignmentCardProps {
  assignment: {
    id: number;
    teacherName?: string;
    subjectCode?: string;
    subjectName?: string;
    academicYear: string;
    semester: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#E4E8F0] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-[#101625]">
              {assignment.subjectName || `Subject #${assignment.subjectCode}`}
            </h3>
            <span className="px-2 py-0.5 bg-[#EAF0FF] text-[#3D6BFF] text-xs font-medium rounded-full">
              {assignment.subjectCode}
            </span>
          </div>

          <div className="space-y-1 text-sm text-[#5A6478]">
            <div className="flex items-center gap-2">
              <FiUser className="h-4 w-4 text-[#3D6BFF]" />
              <span>{assignment.teacherName || "Unknown Teacher"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-[#3D6BFF]" />
              <span>
                {assignment.academicYear} - {assignment.semester}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(assignment.id)}
            className="p-1.5 rounded-lg hover:bg-[#EAF0FF] text-[#5A6478] hover:text-[#3D6BFF] transition-colors"
            title="Edit assignment">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-[#5A6478] hover:text-red-500 transition-colors"
            title="Delete assignment">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
