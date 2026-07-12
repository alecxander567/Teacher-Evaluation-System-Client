// src/pages/Departments.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Navbar } from "../components/Navbar";

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
  const { deleteDepartment, loading: deleting } = useDeleteDepartment();
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

  const displayDepartments = searchTerm.trim() ? results : departments;

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
          loading={deleting}
          message={`Are you sure you want to delete the department "${departmentToDelete?.name}"? This will not delete the teachers, but they will be unassigned from this department.`}
        />
      </div>
    </div>
  );
};

export default Departments;
