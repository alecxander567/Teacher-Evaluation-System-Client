// src/pages/SubjectDetailPage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubject, useDeleteSubject } from "../hooks/useSubjects";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiBook,
} from "react-icons/fi";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subjectId = parseInt(id || "0");

  const { subject, loading, error: fetchError } = useSubject(subjectId);
  const { deleteSubject } = useDeleteSubject();
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/subjects/edit/${subjectId}`);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSubject(subjectId);
      setDeleteModalOpen(false);
      navigate("/subjects");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete subject");
      setDeleteModalOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/subjects");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (fetchError || !subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-xl border border-[#E4E1D9]">
          <FiAlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#101826] mb-2">
            Subject not found
          </h3>
          <p className="text-[#5B6472] text-sm mb-4">
            {fetchError || "The subject you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/subjects")}
            className="px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2538] transition-colors">
            Return to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-[#5B6472] hover:text-[#101826] transition-colors mb-6">
        <FiArrowLeft className="h-4 w-4" />
        Back to Subjects
      </button>

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

      {/* Subject Info */}
      <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-[#FBEEDC] flex items-center justify-center flex-shrink-0">
              <FiBook className="h-7 w-7 text-[#B8791F]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-semibold text-[#101826]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  {subject.subjectName}
                </h1>
                <span className="px-3 py-1 bg-[#FBEEDC] text-[#B8791F] text-sm font-medium rounded-full">
                  {subject.subjectCode}
                </span>
              </div>
              {subject.description && (
                <p className="text-[#5B6472] mt-2">{subject.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-[#5B6472]">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Department:</span>
                  <span>{subject.departmentName || "No Department"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Created:</span>
                  <span>
                    {new Date(subject.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-2 border border-[#E4E1D9] text-[#5B6472] hover:text-[#101826] hover:bg-[#FAFAF6] rounded-lg transition-colors">
              <FiEdit2 className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <FiTrash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        itemName={subject.subjectName}
        confirmText="Delete Subject"
        loading={loading}
        message={`Are you sure you want to delete the subject "${subject.subjectName}"? This action cannot be undone.`}
      />
    </div>
  );
};
