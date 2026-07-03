// src/components/teachers/TeacherForm.tsx
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { Teacher } from "../../types/teacher";
import type { TeacherRequest } from "../../types/department.types";
import type { Department } from "../../types/department.types";
import { departmentApi } from "../../api/departmentApi";

interface TeacherFormProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSubmit: (data: TeacherRequest) => Promise<void>;
  loading: boolean;
}

const emptyFormData: TeacherRequest = {
  firstName: "",
  lastName: "",
  email: "",
  position: "",
  departmentId: null,
};

const teacherToFormData = (teacher: Teacher): TeacherRequest => ({
  firstName: teacher.firstName || "",
  lastName: teacher.lastName || "",
  email: teacher.email || "",
  position: teacher.position || "",
  departmentId: teacher.departmentId || null,
});

export const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  teacher,
  onClose,
  onSubmit,
  loading,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState<TeacherRequest>(() =>
    teacher ? teacherToFormData(teacher) : emptyFormData,
  );

  // "Adjust state during render" pattern: replaces the old useEffect + useRef
  // that reset formData whenever `teacher` changed. Runs synchronously in the
  // same render/commit instead of in a separate post-render effect pass.
  const [prevTeacher, setPrevTeacher] = useState(teacher);
  if (teacher !== prevTeacher) {
    setPrevTeacher(teacher);
    setFormData(teacher ? teacherToFormData(teacher) : emptyFormData);
  }

  // Load departments when form opens — this one IS a legitimate effect,
  // since it's synchronizing with an external system (the API).
  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        setLoadingDepartments(true);
        try {
          const data = await departmentApi.getAll();
          setDepartments(data);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
        } finally {
          setLoadingDepartments(false);
        }
      };
      fetchDepartments();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "departmentId" ?
          value ? parseInt(value)
          : null
        : value,
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
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
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
              First Name *
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
              Last Name *
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
              Email *
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
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-[#101826] mb-1">
              Department
            </label>
            <select
              id="departmentId"
              value={formData.departmentId ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent bg-white">
              <option value="">No Department</option>
              {loadingDepartments ?
                <option disabled>Loading departments...</option>
              : departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              }
            </select>
            <p className="text-xs text-[#5B6472] mt-1">
              Select a department for this teacher
            </p>
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
