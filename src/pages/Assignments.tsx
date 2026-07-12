// src/pages/Assignments.tsx - Using SPCT theme
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  useSearchAssignments,
} from "../hooks/useAssignment";
import { AssignmentList } from "../components/assignments/AssignmentList";
import { AssignmentForm } from "../components/assignments/AssignmentForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import type { Assignment, AssignmentRequest } from "../types/assignment.types";
import { Navbar } from "../components/Navbar";
import { AlertModal } from "../components/AlertModal";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const Assignments: React.FC = () => {
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

  const { assignments, loading, error: fetchError, refetch } = useAssignments();
  const { search, results, loading: searching } = useSearchAssignments();
  const { createAssignment, loading: creating } = useCreateAssignment();
  const { updateAssignment, loading: updating } = useUpdateAssignment();
  const { deleteAssignment } = useDeleteAssignment();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{
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

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setIsFormOpen(true);
    setError(null);
  };

  const handleEditAssignment = (id: number) => {
    const assignment = assignments.find((a) => a.id === id);
    if (assignment) {
      setEditingAssignment(assignment);
      setIsFormOpen(true);
      setError(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    const assignment = assignments.find((a) => a.id === id);
    if (assignment) {
      setAssignmentToDelete({
        id: assignment.id,
        name: `${assignment.teacherName || "Teacher"} - ${assignment.subjectName || "Subject"}`,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      await deleteAssignment(assignmentToDelete.id);
      setDeleteModalOpen(false);
      setAssignmentToDelete(null);
      setAlert({
        type: "success",
        title: "Assignment Removed",
        message: `Assignment has been removed successfully.`,
      });
      await refetch();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to remove assignment");
      setDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = async (data: AssignmentRequest) => {
    try {
      let result;
      if (editingAssignment) {
        result = await updateAssignment(editingAssignment.id, data);
      } else {
        result = await createAssignment(data);
      }

      if (result) {
        setAlert({
          type: "success",
          title:
            editingAssignment ? "Assignment Updated" : "Assignment Created",
          message: `Teacher has been ${editingAssignment ? "updated" : "assigned"} successfully.`,
        });
        setIsFormOpen(false);
        setEditingAssignment(null);
        await refetch();
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to save assignment");
    }
  };

  const displayAssignments = searchTerm.trim() ? results : assignments;

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
        {(error || fetchError) && (
          <div className="mb-6 p-4 bg-[#FBEEF0] border border-[#F0CBD1] rounded-lg flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 text-[#9A3A50] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[#9A3A50] text-sm">{error || fetchError}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
              }}
              className="text-[#9A3A50] hover:text-[#6E2739]">
              ×
            </button>
          </div>
        )}

        {/* Assignment List */}
        <AssignmentList
          assignments={displayAssignments}
          loading={loading || searching}
          onAdd={handleAddAssignment}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
      </div>

      {/* Assignment Form Modal */}
      <AssignmentForm
        isOpen={isFormOpen}
        assignment={editingAssignment}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAssignmentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Assignment"
        itemName={assignmentToDelete?.name}
        confirmText="Remove Assignment"
        loading={loading}
        message={`Are you sure you want to remove this assignment? This action cannot be undone.`}
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
