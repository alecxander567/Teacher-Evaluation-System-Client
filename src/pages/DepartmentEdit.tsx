// src/pages/DepartmentEdit.tsx

import { useNavigate, useParams } from "react-router-dom";
import { useDepartment, useUpdateDepartment } from "../hooks/useDepartment";
import DepartmentForm from "../components/departments/DepartmentForm";
import type { DepartmentRequest } from "../types/department.types";
import { FiArrowLeft } from "react-icons/fi";

const DepartmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const departmentId = parseInt(id || "0");

  const { department, loading: fetching } = useDepartment(departmentId);
  const { updateDepartment, loading: updating, error } = useUpdateDepartment();

  const handleSubmit = async (data: DepartmentRequest) => {
    try {
      await updateDepartment(departmentId, data);
      navigate(`/departments/${departmentId}`);
    } catch {
      // Error is handled by the hook
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-[#101826] mb-2">
            Department not found
          </h3>
          <button
            onClick={() => navigate("/departments")}
            className="text-[#E8A23D] hover:text-[#B8791F]">
            Return to departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={() => navigate(`/departments/${departmentId}`)}
        className="flex items-center gap-2 text-[#5B6472] hover:text-[#101826] mb-6 transition-colors">
        <FiArrowLeft className="h-4 w-4" />
        Back to Department
      </button>

      <div className="bg-white rounded-xl border border-[#E4E1D9] p-6">
        <h1
          className="text-2xl font-semibold text-[#101826] mb-6"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Edit Department
        </h1>

        <DepartmentForm
          initialData={{
            name: department.name,
            description: department.description,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/departments/${departmentId}`)}
          loading={updating}
          error={error}
        />
      </div>
    </div>
  );
};

export default DepartmentEdit;
