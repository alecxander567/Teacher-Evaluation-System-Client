// src/pages/EvaluationPeriods.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEvaluationPeriod } from "../hooks/useEvaluationPeriod";
import { PeriodList } from "../components/evaluationPeriods/PeriodList";
import { PeriodForm } from "../components/evaluationPeriods/PeriodForm";
import { StatusUpdateModal } from "../components/evaluationPeriods/StatusUpdateModal";
import { PeriodStats } from "../components/evaluationPeriods/PeriodStats";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { AlertModal } from "../components/AlertModal";
import {
  FiArrowLeft,
  FiLogOut,
  FiBell,
  FiUser,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { EvalMark } from "../components/icons/EvalMark";
import type {
  EvaluationPeriod,
  EvaluationPeriodRequest,
} from "../types/evaluationPeriod.types";

export const EvaluationPeriods: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate("/admin-settings");
    setIsDropdownOpen(false);
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
      {/* Navbar */}
      <nav className="bg-gradient-to-b from-[#0A0E1A] to-[#121A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 min-w-0">
              <EvalMark className="h-7 w-7 flex-shrink-0" />
              <span
                className="text-base sm:text-lg font-semibold text-[#F4F6FA] tracking-tight truncate"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                <span className="hidden sm:inline">SPCT Evaluation System</span>
                <span className="sm:hidden">SPCT</span>
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                <FiBell className="h-5 w-5 text-[#8E97AE]" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#3D6BFF] rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-[#3D6BFF] flex items-center justify-center flex-shrink-0">
                    <FiUser className="h-4 w-4 text-[#0A0E1A]" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-[#F4F6FA] whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </span>
                  <FiChevronDown
                    className={`h-4 w-4 text-[#8E97AE] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E4E8F0] py-1 z-50">
                    <div className="px-4 py-3 border-b border-[#E4E8F0]">
                      <p className="text-sm font-medium text-[#101625]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#5A6478] truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#EBF0FE] text-[#3D6BFF] text-xs rounded-full">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#101625] hover:bg-[#F4F6FA] transition-colors">
                      <FiSettings className="h-4 w-4 text-[#5A6478]" />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-[#FBEEF0] transition-colors border-t border-[#E4E8F0]">
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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
