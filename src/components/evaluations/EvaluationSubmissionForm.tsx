// src/components/evaluations/EvaluationSubmissionForm.tsx
import React, { useState } from "react";
import { FiSave, FiX, FiAlertCircle, FiStar } from "react-icons/fi";
import type { EvaluationForm } from "../../types/evaluationForm";
import type { EvaluationCategory } from "../../types/evaluationCategory.types";
import type { EvaluationSubmissionRequest } from "../../types/evaluationSubmission.types";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface EvaluationSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluationSubmissionRequest) => Promise<void>;
  form: EvaluationForm | null;
  categories: EvaluationCategory[];
  teacherAssignmentId: number;
  teacherName: string;
  evaluationLinkId?: number;
  studentEmail: string;
  loading?: boolean;
}

export const EvaluationSubmissionForm: React.FC<
  EvaluationSubmissionFormProps
> = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  categories = [],
  teacherAssignmentId,
  teacherName,
  evaluationLinkId,
  studentEmail,
  loading = false,
}) => {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [overallComment, setOverallComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Render-time adjustment: reset form state when the modal transitions
  // from closed -> open, instead of syncing via useEffect.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      const initialResponses: Record<number, number> = {};
      if (categories && Array.isArray(categories)) {
        categories.forEach((category) => {
          if (category.questions && Array.isArray(category.questions)) {
            category.questions.forEach((question) => {
              initialResponses[question.id] = 0;
            });
          }
        });
      }
      setResponses(initialResponses);
      setOverallComment("");
      setError(null);
    }
  }

  if (!isOpen) return null;

  // Safely calculate totals
  const totalQuestions =
    categories && Array.isArray(categories) ?
      categories.reduce((sum, cat) => sum + (cat.questions?.length || 0), 0)
    : 0;

  const answeredQuestions = Object.values(responses).filter(
    (r) => r > 0,
  ).length;

  const handleRatingChange = (questionId: number, rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if all required questions are answered
    let unansweredRequired = false;
    if (categories && Array.isArray(categories)) {
      unansweredRequired = categories.some((category) =>
        category.questions?.some(
          (question) =>
            question.isRequired && (responses[question.id] || 0) === 0,
        ),
      );
    }

    if (unansweredRequired) {
      setError("Please answer all required questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    const submissionData: EvaluationSubmissionRequest = {
      evaluationPeriodId: form?.evaluationPeriodId || 0,
      teacherAssignmentId,
      evaluationLinkId,
      studentEmail,
      overallComment: overallComment.trim() || undefined,
      responses: Object.entries(responses)
        .filter(([, rating]) => rating > 0)
        .map(([questionId, rating]) => ({
          questionId: parseInt(questionId),
          rating,
        })),
    };

    try {
      await onSubmit(submissionData);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit evaluation"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-[#FBFCFE] rounded-xl w-full max-w-4xl border border-[#E4E8F0] shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E4E8F0] sticky top-0 bg-[#FBFCFE] z-10">
            <div>
              <h2
                className="text-xl font-semibold text-[#101625]"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                {form?.title || "Evaluation Form"}
              </h2>
              <p className="text-sm font-medium text-[#3D6BFF] mt-0.5">
                Evaluating: {teacherName}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-[#5A6478]">
                  <span className="font-medium text-[#101625]">
                    {answeredQuestions}
                  </span>{" "}
                  of {totalQuestions} questions answered
                </p>
                <div className="h-4 w-px bg-[#E4E8F0]"></div>
                <p className="text-sm text-[#5A6478]">
                  <span className="font-medium text-[#101625]">
                    {totalQuestions > 0 ?
                      Math.round((answeredQuestions / totalQuestions) * 100)
                    : 0}
                    %
                  </span>{" "}
                  complete
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F4F6FA] rounded-lg transition-colors">
              <FiX className="h-5 w-5 text-[#5A6478]" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="w-full h-1.5 bg-[#F4F6FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3D6BFF] to-[#6E8CFF] rounded-full transition-all duration-300"
                style={{
                  width: `${totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-[#FBEEF0] border border-[#F0CBD1] rounded-lg flex items-start gap-3">
                <FiAlertCircle className="h-5 w-5 text-[#E53935] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#9A3A50]">{error}</p>
              </div>
            )}

            {!categories || categories.length === 0 ?
              <div className="text-center py-12">
                <p className="text-[#5A6478]">
                  No questions available for this evaluation.
                </p>
              </div>
            : /* Questions by Category */
              <div className="space-y-8">
                {categories.map((category) => {
                  if (!category.questions || category.questions.length === 0)
                    return null;

                  return (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-[#101625] mb-4">
                        {category.name}
                        {category.description && (
                          <p className="text-sm font-normal text-[#5A6478] mt-1">
                            {category.description}
                          </p>
                        )}
                      </h3>

                      <div className="space-y-3">
                        {category.questions.map((question) => (
                          <div
                            key={question.id}
                            className={`bg-[#FBFCFE] rounded-lg p-4 border transition-all ${
                              responses[question.id] > 0 ?
                                "border-[#3D6BFF] shadow-sm"
                              : "border-[#E4E8F0] hover:border-[#3D6BFF]/30"
                            }`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm text-[#101625]">
                                  {question.question}
                                  {question.isRequired && (
                                    <span className="text-[#E53935] ml-1">
                                      *
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() =>
                                      handleRatingChange(question.id, rating)
                                    }
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                      responses[question.id] === rating ?
                                        "bg-[#3D6BFF] text-white shadow-sm"
                                      : "bg-white border border-[#E4E8F0] text-[#5A6478] hover:border-[#3D6BFF] hover:text-[#3D6BFF]"
                                    }`}>
                                    <div className="flex flex-col items-center">
                                      <span>{rating}</span>
                                      {responses[question.id] === rating && (
                                        <FiStar className="h-2 w-2" />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Overall Comment */}
                <div>
                  <label className="block text-sm font-medium text-[#101625] mb-2">
                    Overall Comment{" "}
                    <span className="text-[#5A6478] font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    rows={4}
                    placeholder="Share any additional feedback or comments..."
                    className="w-full px-4 py-3 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] placeholder-[#8E97AE] resize-none"
                  />
                </div>
              </div>
            }

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#E4E8F0]">
              <p className="text-sm text-[#5A6478] order-2 sm:order-1">
                <span className="font-medium text-[#101625]">
                  {answeredQuestions}
                </span>{" "}
                of {totalQuestions} questions answered
                {answeredQuestions < totalQuestions && (
                  <span className="text-[#E53935] ml-1">
                    ({totalQuestions - answeredQuestions} remaining)
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-[#5A6478] hover:text-[#101625] transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    loading ||
                    !categories ||
                    categories.length === 0
                  }
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                  {isSubmitting || loading ?
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Submitting...
                    </>
                  : <>
                      <FiSave className="h-4 w-4" />
                      Submit Evaluation
                    </>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
