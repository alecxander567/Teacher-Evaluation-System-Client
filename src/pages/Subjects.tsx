// src/pages/Subjects.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useSubjects,
  useDeleteSubject,
  useSearchSubjects,
  useCreateSubject,
} from "../hooks/useSubject";
import { subjectApi } from "../api/subjectApi";
import { SubjectList } from "../components/subjects/SubjectList";
import { SubjectForm } from "../components/subjects/SubjectForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiLogOut,
  FiBell,
  FiUser,
} from "react-icons/fi";
import type { Subject, SubjectRequest } from "../types/subject.types";
import { EvalMark } from "../components/icons/EvalMark";
import { AlertModal } from "../components/AlertModal";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user] = useState<{
    firstName: string;
    lastName: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const { subjects, loading, refetch } = useSubjects();
  const { deleteSubject } = useDeleteSubject();
  const { createSubject, loading: creating } = useCreateSubject();
  const { search, results, loading: searching } = useSearchSubjects();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Alert state
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      search(term);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
    setError(null);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
    setError(null);
  };

  const handleViewSubject = (id: number) => {
    navigate(`/subjects/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSubjectToDelete({
        id: subject.id,
        name: subject.subjectName,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;

    try {
      await deleteSubject(subjectToDelete.id);
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
      setAlert({
        type: "success",
        title: "Subject Deleted",
        message: `${subjectToDelete.name} has been deleted successfully.`,
      });
      await refetch();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete subject");
      setDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = async (data: SubjectRequest) => {
    try {
      let result;
      if (editingSubject) {
        result = await subjectApi.update(editingSubject.id, data);
      } else {
        result = await createSubject(data);
      }

      if (result) {
        setAlert({
          type: "success",
          title: editingSubject ? "Subject Updated" : "Subject Added",
          message: `${result.subjectName} has been ${
            editingSubject ? "updated" : "added"
          } successfully.`,
        });
        setIsFormOpen(false);
        setEditingSubject(null);
        await refetch();
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to save subject");
    }
  };

  const handleLogout = () => {
    logout();
  };

  const displaySubjects = searchTerm.trim() ? results : subjects;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
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
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5B6472] hover:text-[#101826] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800">
              ×
            </button>
          </div>
        )}

        {/* Subject List */}
        <SubjectList
          subjects={displaySubjects}
          loading={loading || searching}
          onAdd={handleAddSubject}
          onEdit={handleEditSubject}
          onDelete={handleDeleteClick}
          onView={handleViewSubject}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
      </div>

      {/* Subject Form Modal */}
      <SubjectForm
        isOpen={isFormOpen}
        subject={editingSubject}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleFormSubmit}
        loading={creating}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSubjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        itemName={subjectToDelete?.name}
        confirmText="Delete Subject"
        loading={loading}
        message={`Are you sure you want to delete the subject "${subjectToDelete?.name}"? This action cannot be undone.`}
      />

      {/* Alert Modal */}
      <AlertModal
        type={alert?.type || "success"}
        title={alert?.title || ""}
        message={alert?.message || ""}
        isOpen={alert !== null}
        onClose={() => {
          setAlert(null);
        }}
      />
    </div>
  );
};
