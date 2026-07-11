// src/components/departments/DepartmentDetail.tsx

import React, { useState } from "react";
import {
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import type { DepartmentDetail as DepartmentDetailType } from "../../types/department.types";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";

interface DepartmentDetailProps {
  department: DepartmentDetailType;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({
  department,
  onBack,
  onEdit,
  onDelete,
  deleting = false,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#5A6478] hover:text-[#101625] mb-6 transition-colors">
        <FiArrowLeft className="h-4 w-4" />
        Back to Departments
      </button>

      {/* Department Info */}
      <div className="bg-white rounded-xl border border-[#E4E8F0] p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-semibold text-[#101625]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {department.name}
            </h1>
            {department.description && (
              <p className="text-[#5A6478] mt-2">{department.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-[#5A6478]">
              <div className="flex items-center gap-1">
                <FiUsers className="h-4 w-4 text-[#3D6BFF]" />
                <span>{department.teacherCount} teachers</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar className="h-4 w-4 text-[#3D6BFF]" />
                <span>
                  Created {new Date(department.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-2 border border-[#E4E8F0] text-[#5A6478] hover:text-[#101625] hover:bg-[#F4F6FA] rounded-lg transition-colors">
              <FiEdit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <FiTrash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      {department.teachers.length > 0 ?
        <div className="bg-white rounded-xl border border-[#E4E8F0] p-6">
          <h2
            className="text-lg font-semibold text-[#101625] mb-4"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Teachers ({department.teacherCount})
          </h2>
          <div className="divide-y divide-[#E4E8F0]">
            {department.teachers.map((teacher) => (
              <div key={teacher.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101625]">
                      {teacher.fullName}
                    </p>
                    <p className="text-sm text-[#5A6478]">{teacher.email}</p>
                  </div>
                  {teacher.position && (
                    <span className="text-sm px-3 py-1 bg-[#EAF0FF] text-[#3D6BFF] rounded-full">
                      {teacher.position}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      : <div className="text-center py-12 bg-white rounded-xl border border-[#E4E8F0]">
          <div className="inline-block p-4 bg-[#F4F6FA] rounded-full mb-4">
            <FiUsers className="h-8 w-8 text-[#5A6478]" />
          </div>
          <h3 className="text-lg font-medium text-[#101625] mb-2">
            No teachers assigned
          </h3>
          <p className="text-[#5A6478] text-sm">
            This department has no teachers yet
          </p>
        </div>
      }

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        itemName={department.name}
        confirmText="Delete Department"
        loading={deleting}
        message={`Are you sure you want to delete "${department.name}"? This will not delete the teachers, but they will be unassigned from this department.`}
      />
    </div>
  );
};

export default DepartmentDetail;
