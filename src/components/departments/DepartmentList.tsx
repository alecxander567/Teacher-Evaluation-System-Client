// src/components/departments/DepartmentList.tsx

import React, { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import type { Department } from "../../types/department.types";
import DepartmentCard from "./DepartmentCard";
import { LoadingSpinner } from "../LoadingSpinner";

interface DepartmentListProps {
  departments: Department[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onSearch: (term: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#101625]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Departments
          </h1>
          <p className="text-[#5A6478] text-sm mt-1">
            Manage your academic departments
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] transition-colors">
          <FiPlus className="h-4 w-4 mr-2" />
          New Department
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6478]" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E4E8F0] rounded-lg focus:outline-none focus:border-[#3D6BFF] focus:ring-2 focus:ring-[#3D6BFF]/20 transition-colors"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner label="Loading departments..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && departments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E4E8F0]">
          <div className="inline-block p-4 bg-[#EAF0FF] rounded-full mb-4">
            <FiSearch className="h-8 w-8 text-[#3D6BFF]" />
          </div>
          <h3 className="text-lg font-medium text-[#101625] mb-2">
            No departments found
          </h3>
          <p className="text-[#5A6478] text-sm">
            {searchTerm ?
              "Try adjusting your search"
            : "Create your first department"}
          </p>
          {!searchTerm && (
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center px-4 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] transition-colors">
              <FiPlus className="h-4 w-4 mr-2" />
              Add Department
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
