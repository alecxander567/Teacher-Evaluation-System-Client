// src/pages/EvaluationFormDetail.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiArrowLeft,
  FiLogOut,
  FiBell,
  FiUser,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { EvalMark } from "../components/icons/EvalMark";
import { CategoryBuilder } from "../components/forms/CategoryBuilder";
import { AlertModal } from "../components/AlertModal";
import { useEvaluationForms } from "../hooks/useEvaluationForms";
import { useEvaluationCategories } from "../hooks/useEvaluationCategories";
import { useEvaluationQuestions } from "../hooks/useEvaluationQuestions";
import type { EvaluationFormDetail as EvaluationFormDetailType } from "../types/evaluationForm";

// Make sure this is a default export
const EvaluationFormDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getFormDetails } = useEvaluationForms();
  const {
    categories,
    loading: categoriesLoading,
    loadCategoriesWithQuestions,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useEvaluationCategories();
  const { createQuestion, updateQuestion, deleteQuestion } =
    useEvaluationQuestions();

  const [form, setForm] = useState<EvaluationFormDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // Initialize user from localStorage
  const [user] = useState<{
    firstName: string;
    lastName: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const loadFormData = useCallback(
    async (formId: number) => {
      setLoading(true);
      const formData = await getFormDetails(formId);
      if (formData) {
        setForm(formData);
        await loadCategoriesWithQuestions(formId);
      }
      setLoading(false);
    },
    [getFormDetails, loadCategoriesWithQuestions],
  );

  // Render-time adjustment: fetch form data whenever `id` changes, instead of
  // calling setState synchronously from an effect body.
  const [loadedForId, setLoadedForId] = useState<string | undefined>(undefined);
  if (id !== loadedForId) {
    setLoadedForId(id);
    if (id) {
      loadFormData(parseInt(id));
    }
  }

  const handleAddCategory = async (name: string, description?: string) => {
    if (!id) return;
    const result = await createCategory({
      formId: parseInt(id),
      name,
      description,
      displayOrder: categories.length,
    });
    if (result) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Category Added",
        message: `"${name}" category was added successfully.`,
      });
      await loadCategoriesWithQuestions(parseInt(id));
    }
  };

  const handleUpdateCategory = async (
    categoryId: number,
    name: string,
    description?: string,
  ) => {
    const result = await updateCategory(categoryId, {
      formId: parseInt(id!),
      name,
      description,
    });
    if (result) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Category Updated",
        message: `"${name}" category was updated successfully.`,
      });
      await loadCategoriesWithQuestions(parseInt(id!));
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const success = await deleteCategory(categoryId);
    if (success) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Category Deleted",
        message: "Category was deleted successfully.",
      });
      await loadCategoriesWithQuestions(parseInt(id!));
    }
  };

  const handleAddQuestion = async (
    categoryId: number,
    question: string,
    isRequired: boolean,
  ) => {
    const result = await createQuestion({
      categoryId,
      question,
      isRequired,
      displayOrder: 0,
    });
    if (result) {
      await loadCategoriesWithQuestions(parseInt(id!));
    }
  };

  const handleUpdateQuestion = async (
    questionId: number,
    question: string,
    isRequired: boolean,
  ) => {
    // Get the question to find its category ID
    const questionToUpdate = categories
      .flatMap((cat) => cat.questions || [])
      .find((q) => q.id === questionId);

    if (!questionToUpdate) return;

    const result = await updateQuestion(questionId, {
      categoryId: questionToUpdate.categoryId,
      question,
      isRequired,
    });
    if (result) {
      await loadCategoriesWithQuestions(parseInt(id!));
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const success = await deleteQuestion(questionId);
    if (success) {
      await loadCategoriesWithQuestions(parseInt(id!));
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="text-center">
          <FiFileText className="h-12 w-12 text-[#5B6472] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#101826]">
            Form not found
          </h2>
          <button
            onClick={() => navigate("/evaluation-forms")}
            className="mt-4 text-[#B8791F] hover:text-[#101826] transition-colors">
            Back to forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* Navbar */}
      <nav className="bg-[#101826]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 min-w-0">
              <EvalMark className="h-7 w-7 flex-shrink-0" />
              <span
                className="text-base sm:text-lg font-semibold text-[#FAFAF6] tracking-tight truncate"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                <span className="hidden sm:inline">SPCT Evaluation System</span>
                <span className="sm:hidden">SPCT</span>
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                <FiBell className="h-5 w-5 text-[#AEB6C2]" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#E8A23D] rounded-full"></span>
              </button>
              <div className="flex items-center gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#E8A23D] flex items-center justify-center flex-shrink-0">
                    <FiUser className="h-4 w-4 text-[#101826]" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-[#FAFAF6] whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 sm:px-3 py-2 text-sm text-[#AEB6C2] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <FiLogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/evaluation-forms")}
          className="flex items-center gap-2 text-sm text-[#5B6472] hover:text-[#101826] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Forms
        </button>

        {/* Form Header */}
        <div className="bg-white rounded-xl border border-[#E4E1D9] p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-semibold text-[#101826]"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                {form.title}
              </h1>
              {form.description && (
                <p className="text-[#5B6472] mt-1">{form.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-sm text-[#5B6472] flex items-center gap-1">
                  <FiCalendar className="h-4 w-4" />
                  Period: {form.evaluationPeriodTitle}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    form.isPeriodActive ?
                      "bg-green-50 text-green-600"
                    : "bg-gray-50 text-gray-600"
                  }`}>
                  {form.isPeriodActive ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-[#5B6472] flex items-center gap-1">
                  <FiFileText className="h-4 w-4" />
                  Total Questions: {form.totalQuestions || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  form.isPeriodActive ?
                    "bg-green-50 text-green-600"
                  : "bg-gray-50 text-gray-600"
                }`}>
                {form.evaluationPeriodStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Category Builder */}
        <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
          <h2
            className="text-lg font-semibold text-[#101826] mb-4"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Question Builder
          </h2>
          <CategoryBuilder
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            loading={categoriesLoading}
          />
        </div>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};

// Export as default
export default EvaluationFormDetail;
