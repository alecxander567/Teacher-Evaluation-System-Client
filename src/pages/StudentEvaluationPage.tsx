// src/pages/StudentEvaluationPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { studentEvaluationApi } from "../api/studentEvaluationApi";
import { evaluationLinkApi } from "../api/evaluationLinkApi";
import { TeacherSelectionForm } from "../components/student/TeacherSelectionForm";
import { EvaluationProgress } from "../components/student/EvaluationProgress";
import { EvaluationSubmissionForm } from "../components/evaluations/EvaluationSubmissionForm";
import { AlertModal } from "../components/AlertModal";
import { useEvaluationForms } from "../hooks/useEvaluationForms";
import type {
  DepartmentTeacherGroup,
  StudentEvaluationSession,
  TeacherEvaluationProgress,
} from "../types/studentEvaluation.types";
import type { EvaluationSubmissionRequest } from "../types/evaluationSubmission.types";
import type { EvaluationFormDetail } from "../types/evaluationCategory.types";
import { getErrorMessage } from "../utils/getErrorMessage";

type PageState =
  | "loading"
  | "teacher-selection"
  | "evaluating"
  | "completed"
  | "error";

export const StudentEvaluationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { getFormDetails } = useEvaluationForms();

  // State
  const [pageState, setPageState] = useState<PageState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [teacherGroups, setTeacherGroups] = useState<DepartmentTeacherGroup[]>(
    [],
  );
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Session state
  const [session, setSession] = useState<StudentEvaluationSession | null>(null);
  const [progress, setProgress] = useState<TeacherEvaluationProgress[]>([]);
  const [currentProgress, setCurrentProgress] =
    useState<TeacherEvaluationProgress | null>(null);
  const [formDetail, setFormDetail] = useState<EvaluationFormDetail | null>(
    null,
  );

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Declared before the effect that uses them, and memoized so the
  // effect's dependency array can safely reference them.
  const loadTeachers = useCallback(
    async (periodId: number, formId: number) => {
      setLoadingTeachers(true);
      try {
        const groups = await studentEvaluationApi.getAvailableTeachers(
          periodId,
          formId,
          studentEmail || "pending@student.edu",
        );
        setTeacherGroups(groups);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load teachers"));
        setPageState("error");
      } finally {
        setLoadingTeachers(false);
      }
    },
    [studentEmail],
  );

  const resumeSession = useCallback(
    async (sessionId: string, detail: EvaluationFormDetail) => {
      try {
        const sessionData = await studentEvaluationApi.getSession(sessionId);
        if (!sessionData || sessionData.status === "COMPLETED") {
          setPageState("completed");
          return;
        }

        setSession(sessionData);
        setFormDetail(detail);

        // Get progress
        const progressData =
          await studentEvaluationApi.getSessionProgress(sessionId);
        setProgress(progressData);

        // Get current teacher
        const nextTeacher =
          await studentEvaluationApi.getNextTeacher(sessionId);
        setCurrentProgress(nextTeacher);

        if (nextTeacher.teacherAssignmentId) {
          setPageState("evaluating");
          // Load form for current teacher
          const form = await studentEvaluationApi.getTeacherEvaluationForm(
            sessionId,
            nextTeacher.teacherAssignmentId,
          );
          setFormDetail(form);
        } else {
          setPageState("completed");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to resume evaluation"));
        setPageState("error");
      }
    },
    [],
  );

  // Load initial data
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setError("Invalid evaluation link");
        setPageState("error");
        return;
      }

      try {
        // Validate token
        const isValid = await evaluationLinkApi.validateToken(token);
        if (!isValid) {
          setError("This evaluation link is invalid or has expired");
          setPageState("error");
          return;
        }

        // Get link info
        const link = await evaluationLinkApi.getLinkByToken(token);
        if (!link || !link.evaluationFormId) {
          setError("Invalid evaluation link");
          setPageState("error");
          return;
        }

        // Get form details
        const detail = await getFormDetails(link.evaluationFormId);
        if (!detail) {
          setError("Evaluation form not found");
          setPageState("error");
          return;
        }

        setFormDetail(detail);

        // Check for existing session in localStorage
        const savedSession = localStorage.getItem(`eval_session_${token}`);
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (
              parsed.status === "IN_PROGRESS" ||
              parsed.status === "SELECTING"
            ) {
              // Resume session
              await resumeSession(parsed.sessionId, detail);
              return;
            }
          } catch {
            // Invalid saved session, start fresh
            localStorage.removeItem(`eval_session_${token}`);
          }
        }

        // Start new session - load teachers
        setPageState("teacher-selection");
        await loadTeachers(detail.evaluationPeriodId, detail.id);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to initialize evaluation"));
        setPageState("error");
      }
    };

    init();
  }, [token, getFormDetails, resumeSession, loadTeachers]);

  const handleStartEvaluation = async (selectedIds: number[]) => {
    if (!formDetail) return;

    try {
      const request = {
        evaluationPeriodId: formDetail.evaluationPeriodId,
        evaluationFormId: formDetail.id,
        studentEmail: studentEmail,
        studentName: studentEmail.split("@")[0], // Simple fallback
        teacherAssignmentIds: selectedIds,
      };

      const newSession = await studentEvaluationApi.startSession(request);
      setSession(newSession);

      // Save session to localStorage
      localStorage.setItem(`eval_session_${token}`, JSON.stringify(newSession));

      // Get progress
      const progressData = await studentEvaluationApi.getSessionProgress(
        newSession.sessionId,
      );
      setProgress(progressData);

      // Get first teacher
      const nextTeacher = await studentEvaluationApi.getNextTeacher(
        newSession.sessionId,
      );
      setCurrentProgress(nextTeacher);

      if (nextTeacher.teacherAssignmentId) {
        setPageState("evaluating");
        // Load form for first teacher
        const form = await studentEvaluationApi.getTeacherEvaluationForm(
          newSession.sessionId,
          nextTeacher.teacherAssignmentId,
        );
        setFormDetail(form);
        setIsFormOpen(true);
      } else {
        setPageState("completed");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to start evaluation"));
      setPageState("error");
    }
  };

  const handleSubmitEvaluation = async (data: EvaluationSubmissionRequest) => {
    if (!session) return;

    setSubmitting(true);
    try {
      const nextTeacher = await studentEvaluationApi.submitTeacherEvaluation(
        session.sessionId,
        data,
      );

      // Update progress
      const progressData = await studentEvaluationApi.getSessionProgress(
        session.sessionId,
      );
      setProgress(progressData);
      setCurrentProgress(nextTeacher);

      // Update session
      const updatedSession = await studentEvaluationApi.getSession(
        session.sessionId,
      );
      setSession(updatedSession);
      localStorage.setItem(
        `eval_session_${token}`,
        JSON.stringify(updatedSession),
      );

      setIsFormOpen(false);

      // Check if complete
      if (nextTeacher.teacherAssignmentId) {
        // Load form for next teacher
        const form = await studentEvaluationApi.getTeacherEvaluationForm(
          session.sessionId,
          nextTeacher.teacherAssignmentId,
        );
        setFormDetail(form);

        // Show success message
        setAlert({
          isOpen: true,
          type: "success",
          title: "Evaluation Submitted!",
          message: `Your evaluation for ${nextTeacher.teacherName} has been submitted.`,
        });

        // Open form for next teacher after brief delay
        setTimeout(() => {
          setIsFormOpen(true);
        }, 1500);
      } else {
        // All done
        setPageState("completed");
        await studentEvaluationApi.completeSession(session.sessionId);
        localStorage.removeItem(`eval_session_${token}`);

        setAlert({
          isOpen: true,
          type: "success",
          title: "All Evaluations Complete!",
          message: "Thank you for completing all your evaluations.",
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit evaluation"));
      setAlert({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: getErrorMessage(err, "Please try again"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  // Render error state
  if (pageState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4 mx-auto">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-[#101625] mb-2">
            Something Went Wrong
          </h1>
          <p className="text-sm text-[#5A6478] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#101625] text-white rounded-lg hover:bg-[#0A0E1A] transition-colors text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render completed state
  if (pageState === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3F8F1] mb-4 mx-auto">
            <FiCheckCircle className="h-8 w-8 text-[#4C9A4C]" />
          </div>
          <h1 className="text-xl font-semibold text-[#101625] mb-2">
            Thank You!
          </h1>
          <p className="text-sm text-[#5A6478]">
            You have successfully completed all your evaluations. Your feedback
            is greatly appreciated.
          </p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3D6BFF] border-t-transparent"></div>
      </div>
    );
  }

  // Render teacher selection
  if (pageState === "teacher-selection") {
    return (
      <div className="min-h-screen bg-[#F4F6FA] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
            <FiArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] shadow-sm p-6">
            <h1 className="text-xl font-semibold text-[#101625] mb-1">
              {formDetail?.title || "Teacher Evaluation"}
            </h1>
            {formDetail?.description && (
              <p className="text-sm text-[#5A6478] mb-6">
                {formDetail.description}
              </p>
            )}

            <TeacherSelectionForm
              teacherGroups={teacherGroups}
              loading={loadingTeachers}
              error={error}
              onSubmit={handleStartEvaluation}
              studentEmail={studentEmail}
              onEmailChange={setStudentEmail}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render evaluation in progress
  if (pageState === "evaluating" && session && currentProgress && formDetail) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to cancel this evaluation?",
                )
              ) {
                if (session) {
                  studentEvaluationApi.cancelSession(session.sessionId);
                  localStorage.removeItem(`eval_session_${token}`);
                }
                navigate(-1);
              }
            }}
            className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
            <FiArrowLeft className="h-4 w-4" />
            Cancel Evaluation
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] shadow-sm p-6">
                <h1 className="text-xl font-semibold text-[#101625] mb-1">
                  {formDetail?.title || "Evaluation Form"}
                </h1>
                <p className="text-sm text-[#5A6478] mb-4">
                  Evaluating: {currentProgress?.teacherName} -{" "}
                  {currentProgress?.subjectName}
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-[#F4F6FA] rounded-lg">
                  <div className="flex-1">
                    <div className="h-2 bg-[#E4E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3D6BFF] rounded-full transition-all duration-300"
                        style={{
                          width: `${(session.completedCount / session.totalTeachers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-[#5A6478] whitespace-nowrap">
                    {session.completedCount} of {session.totalTeachers}{" "}
                    completed
                  </span>
                </div>

                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full px-6 py-3 bg-[#101625] text-white rounded-lg hover:bg-[#0A0E1A] transition-colors text-sm font-medium">
                  Start Evaluation for {currentProgress?.teacherName}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <EvaluationProgress
                progress={progress}
                currentIndex={session.currentIndex}
              />
            </div>
          </div>
        </div>

        {/* Evaluation Form Modal */}
        {formDetail && currentProgress?.teacherAssignmentId && (
          <EvaluationSubmissionForm
            isOpen={isFormOpen}
            onClose={() => {
              if (
                window.confirm(
                  "Are you sure you want to cancel this evaluation?",
                )
              ) {
                setIsFormOpen(false);
              }
            }}
            onSubmit={handleSubmitEvaluation}
            form={formDetail}
            categories={formDetail.categories || []}
            teacherAssignmentId={currentProgress.teacherAssignmentId}
            studentEmail={session.studentEmail}
            loading={submitting}
          />
        )}

        {/* Alert Modal */}
        {alert && (
          <AlertModal
            isOpen={alert.isOpen}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={handleCloseAlert}
          />
        )}
      </div>
    );
  }

  return null;
};
