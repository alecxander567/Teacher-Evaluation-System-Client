// src/pages/Departments.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useDepartments,
  useDeleteDepartment,
  useSearchDepartments,
} from "../hooks/useDepartment";
import DepartmentList from "../components/departments/DepartmentList";
import DepartmentForm from "../components/departments/DepartmentForm";
import type { DepartmentRequest } from "../types/department.types";
import { useCreateDepartment } from "../hooks/useDepartment";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiLogOut,
  FiBell,
  FiUser,
} from "react-icons/fi";
import { EvalMark } from "../components/icons/EvalMark";

// Define a proper error type
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Departments: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize user from localStorage directly
  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const { departments, loading, refetch } = useDepartments();
  const { deleteDepartment } = useDeleteDepartment();
  const { createDepartment, loading: creating } = useCreateDepartment();
  const { search, results, loading: searching } = useSearchDepartments();

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleAdd = () => {
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/departments/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/departments/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    const department = departments.find((d) => d.id === id);
    if (department) {
      setDepartmentToDelete({
        id: department.id,
        name: department.name,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteDepartment(departmentToDelete.id);
      setDeleteModalOpen(false);
      setDepartmentToDelete(null);
      await refetch();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete department");
      setDeleteModalOpen(false);
    }
  };

  const handleCreate = async (data: DepartmentRequest) => {
    try {
      await createDepartment(data);
      setShowForm(false);
      await refetch();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create department");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      search(term);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const displayDepartments = searchTerm.trim() ? results : departments;

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

        <DepartmentList
          departments={displayDepartments}
          loading={loading || searching}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
          onSearch={handleSearch}
        />

        {/* Create Department Modal */}
        {showForm && (
          <DepartmentForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={creating}
            error={error}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDepartmentToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Department"
          itemName={departmentToDelete?.name}
          confirmText="Delete Department"
          loading={false}
          message={`Are you sure you want to delete the department "${departmentToDelete?.name}"? This will not delete the teachers, but they will be unassigned from this department.`}
        />
      </div>
    </div>
  );
};

export default Departments;
