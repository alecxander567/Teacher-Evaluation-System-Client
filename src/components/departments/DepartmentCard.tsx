// src/components/departments/DepartmentCard.tsx
import React from "react";
import { FiUsers, FiEdit, FiTrash2, FiArrowRight } from "react-icons/fi";
import type { Department } from "../../types/department.types";

interface DepartmentCardProps {
  department: Department;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  onDelete,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-xl border border-[#E4E1D9] p-6 hover:border-[#E8A23D]/50 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => onClick(department.id)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold text-[#101826] truncate"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {department.name}
          </h3>
          {department.description && (
            <p className="text-sm text-[#5B6472] mt-1 line-clamp-2">
              {department.description}
            </p>
          )}
        </div>
        <FiArrowRight className="h-5 w-5 text-[#B8791F] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E4E1D9]">
        <div className="flex items-center gap-2 text-sm text-[#5B6472]">
          <FiUsers className="h-4 w-4 text-[#B8791F]" />
          <span>
            {department.teacherCount} teacher
            {department.teacherCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(department.id);
            }}
            className="p-2 text-[#5B6472] hover:text-[#101826] hover:bg-[#FAFAF6] rounded-lg transition-colors">
            <FiEdit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(department.id);
            }}
            className="p-2 text-[#5B6472] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
