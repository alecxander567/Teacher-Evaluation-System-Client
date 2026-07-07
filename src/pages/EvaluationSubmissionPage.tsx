// src/pages/EvaluationSubmissionPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { evaluationLinkApi } from "../api/evaluationLinkApi";
import { evaluationSubmissionApi } from "../api/evaluationSubmissionApi";
import { teacherSelectionApi } from "../api/teacherSelectionApi";
import { useEvaluationForms } from "../hooks/useEvaluationForms";
import { useEvaluationPeriod } from "../hooks/useEvaluationPeriod";
import { EvaluationSubmissionForm } from "../components/evaluations/EvaluationSubmissionForm";
import { TeacherSelectionStep } from "../components/evaluations/TeacherSelectionStep";
import type { TeacherSelection } from "../types/teacherSelection.types";
import type { EvaluationSubmissionRequest } from "../types/evaluationSubmission.types";
import type { EvaluationFormDetail } from "../types/evaluationCategory.types";
import { getErrorMessage } from "../utils/getErrorMessage";

type PageState =
  | "loading"
  | "invalid"
  | "email"
  | "selecting"
  | "evaluating"
  | "success";

export const EvaluationSubmissionPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { getFormDetails } = useEvaluationForms();
  const { fetchPeriodById } = useEvaluationPeriod();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [formDetail, setFormDetail] = useState<EvaluationFormDetail | null>(
    null,
  );
  const [periodId, setPeriodId] = useState<number>(0);
  const [linkId, setLinkId] = useState<number>(0);
  const [studentEmail, setStudentEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [allTeachers, setAllTeachers] = useState<TeacherSelection[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  const [queue, setQueue] = useState<TeacherSelection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

        if (!cancelled) {
          setFormDetail(detail);
          setPeriodId(period.id);
          setLinkId(link.id);
          setPageState("email");
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) {
      setEmailError("Please enter your email.");
      return;
    }
    setEmailError(null);
    setTeachersLoading(true);
    setPageState("selecting");

    try {
      const period = await fetchPeriodById(formDetail!.evaluationPeriodId);
      if (!period) {
        setPageState("invalid");
        return;
      }
      const teachers = await teacherSelectionApi.getSelectionList(
        period.academicYear,
        period.semester,
      );
      setAllTeachers(teachers);
    } catch {
      setPageState("invalid");
    } finally {
      setTeachersLoading(false);
    }
  };

  const handleTeacherSelectionContinue = async (
    selected: TeacherSelection[],
  ) => {
    try {
      const statuses = await evaluationSubmissionApi.checkBatchStatus({
        evaluationPeriodId: periodId,
        studentEmail,
        teacherAssignmentIds: selected.map((t) => t.teacherAssignmentId),
      });

      const alreadyEvaluated = new Set(
        statuses.filter((s) => s.evaluated).map((s) => s.teacherAssignmentId),
      );

      const remaining = selected.filter(
        (t) => !alreadyEvaluated.has(t.teacherAssignmentId),
      );

      if (remaining.length === 0) {
        setPageState("success");
        return;
      }

      setQueue(remaining);
      setCurrentIndex(0);
      setPageState("evaluating");
      setIsFormOpen(true);
    } catch {
      setQueue(selected);
      setCurrentIndex(0);
      setPageState("evaluating");
      setIsFormOpen(true);
    }
  };

  const handleSubmit = async (data: EvaluationSubmissionRequest) => {
    setSubmitting(true);
    try {
      await evaluationSubmissionApi.createSubmission(data);
      setIsFormOpen(false);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        setPageState("success");
      } else {
        setCurrentIndex(nextIndex);
        setIsFormOpen(true);
      }
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
            All of your evaluations have been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  const currentTeacher = queue[currentIndex];

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl border border-[#E4E1D9] shadow-sm w-full max-w-2xl p-6">
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

        {pageState === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-sm">
            {emailError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <FiAlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{emailError}</p>
              </div>
            )}
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
              Continue
            </button>
          </form>
        )}

        {pageState === "selecting" && (
          <TeacherSelectionStep
            teachers={allTeachers}
            loading={teachersLoading}
            onContinue={handleTeacherSelectionContinue}
          />
        )}

        {pageState === "evaluating" && currentTeacher && (
          <div>
            <p className="text-sm text-[#5B6472] mb-4">
              Evaluating {currentIndex + 1} of {queue.length}:{" "}
              <span className="font-medium text-[#101826]">
                {currentTeacher.fullName}
              </span>
            </p>

            {!isFormOpen && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium">
                Continue to {currentTeacher.fullName}
              </button>
            )}
          </div>
        )}
      </div>

      {formDetail && currentTeacher && (
        <EvaluationSubmissionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          form={formDetail}
          categories={formDetail.categories}
          teacherAssignmentId={currentTeacher.teacherAssignmentId}
          evaluationLinkId={linkId}
          studentEmail={studentEmail}
          loading={submitting}
        />
      )}
    </div>
  );
};
