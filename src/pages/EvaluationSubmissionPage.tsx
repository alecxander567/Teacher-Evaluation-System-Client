import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { evaluationLinkApi } from "../api/evaluationLinkApi";
import { teacherAssignmentApi } from "../api/teacherAssignmentApi";
import { evaluationSubmissionApi } from "../api/evaluationSubmissionApi";
import { useEvaluationForms } from "../hooks/useEvaluationForms";
import { useEvaluationPeriod } from "../hooks/useEvaluationPeriod";
import { EvaluationSubmissionForm } from "../components/evaluations/EvaluationSubmissionForm";
import type { TeacherAssignment } from "../types/teacherAssignment.types";
import type { EvaluationSubmissionRequest } from "../types/evaluationSubmission.types";
import type { EvaluationFormDetail } from "../types/evaluationCategory.types";
import { getErrorMessage } from "../utils/getErrorMessage";

type PageState = "loading" | "invalid" | "ready" | "success";

export const EvaluationSubmissionPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { getFormDetails } = useEvaluationForms();
  const { fetchPeriodById } = useEvaluationPeriod();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [formDetail, setFormDetail] = useState<EvaluationFormDetail | null>(
    null,
  );
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(0);
  const [studentEmail, setStudentEmail] = useState("");
  const [startError, setStartError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!token) {
        setPageState("invalid");
        return;
      }

      try {
        const isValid = await evaluationLinkApi.validateToken(token);
        if (!isValid) {
          if (!cancelled) setPageState("invalid");
          return;
        }

        const link = await evaluationLinkApi.getLinkByToken(token);

        const detail = await getFormDetails(link.evaluationFormId);
        if (!detail) {
          if (!cancelled) setPageState("invalid");
          return;
        }

        const period = await fetchPeriodById(detail.evaluationPeriodId);
        if (!period) {
          if (!cancelled) setPageState("invalid");
          return;
        }

        const assignmentList =
          await teacherAssignmentApi.getAssignmentsByAcademicYearAndSemester(
            period.academicYear,
            period.semester,
          );

        if (!cancelled) {
          setFormDetail(detail);
          setAssignments(assignmentList);
          setPageState("ready");
        }
      } catch {
        if (!cancelled) setPageState("invalid");
      }
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !studentEmail.trim()) {
      setStartError("Please select a teacher/subject and enter your email.");
      return;
    }
    setStartError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: EvaluationSubmissionRequest) => {
    setSubmitting(true);
    try {
      await evaluationSubmissionApi.createSubmission(data);
      setIsFormOpen(false);
      setPageState("success");
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to submit evaluation"), {
        cause: err,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6] px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4 mx-auto">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-[#101826] mb-2">
            Link Invalid or Expired
          </h1>
          <p className="text-sm text-[#5B6472]">
            This evaluation link is no longer valid. Please contact your school
            administrator for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (pageState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6] px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3F8F1] mb-4 mx-auto">
            <FiCheckCircle className="h-8 w-8 text-[#4C9A4C]" />
          </div>
          <h1 className="text-lg font-semibold text-[#101826] mb-2">
            Thank You!
          </h1>
          <p className="text-sm text-[#5B6472]">
            Your evaluation has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  const selectedAssignment = assignments.find(
    (a) => a.id === selectedAssignmentId,
  );

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl border border-[#E4E1D9] shadow-sm w-full max-w-md p-6">
        <h1
          className="text-xl font-semibold text-[#101826] mb-1"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {formDetail?.title}
        </h1>
        {formDetail?.description && (
          <p className="text-sm text-[#5B6472] mb-6">
            {formDetail.description}
          </p>
        )}

        <form onSubmit={handleStart} className="space-y-4">
          {startError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <FiAlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{startError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#101826] mb-1.5">
              Teacher / Subject *
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) =>
                setSelectedAssignmentId(parseInt(e.target.value))
              }
              required
              className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826]">
              <option value={0}>Select teacher and subject</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.teacherName} — {a.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#101826] mb-1.5">
              Your Email *
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
              placeholder="you@student.edu"
              className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826]"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium">
            Start Evaluation
          </button>
        </form>
      </div>

      {formDetail && selectedAssignment && (
        <EvaluationSubmissionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          form={formDetail}
          categories={formDetail.categories}
          teacherAssignmentId={selectedAssignment.id}
          studentEmail={studentEmail}
          loading={submitting}
        />
      )}
    </div>
  );
};
