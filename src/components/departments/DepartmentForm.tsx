// src/components/departments/DepartmentForm.tsx

import React, { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import type { DepartmentRequest } from "../../types/department.types";

interface DepartmentFormProps {
  initialData?: DepartmentRequest;
  onSubmit: (data: DepartmentRequest) => void;
  onCancel: () => void;
  loading: boolean;
  error?: string | null;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<DepartmentRequest>(
    () =>
      initialData || {
        name: "",
        description: "",
      },
  );

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  // "Adjust state during render" pattern (replaces the useEffect + useRef).
  // We track the initialData we last synced from, and if it changes,
  // we update state *during* render instead of in a post-render effect.
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setFormData(
      initialData || {
        name: "",
        description: "",
      },
    );
    setValidationErrors({});
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: { name?: string; description?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Department name is required";
    } else if (formData.name.length > 100) {
      errors.name = "Department name must not exceed 100 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = "Description must not exceed 1000 characters";
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E4E8F0]">
          <h2
            className="text-xl font-semibold text-[#101625]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {initialData ? "Edit Department" : "New Department"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-[#F4F6FA] rounded-lg transition-colors">
            <FiX className="h-5 w-5 text-[#5A6478]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#101625] mb-1">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                validationErrors.name ? "border-red-300" : "border-[#E4E8F0]"
              } rounded-lg focus:outline-none focus:border-[#3D6BFF] focus:ring-2 focus:ring-[#3D6BFF]/20 transition-colors`}
              placeholder="e.g., Computer Science"
              disabled={loading}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#101625] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border ${
                validationErrors.description ? "border-red-300" : (
                  "border-[#E4E8F0]"
                )
              } rounded-lg focus:outline-none focus:border-[#3D6BFF] focus:ring-2 focus:ring-[#3D6BFF]/20 transition-colors resize-none`}
              placeholder="Brief description of the department..."
              disabled={loading}
            />
            {validationErrors.description && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-[#E4E8F0] text-[#5A6478] rounded-lg hover:bg-[#F4F6FA] transition-colors"
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}>
              {loading ?
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              : <>
                  <FiSave className="h-4 w-4 mr-2" />
                  {initialData ? "Update" : "Create"}
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
