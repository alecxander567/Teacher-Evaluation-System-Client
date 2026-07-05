// src/components/forms/EvaluationFormModal.tsx
import React, { useState } from "react";
import { FiX, FiSave, FiAlertCircle } from "react-icons/fi";
import type {
  EvaluationForm,
  EvaluationFormRequest,
} from "../../types/evaluationForm";
import { useEvaluationPeriod } from "../../hooks/useEvaluationPeriod";

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluationFormRequest) => Promise<void>;
  initialData?: EvaluationForm;
  title: string;
}

const emptyFormData: EvaluationFormRequest = {
  evaluationPeriodId: 0,
  title: "",
  description: "",
};

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const {
    periods,
    loading: periodsLoading,
    fetchPeriods,
  } = useEvaluationPeriod();
  const [formData, setFormData] = useState<EvaluationFormRequest>(
    initialData ?
      {
        evaluationPeriodId: initialData.evaluationPeriodId,
        title: initialData.title,
        description: initialData.description || "",
      }
    : emptyFormData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Render-time adjustment: reset formData whenever initialData identity changes,
  // instead of syncing via useEffect.
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setFormData(
      initialData ?
        {
          evaluationPeriodId: initialData.evaluationPeriodId,
          title: initialData.title,
          description: initialData.description || "",
        }
      : emptyFormData,
    );
  }

  // Fetching periods is a genuine external-system side effect, so it stays in an effect.
  // Fixed: use fetchPeriods from the top-level hook call instead of calling the hook again.
  const [didFetchForOpen, setDidFetchForOpen] = useState(false);
  if (isOpen && !didFetchForOpen) {
    setDidFetchForOpen(true);
    fetchPeriods();
  } else if (!isOpen && didFetchForOpen) {
    setDidFetchForOpen(false);
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save form";
      setError(message);
      if (err instanceof Error) {
        // Preserve original error context for upstream logging/handling.
        throw new Error(message, { cause: err });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "evaluationPeriodId" ? parseInt(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl w-full max-w-2xl border border-[#E4E1D9] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E4E1D9]">
            <h2
              className="text-xl font-semibold text-[#101826]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FAFAF6] rounded-lg transition-colors">
              <FiX className="h-5 w-5 text-[#5B6472]" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Evaluation Period */}
              <div>
                <label className="block text-sm font-medium text-[#101826] mb-1.5">
                  Evaluation Period *
                </label>
                <select
                  name="evaluationPeriodId"
                  value={formData.evaluationPeriodId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826]"
                  disabled={periodsLoading}>
                  <option value={0}>Select evaluation period</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.title} - {period.academicYear} ({period.semester})
                      - {period.status}
                    </option>
                  ))}
                </select>
                {periodsLoading && (
                  <p className="text-sm text-[#5B6472] mt-1">
                    Loading periods...
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#101826] mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="Enter form title"
                  className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#101826] mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={5000}
                  placeholder="Enter form description (optional)"
                  className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] resize-none"
                />
                <p className="text-xs text-[#5B6472] mt-1">
                  {formData.description.length}/5000 characters
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E4E1D9]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#5B6472] hover:text-[#101826] transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || formData.evaluationPeriodId === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                {isSubmitting ?
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Saving...
                  </>
                : <>
                    <FiSave className="h-4 w-4" />
                    Save Form
                  </>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
