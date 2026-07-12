// src/pages/EvaluationPeriods.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvaluationPeriod } from "../hooks/useEvaluationPeriod";
import { PeriodList } from "../components/evaluationPeriods/PeriodList";
import { PeriodForm } from "../components/evaluationPeriods/PeriodForm";
import { StatusUpdateModal } from "../components/evaluationPeriods/StatusUpdateModal";
import { PeriodStats } from "../components/evaluationPeriods/PeriodStats";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { AlertModal } from "../components/AlertModal";
import { FiArrowLeft } from "react-icons/fi";
import { Navbar } from "../components/Navbar";
import type {
  EvaluationPeriod,
  EvaluationPeriodRequest,
} from "../types/evaluationPeriod.types";

export const EvaluationPeriods: React.FC = () => {
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<EvaluationPeriod | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [periodToUpdate, setPeriodToUpdate] = useState<EvaluationPeriod | null>(
    null,
  );

  const {
    periods,
    stats,
    loading,
    error,
    fetchPeriods,
    fetchPeriodsByStatus,
    fetchStats,
    createPeriod,
    updatePeriod,
    updatePeriodStatus,
    deletePeriod,
    clearError,
  } = useEvaluationPeriod();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch periods and stats on mount
  useEffect(() => {
    fetchPeriods();
    fetchStats();
  }, [fetchPeriods, fetchStats]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic if needed
  };

  const handleFilterByStatus = (status: string) => {
    setSelectedStatus(status);
    if (status === "all") {
      fetchPeriods();
    } else {
      fetchPeriodsByStatus(status);
    }
  };

  const handleRefresh = () => {
    if (selectedStatus === "all") {
      fetchPeriods();
    } else {
      fetchPeriodsByStatus(selectedStatus);
    }
    fetchStats();
  };

  const handleAddPeriod = () => {
    setEditingPeriod(null);
    setIsFormOpen(true);
  };

  const handleEditPeriod = (period: EvaluationPeriod) => {
    setEditingPeriod(period);
    setIsFormOpen(true);
  };

  const handleStatusUpdate = (period: EvaluationPeriod) => {
    setPeriodToUpdate(period);
    setStatusModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const period = periods.find((p) => p.id === id);
    if (period) {
      setPeriodToDelete({
        id: period.id,
        name: period.title,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!periodToDelete) return;

    const success = await deletePeriod(periodToDelete.id);
    setDeleteModalOpen(false);
    setPeriodToDelete(null);

    if (success) {
      setAlert({
        type: "success",
        title: "Period Deleted",
        message: `"${periodToDelete.name}" has been deleted successfully.`,
      });
      handleRefresh();
    } else if (error) {
      setAlert({
        type: "error",
        title: "Delete Failed",
        message: error || "Failed to delete period. Please try again.",
      });
    }
  };

  const handleFormSubmit = async (data: EvaluationPeriodRequest) => {
    const result =
      editingPeriod ?
        await updatePeriod(editingPeriod.id, data)
      : await createPeriod(data);

    if (result) {
      setAlert({
        type: "success",
        title: editingPeriod ? "Period Updated" : "Period Created",
        message: `"${result.title}" has been ${
          editingPeriod ? "updated" : "created"
        } successfully.`,
      });
      setIsFormOpen(false);
      setEditingPeriod(null);
      handleRefresh();
    } else if (error) {
      setAlert({
        type: "error",
        title: "Operation Failed",
        message: error,
      });
    }
  };

  const handleStatusConfirm = async (status: EvaluationPeriod["status"]) => {
    if (!periodToUpdate) return;

    const result = await updatePeriodStatus(periodToUpdate.id, { status });
    setStatusModalOpen(false);
    setPeriodToUpdate(null);

    if (result) {
      setAlert({
        type: "success",
        title: "Status Updated",
        message: `"${result.title}" status has been updated to ${result.status}.`,
      });
      handleRefresh();
    } else if (error) {
      setAlert({
        type: "error",
        title: "Update Failed",
        message: error || "Failed to update status. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#3D6BFF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back to Dashboard */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors">
            <FiArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Statistics */}
        <PeriodStats
          total={stats.total}
          draft={stats.draft}
          active={stats.active}
          closed={stats.closed}
          archived={stats.archived}
          onStatClick={(status) => handleFilterByStatus(status)}
        />

        {/* Period List */}
        <PeriodList
          periods={periods}
          loading={loading}
          onAdd={handleAddPeriod}
          onEdit={handleEditPeriod}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          onFilterByStatus={handleFilterByStatus}
          selectedStatus={selectedStatus}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>

      {/* Period Form Modal */}
      <PeriodForm
        isOpen={isFormOpen}
        period={editingPeriod}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPeriod(null);
        }}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={statusModalOpen}
        period={periodToUpdate}
        onClose={() => {
          setStatusModalOpen(false);
          setPeriodToUpdate(null);
        }}
        onConfirm={handleStatusConfirm}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPeriodToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Evaluation Period"
        itemName={periodToDelete?.name}
        confirmText="Delete Period"
        loading={loading}
        message={`Are you sure you want to delete the evaluation period "${periodToDelete?.name}"? This action cannot be undone.`}
      />

      {/* Alert Modal */}
      <AlertModal
        type={alert?.type || "success"}
        title={alert?.title || ""}
        message={alert?.message || ""}
        isOpen={alert !== null}
        onClose={() => {
          setAlert(null);
          clearError();
        }}
      />
    </div>
  );
};
