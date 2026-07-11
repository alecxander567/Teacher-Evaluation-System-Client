// src/components/teachers/TeacherList.tsx
import React from "react";
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { TeacherCard } from "./TeacherCard";
import { LoadingSpinner } from "../LoadingSpinner";
import type { Teacher } from "../../types/teacher";

interface TeacherListProps {
  teachers: Teacher[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  departmentNames?: Map<number, string>; // Added optional prop
}

export const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  searchTerm,
  departmentNames = new Map(), // Default to empty Map
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#101625] flex items-center gap-2">
            <FiUsers className="text-[#3D6BFF]" />
            Teachers
          </h1>
          <p className="text-sm text-[#5A6478] mt-1">
            Manage your teachers and their department assignments
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center justify-center px-4 py-2 bg-[#3D6BFF] text-white text-sm font-medium rounded-lg hover:bg-[#2A5AF0] transition-colors">
          <FiPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6478]" />
          <input
            type="text"
            placeholder="Search teachers by name..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E4E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
          />
        </div>
      </div>

      {/* Content */}
      {loading ?
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner label="Loading teachers..." />
        </div>
      : teachers.length === 0 ?
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EAF0FF] mb-4">
            <FiUsers className="h-8 w-8 text-[#3D6BFF]" />
          </div>
          <h3 className="text-lg font-medium text-[#101625] mb-1">
            No teachers found
          </h3>
          <p className="text-sm text-[#5A6478]">
            {searchTerm ?
              "Try adjusting your search"
            : "Start by adding a new teacher"}
          </p>
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onEdit={onEdit}
              onDelete={onDelete}
              departmentName={
                teacher.departmentId ?
                  departmentNames.get(teacher.departmentId)
                : undefined
              }
            />
          ))}
        </div>
      }
    </div>
  );
};
