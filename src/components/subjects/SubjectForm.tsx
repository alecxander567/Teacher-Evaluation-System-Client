// src/components/subjects/SubjectForm.tsx
import React, { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import type { Subject, SubjectRequest } from "../../types/subject.types";
import type { Department } from "../../types/department.types";
import { departmentApi } from "../../api/departmentApi";

interface SubjectFormProps {
  isOpen: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSubmit: (data: SubjectRequest) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const buildFormData = (subject: Subject | null): SubjectRequest => ({
  departmentId: subject?.departmentId || null,
  subjectCode: subject?.subjectCode || "",
  subjectName: subject?.subjectName || "",
  description: subject?.description || "",
});

export const SubjectForm: React.FC<SubjectFormProps> = ({
  isOpen,
  subject,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Initialize formData with subject data if provided
  const [formData, setFormData] = useState<SubjectRequest>(() =>
    buildFormData(subject),
  );

  const [validationErrors, setValidationErrors] = useState<{
    subjectCode?: string;
    subjectName?: string;
  }>({});

  // Track the subject we last rendered form data for, so we can detect
  // changes during render instead of reacting to them in an Effect.
  const [prevSubject, setPrevSubject] = useState(subject);

  // "Adjusting state when a prop changes" pattern (see React docs:
  // https://react.dev/learn/you-might-not-need-an-effect). Calling setState
  // here happens during render, so React re-renders immediately with the
  // updated state before committing to the screen - no extra effect pass,
  // no cascading renders, and no need for an isFirstRender ref.
  if (subject !== prevSubject) {
    setPrevSubject(subject);
    setFormData(buildFormData(subject));
    setValidationErrors({});
  }

  // Load departments when form opens
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    // Clear validation error when user types
    if (validationErrors[id as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: { subjectCode?: string; subjectName?: string } = {};

    if (!formData.subjectCode.trim()) {
      errors.subjectCode = "Subject code is required";
    } else if (formData.subjectCode.length > 50) {
      errors.subjectCode = "Subject code must not exceed 50 characters";
    }

    if (!formData.subjectName.trim()) {
      errors.subjectName = "Subject name is required";
    } else if (formData.subjectName.length > 255) {
      errors.subjectName = "Subject name must not exceed 255 characters";
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
            {subject ? "Edit Subject" : "Add Subject"}
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
              htmlFor="subjectCode"
              className="block text-sm font-medium text-[#101625] mb-1">
              Subject Code *
            </label>
            <input
              id="subjectCode"
              type="text"
              value={formData.subjectCode}
              onChange={handleChange}
              placeholder="e.g., CS101"
              className={`w-full px-3 py-2 border ${
                validationErrors.subjectCode ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] uppercase`}
              disabled={loading}
            />
            {validationErrors.subjectCode && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.subjectCode}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subjectName"
              className="block text-sm font-medium text-[#101625] mb-1">
              Subject Name *
            </label>
            <input
              id="subjectName"
              type="text"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder="e.g., Introduction to Computer Science"
              className={`w-full px-3 py-2 border ${
                validationErrors.subjectName ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]`}
              disabled={loading}
            />
            {validationErrors.subjectName && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.subjectName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#101625] mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the subject..."
              className="w-full px-3 py-2 border border-[#E4E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-[#101625] mb-1">
              Department
            </label>
            <select
              id="departmentId"
              value={formData.departmentId ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E4E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] bg-white"
              disabled={loadingDepartments || loading}>
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
            <p className="text-xs text-[#5A6478] mt-1">
              Select a department for this subject
            </p>
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
                  {subject ? "Update" : "Create"}
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
