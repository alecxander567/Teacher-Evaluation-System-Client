// src/components/assignments/AssignmentForm.tsx
import React, { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import type {
  Assignment,
  AssignmentRequest,
} from "../../types/assignment.types";
import type { Teacher } from "../../types/teacher";
import type { Subject } from "../../types/subject.types";
import { teacherApi } from "../../api/teacherApi";
import { subjectApi } from "../../api/subjectApi";

interface AssignmentFormProps {
  isOpen: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSubmit: (data: AssignmentRequest) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const emptyFormData: AssignmentRequest = {
  teacherId: 0,
  subjectId: 0,
  academicYear: "",
  semester: "",
};

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  isOpen,
  assignment,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState<AssignmentRequest>(
    assignment ?
      {
        teacherId: assignment.teacherId,
        subjectId: assignment.subjectId,
        academicYear: assignment.academicYear,
        semester: assignment.semester,
      }
    : emptyFormData,
  );

  const [validationErrors, setValidationErrors] = useState<{
    teacherId?: string;
    subjectId?: string;
    academicYear?: string;
    semester?: string;
  }>({});

  // Track the assignment we last synced formData from, so we can adjust
  // state during render when the prop changes instead of using an effect.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevAssignment, setPrevAssignment] = useState(assignment);

  if (assignment !== prevAssignment) {
    setPrevAssignment(assignment);
    setFormData(
      assignment ?
        {
          teacherId: assignment.teacherId,
          subjectId: assignment.subjectId,
          academicYear: assignment.academicYear,
          semester: assignment.semester,
        }
      : emptyFormData,
    );
    setValidationErrors({});
  }

  // Load teachers and subjects when form opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [teachersData, subjectsData] = await Promise.all([
            teacherApi.getAll(),
            subjectApi.getAll(),
          ]);
          setTeachers(teachersData);
          setSubjects(subjectsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "teacherId" || id === "subjectId" ? parseInt(value) : value,
    }));
    // Clear validation error when user types
    if (validationErrors[id as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: {
      teacherId?: string;
      subjectId?: string;
      academicYear?: string;
      semester?: string;
    } = {};

    if (!formData.teacherId || formData.teacherId === 0) {
      errors.teacherId = "Please select a teacher";
    }

    if (!formData.subjectId || formData.subjectId === 0) {
      errors.subjectId = "Please select a subject";
    }

    if (!formData.academicYear.trim()) {
      errors.academicYear = "Academic year is required";
    }

    if (!formData.semester.trim()) {
      errors.semester = "Semester is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
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
          <h2 className="text-lg font-semibold text-[#101625]">
            {assignment ? "Edit Assignment" : "New Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F4F6FA] text-[#5A6478] hover:text-[#101625] transition-colors">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="teacherId"
              className="block text-sm font-medium text-[#101625] mb-1">
              Teacher *
            </label>
            <select
              id="teacherId"
              value={formData.teacherId || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                validationErrors.teacherId ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] bg-white`}
              disabled={loadingData || loading}>
              <option value="">Select a teacher...</option>
              {loadingData ?
                <option disabled>Loading teachers...</option>
              : teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName} ({teacher.email})
                  </option>
                ))
              }
            </select>
            {validationErrors.teacherId && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.teacherId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subjectId"
              className="block text-sm font-medium text-[#101625] mb-1">
              Subject *
            </label>
            <select
              id="subjectId"
              value={formData.subjectId || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                validationErrors.subjectId ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] bg-white`}
              disabled={loadingData || loading}>
              <option value="">Select a subject...</option>
              {loadingData ?
                <option disabled>Loading subjects...</option>
              : subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectCode} - {subject.subjectName}
                  </option>
                ))
              }
            </select>
            {validationErrors.subjectId && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.subjectId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="academicYear"
              className="block text-sm font-medium text-[#101625] mb-1">
              Academic Year *
            </label>
            <input
              id="academicYear"
              type="text"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g., 2024-2025"
              className={`w-full px-3 py-2 border ${
                validationErrors.academicYear ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]`}
              disabled={loading}
            />
            {validationErrors.academicYear && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.academicYear}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-[#101625] mb-1">
              Semester *
            </label>
            <select
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                validationErrors.semester ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] bg-white`}
              disabled={loading}>
              <option value="">Select semester...</option>
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
              <option value="Summer">Summer</option>
            </select>
            {validationErrors.semester && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.semester}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E4E8F0] text-[#5A6478] rounded-lg hover:bg-[#F4F6FA] transition-colors"
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
              {loading ?
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              : <>
                  <FiSave className="h-4 w-4 mr-2" />
                  {assignment ? "Update" : "Create"}
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
