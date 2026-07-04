// src/components/evaluationPeriods/PeriodForm.tsx
import React, { useState } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import type {
  EvaluationPeriod,
  EvaluationPeriodRequest,
} from "../../types/evaluationPeriod.types";

interface PeriodFormProps {
  isOpen: boolean;
  period: EvaluationPeriod | null;
  onClose: () => void;
  onSubmit: (data: EvaluationPeriodRequest) => Promise<void>;
  loading: boolean;
}

const semesterOptions = ["First Semester", "Second Semester", "Summer"];

const emptyFormData: EvaluationPeriodRequest = {
  title: "",
  academicYear: "",
  semester: semesterOptions[0],
  startDate: "",
  endDate: "",
  status: "draft",
};

const toFormData = (period: EvaluationPeriod): EvaluationPeriodRequest => ({
  title: period.title,
  academicYear: period.academicYear,
  semester: period.semester,
  startDate: period.startDate.split("T")[0],
  endDate: period.endDate.split("T")[0],
  status: period.status,
});

export const PeriodForm: React.FC<PeriodFormProps> = ({
  isOpen,
  period,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<EvaluationPeriodRequest>(() =>
    period ? toFormData(period) : emptyFormData,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tracks which `period` the current formData was derived from, so we can
  // detect when the prop changes and re-derive formData *during render*
  // instead of syncing it via a useEffect (which causes an extra render).
  const [prevPeriod, setPrevPeriod] = useState<EvaluationPeriod | null>(period);

  if (period !== prevPeriod) {
    setPrevPeriod(period);
    setFormData(period ? toFormData(period) : emptyFormData);
    setErrors({});
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.title.length > 255) {
      newErrors.title = "Title must not exceed 255 characters";
    }
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = "Academic year is required";
    }
    if (formData.academicYear.length > 20) {
      newErrors.academicYear = "Academic year must not exceed 20 characters";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E4E1D9]">
            <h3
              className="text-lg font-semibold text-[#101826]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {period ?
                "Edit Evaluation Period"
              : "Create New Evaluation Period"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#FAFAF6] rounded-lg transition-colors">
              <FiX className="h-5 w-5 text-[#5B6472]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#101826] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Faculty Evaluation 2024-2025"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-[#E4E1D9]"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="h-3.5 w-3.5" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Academic Year and Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#101826] mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    placeholder="e.g., 2024-2025"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent ${
                      errors.academicYear ? "border-red-500" : (
                        "border-[#E4E1D9]"
                      )
                    }`}
                  />
                  {errors.academicYear && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="h-3.5 w-3.5" />
                      {errors.academicYear}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#101826] mb-1">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent bg-white">
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#101826] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent ${
                      errors.startDate ? "border-red-500" : "border-[#E4E1D9]"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="h-3.5 w-3.5" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#101826] mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent ${
                      errors.endDate ? "border-red-500" : "border-[#E4E1D9]"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="h-3.5 w-3.5" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#101826] mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent bg-white">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="mt-1 text-xs text-[#5B6472]">
                  {formData.status === "active" ?
                    "Only one active period is allowed per academic year and semester"
                  : "Set to active when ready to start evaluations"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E4E1D9]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#5B6472] hover:text-[#101826] transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ?
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {period ? "Updating..." : "Creating..."}
                  </>
                : <>{period ? "Update Period" : "Create Period"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
