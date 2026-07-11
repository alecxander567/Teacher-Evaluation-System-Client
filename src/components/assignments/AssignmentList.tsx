// src/components/assignments/AssignmentList.tsx
import React from "react";
import { FiPlus, FiUsers, FiBookOpen, FiSearch } from "react-icons/fi";
import { AssignmentCard } from "./AssignmentCard";
import { LoadingSpinner } from "../LoadingSpinner";
import type { Assignment } from "../../types/assignment.types";

interface AssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  searchTerm,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#101625] flex items-center gap-2">
            <FiUsers className="text-[#3D6BFF]" />
            Teacher-Subject Assignments
          </h1>
          <p className="text-sm text-[#5A6478] mt-1">
            Manage teacher to subject assignments
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center justify-center px-4 py-2 bg-[#3D6BFF] text-white text-sm font-medium rounded-lg hover:bg-[#2A5AF0] transition-colors">
          <FiPlus className="h-4 w-4 mr-2" />
          New Assignment
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6478]" />
          <input
            type="text"
            placeholder="Search by teacher name or subject name..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E4E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
          />
        </div>
      </div>

      {/* Content */}
      {loading ?
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner label="Loading assignments..." />
        </div>
      : !assignments || assignments.length === 0 ?
        <div className="text-center py-12 bg-white rounded-xl border border-[#E4E8F0]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EAF0FF] mb-4">
            <FiBookOpen className="h-8 w-8 text-[#3D6BFF]" />
          </div>
          <h3 className="text-lg font-medium text-[#101625] mb-1">
            {searchTerm ?
              "No matching assignments found"
            : "No assignments found"}
          </h3>
          <p className="text-sm text-[#5A6478]">
            {searchTerm ?
              "Try adjusting your search"
            : "Start by assigning a teacher to a subject"}
          </p>
          {!searchTerm && (
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center px-4 py-2 bg-[#3D6BFF] text-white text-sm font-medium rounded-lg hover:bg-[#2A5AF0] transition-colors">
              <FiPlus className="h-4 w-4 mr-2" />
              Create First Assignment
            </button>
          )}
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      }
    </div>
  );
};
