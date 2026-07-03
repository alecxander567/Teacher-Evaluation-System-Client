// src/pages/DepartmentCreate.tsx

import { useNavigate } from "react-router-dom";
import { useCreateDepartment } from "../hooks/useDepartment";
import DepartmentForm from "../components/departments/DepartmentForm";
import type { DepartmentRequest } from "../types/department.types";
import { FiArrowLeft } from "react-icons/fi";

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createDepartment, loading, error } = useCreateDepartment();

  const handleSubmit = async (data: DepartmentRequest) => {
    try {
      await createDepartment(data);
      navigate("/departments");
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={() => navigate("/departments")}
        className="flex items-center gap-2 text-[#5B6472] hover:text-[#101826] mb-6 transition-colors">
        <FiArrowLeft className="h-4 w-4" />
        Back to Departments
      </button>

      <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
        <h1
          className="text-2xl font-semibold text-[#101826] mb-6"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Create New Department
        </h1>

        <DepartmentForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/departments")}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default DepartmentCreate;
