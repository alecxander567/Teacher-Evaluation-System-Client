// src/components/teachers/TeacherForm.tsx
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import type { Teacher, TeacherRequest } from "../../types/teacher";

interface TeacherFormProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSubmit: (data: TeacherRequest) => Promise<void>;
  loading: boolean;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  teacher,
  onClose,
  onSubmit,
  loading,
}) => {
  const initialData: TeacherRequest =
    teacher ?
      {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        position: teacher.position,
        departmentId: teacher.departmentId,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        departmentId: null,
      };

  const [formData, setFormData] = useState<TeacherRequest>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#101826]">
            {teacher ? "Edit Teacher" : "Add Teacher"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#FAFAF6] text-[#5B6472] hover:text-[#101826] transition-colors">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[#101826] mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#101826] mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#101826] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-[#101826] mb-1">
              Position
            </label>
            <input
              id="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E4E1D9] text-[#5B6472] rounded-lg hover:bg-[#FAFAF6] transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ?
                "Saving..."
              : teacher ?
                "Update"
              : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
