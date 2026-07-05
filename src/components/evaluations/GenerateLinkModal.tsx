// src/components/evaluations/GenerateLinkModal.tsx
import React, { useState } from "react";
import { FiX, FiLink, FiAlertCircle } from "react-icons/fi";
import type { EvaluationLinkRequest } from "../../types/evaluationLink.types";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface GenerateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluationLinkRequest) => Promise<void>;
  evaluationFormId: number;
  loading?: boolean;
}

export const GenerateLinkModal: React.FC<GenerateLinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  evaluationFormId,
  loading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Render-time adjustment: clear any stale error when the modal
  // transitions from closed -> open, instead of syncing via useEffect.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setError(null);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const data: EvaluationLinkRequest = {
      evaluationFormId,
    };

    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to generate link"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl w-full max-w-md border border-[#E4E1D9] shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-[#E4E1D9]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FBEEDC] rounded-lg">
                <FiLink className="h-5 w-5 text-[#B8791F]" />
              </div>
              <h2
                className="text-xl font-semibold text-[#101826]"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                Generate Evaluation Link
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FAFAF6] rounded-lg transition-colors">
              <FiX className="h-5 w-5 text-[#5B6472]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-[#FAFAF6] rounded-lg p-4 border border-[#E4E1D9]">
              <p className="text-sm text-[#5B6472]">
                <span className="font-medium text-[#101826]">Note:</span> This
                link will be active for the duration of the evaluation period.
                Students can use it to evaluate teachers assigned to this
                period.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Link Info:</span> The link will be
                valid until the evaluation period ends. No expiration date
                needed.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E1D9]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#5B6472] hover:text-[#101826] transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                {isSubmitting || loading ?
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Generating...
                  </>
                : <>
                    <FiLink className="h-4 w-4" />
                    Generate Link
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
