// src/pages/Subjects.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSubjects,
  useDeleteSubject,
  useSearchSubjects,
  useCreateSubject,
} from "../hooks/useSubjects";
import { subjectApi } from "../api/subjectApi";
import { SubjectList } from "../components/subjects/SubjectList";
import { SubjectForm } from "../components/subjects/SubjectForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import type { Subject, SubjectRequest } from "../types/subject.types";
import { Navbar } from "../components/Navbar";
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

  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const { subjects, loading, refetch } = useSubjects();
  const { deleteSubject, loading: deleting } = useDeleteSubject();
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

  const displaySubjects = searchTerm.trim() ? results : subjects;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <LoadingSpinner fullScreen label="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
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
        loading={deleting}
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
