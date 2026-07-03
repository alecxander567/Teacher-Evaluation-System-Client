// src/pages/DepartmentDetailPage.tsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDepartment, useDeleteDepartment } from "../hooks/useDepartment";
import DepartmentDetail from "../components/departments/DepartmentDetail";
import { FiAlertCircle } from "react-icons/fi";

// Define a proper error type
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const departmentId = parseInt(id || "0");

  const {
    department,
    loading,
    error: fetchError,
  } = useDepartment(departmentId);
  const { deleteDepartment } = useDeleteDepartment();
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    navigate(`/departments/edit/${departmentId}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this department? This will remove all associated data.",
      )
    ) {
      try {
        await deleteDepartment(departmentId);
        navigate("/departments");
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to delete department");
      }
    }
  };

  const handleBack = () => {
    navigate("/departments");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (fetchError || !department) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-xl border border-[#E4E1D9]">
          <FiAlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#101826] mb-2">
            Department not found
          </h3>
          <p className="text-[#5B6472] text-sm mb-4">
            {fetchError || "The department you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/departments")}
            className="px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2538] transition-colors">
            Return to Departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

      <DepartmentDetail
        department={department}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DepartmentDetailPage;
