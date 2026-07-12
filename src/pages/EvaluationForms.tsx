// src/pages/EvaluationForms.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiArrowLeft, FiFilter } from "react-icons/fi";
import { useEvaluationForms } from "../hooks/useEvaluationForms";
import { useEvaluationPeriod } from "../hooks/useEvaluationPeriod";
import { useEvaluationLinks } from "../hooks/useEvaluationLinks";
import { EvaluationFormList } from "../components/forms/EvaluationFormList";
import { EvaluationFormModal } from "../components/forms/EvaluationFormModal";
import { GenerateLinkModal } from "../components/evaluations/GenerateLinkModal";
import { AlertModal } from "../components/AlertModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { Navbar } from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type {
  EvaluationForm,
  EvaluationFormRequest,
} from "../types/evaluationForm";
import type {
  EvaluationLink,
  EvaluationLinkRequest,
} from "../types/evaluationLink.types";

interface AlertState {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: React.ReactNode;
}

const initialAlertState: AlertState = {
  isOpen: false,
  type: "success",
  title: "",
  message: "",
};

export const EvaluationForms: React.FC = () => {
  const navigate = useNavigate();

  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
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

  const {
    forms,
    loading,
    error,
    loadForms,
    loadFormsByPeriodId,
    createForm,
    updateForm,
    deleteForm,
    searchForms,
    clearError,
  } = useEvaluationForms();
  const { periods, fetchPeriods } = useEvaluationPeriod();
  const { links, loadAllLinks, createLink } = useEvaluationLinks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<EvaluationForm | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState>(initialAlertState);
  const [pendingDeleteForm, setPendingDeleteForm] =
    useState<EvaluationForm | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedFormForLink, setSelectedFormForLink] =
    useState<EvaluationForm | null>(null);

  useEffect(() => {
    loadForms();
    fetchPeriods();
    loadAllLinks();
  }, [loadForms, fetchPeriods, loadAllLinks]);

  // Derived value: links grouped by evaluationFormId, computed directly
  // from `links` on every render. No useEffect/setState needed since
  // there's nothing to synchronize with an external system here - it's
  // a pure transformation of data we already have.
  //
  // Keyed by evaluationFormId, matching the actual EvaluationLink
  // entity/DTO relationship (evaluation_links.evaluation_form_id).
  const formLinks: Record<number, EvaluationLink[]> = links.reduce(
    (acc, link) => {
      if (!acc[link.evaluationFormId]) acc[link.evaluationFormId] = [];
      acc[link.evaluationFormId].push(link);
      return acc;
    },
    {} as Record<number, EvaluationLink[]>,
  );

  const periodTitles = periods.reduce(
    (acc, period) => {
      acc[period.id] = `${period.title} (${period.academicYear})`;
      return acc;
    },
    {} as Record<number, string>,
  );

  let filteredForms = forms;

  if (selectedPeriodId) {
    filteredForms = filteredForms.filter(
      (form) => form.evaluationPeriodId === selectedPeriodId,
    );
  }

  if (searchTerm) {
    filteredForms = filteredForms.filter(
      (form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  const handleCreate = () => {
    setEditingForm(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (form: EvaluationForm) => {
    setEditingForm(form);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: EvaluationFormRequest) => {
    const isEditing = Boolean(editingForm);
    const result =
      isEditing ?
        await updateForm(editingForm!.id, data)
      : await createForm(data);

    if (result) {
      setIsModalOpen(false);
      setAlert({
        isOpen: true,
        type: "success",
        title: isEditing ? "Form Updated" : "Form Created",
        message:
          isEditing ?
            `"${result.title}" was updated successfully.`
          : `"${result.title}" was added successfully.`,
      });
      if (searchTerm.trim()) {
        searchForms(searchTerm);
      } else if (selectedPeriodId) {
        loadFormsByPeriodId(selectedPeriodId);
      } else {
        loadForms();
      }
    } else if (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: isEditing ? "Update Failed" : "Creation Failed",
        message:
          error ||
          `Failed to ${isEditing ? "update" : "create"} form. Please try again.`,
      });
    }
  };

  const handleDelete = (form: EvaluationForm) => {
    setPendingDeleteForm(form);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteForm) return;

    setIsDeleting(true);
    const success = await deleteForm(pendingDeleteForm.id);
    setIsDeleting(false);

    const deletedTitle = pendingDeleteForm.title;
    setPendingDeleteForm(null);

    if (success) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Form Deleted",
        message: `"${deletedTitle}" was deleted successfully.`,
      });
      if (searchTerm.trim()) {
        searchForms(searchTerm);
      } else if (selectedPeriodId) {
        loadFormsByPeriodId(selectedPeriodId);
      } else {
        loadForms();
      }
    } else {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Delete Failed",
        message:
          error || `Failed to delete "${deletedTitle}". Please try again.`,
      });
    }
  };

  const handleGenerateLink = (form: EvaluationForm) => {
    setSelectedFormForLink(form);
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (data: EvaluationLinkRequest) => {
    const result = await createLink(data);
    if (result) {
      setIsLinkModalOpen(false);
      setSelectedFormForLink(null);

      // Refresh links so the new one appears on the form card
      await loadAllLinks();

      setAlert({
        isOpen: true,
        type: "success",
        title: "Evaluation Link Generated!",
        message: (
          <div className="text-left">
            <p className="mb-2">Share this link with students:</p>
            <div className="bg-[#F4F6FA] rounded-lg p-3 border border-[#E4E8F0] flex items-center justify-between gap-2">
              <code className="text-xs text-[#101625] break-all font-mono">
                {result.fullLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.fullLink);
                  setAlert({
                    isOpen: true,
                    type: "success",
                    title: "Copied!",
                    message: "Link copied to clipboard",
                  });
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-[#121A2E] text-white rounded-lg hover:bg-[#1B2740] transition-colors text-xs font-medium">
                Copy
              </button>
            </div>
            <p className="text-xs text-[#5A6478] mt-2">
              Students can use this link to evaluate teachers assigned to this
              period.
            </p>
          </div>
        ),
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      if (selectedPeriodId) {
        loadFormsByPeriodId(selectedPeriodId);
      } else {
        loadForms();
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchForms(searchTerm);
    }
  };

  const handlePeriodFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const periodId = value ? parseInt(value) : null;
    setSelectedPeriodId(periodId);
    if (periodId) {
      loadFormsByPeriodId(periodId);
    } else {
      loadForms();
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-semibold text-[#101625]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Evaluation Forms
            </h1>
            <p className="text-sm text-[#5A6478] mt-1">
              Manage evaluation forms for different periods
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#121A2E] text-white rounded-lg hover:bg-[#1B2740] transition-colors text-sm font-medium whitespace-nowrap">
            <FiPlus className="h-4 w-4" />
            New Form
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search forms..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm"
              />
              <FiSearch className="absolute left-3 top-3 h-5 w-5 text-[#5A6478]" />
            </div>
          </form>

          <div className="relative w-full sm:w-56">
            <select
              value={selectedPeriodId || ""}
              onChange={handlePeriodFilter}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm appearance-none">
              <option value="">All Periods</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.title} ({period.academicYear})
                </option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-3 h-5 w-5 text-[#5A6478]" />
          </div>
        </div>

        <EvaluationFormList
          forms={filteredForms}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGenerateLink={handleGenerateLink}
          periodTitles={periodTitles}
          formLinks={formLinks}
          loading={loading}
        />

        <EvaluationFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingForm(undefined);
          }}
          onSubmit={handleSubmit}
          initialData={editingForm}
          title={
            editingForm ? "Edit Evaluation Form" : "Create New Evaluation Form"
          }
        />

        <GenerateLinkModal
          isOpen={isLinkModalOpen}
          onClose={() => {
            setIsLinkModalOpen(false);
            setSelectedFormForLink(null);
          }}
          onSubmit={handleLinkSubmit}
          evaluationFormId={selectedFormForLink?.id || 0}
          loading={loading}
        />

        <DeleteConfirmationModal
          isOpen={pendingDeleteForm !== null}
          onClose={() => setPendingDeleteForm(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Form"
          itemName={pendingDeleteForm?.title}
          confirmText="Delete Form"
          loading={isDeleting}
          message={`Are you sure you want to delete the evaluation form "${pendingDeleteForm?.title}"? This action cannot be undone.`}
        />

        <AlertModal
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => {
            setAlert((prev) => ({ ...prev, isOpen: false }));
            if (alert.type === "error") {
              clearError();
            }
          }}
        />
      </div>
    </div>
  );
};
