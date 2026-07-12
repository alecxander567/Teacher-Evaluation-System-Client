// src/pages/TeacherAssignments.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiArrowLeft,
  FiTrash2,
  FiEdit2,
  FiUsers,
  FiBookOpen,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { Navbar } from "../components/Navbar";
import { AlertModal } from "../components/AlertModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useTeacherAssignments } from "../hooks/useTeacherAssignments";
import { useTeacher } from "../hooks/useTeacher";
import { useSubjects } from "../hooks/useSubjects";
import { SEMESTERS } from "../constants/academicTerms";
import type {
  TeacherAssignment,
  TeacherAssignmentRequest,
} from "../types/teacherAssignment.types";

// Simple modal for create/edit - defined OUTSIDE the parent component
// to prevent React from recreating it on every render (which breaks hooks)
const AssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherAssignmentRequest) => Promise<void>;
  initialData?: TeacherAssignment;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const { teachers, fetchTeachers } = useTeacher();
  const { subjects, refetch: refetchSubjects } = useSubjects();
  const [formData, setFormData] = useState<TeacherAssignmentRequest>({
    teacherId: 0,
    subjectId: 0,
    academicYear: new Date().getFullYear().toString(),
    semester: SEMESTERS[0],
  });

  // Fetch reference data whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      refetchSubjects();
    }
  }, [isOpen, fetchTeachers, refetchSubjects]);

  // Reset formData when the modal transitions from closed -> open
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(
        initialData ?
          {
            teacherId: initialData.teacherId,
            subjectId: initialData.subjectId,
            academicYear: initialData.academicYear,
            semester: initialData.semester,
          }
        : {
            teacherId: 0,
            subjectId: 0,
            academicYear: new Date().getFullYear().toString(),
            semester: SEMESTERS[0],
          },
      );
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "teacherId" || name === "subjectId" ? parseInt(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl w-full max-w-md border border-[#E4E8F0] shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-[#E4E8F0]">
            <h2 className="text-xl font-semibold text-[#101625]">
              {initialData ? "Edit Assignment" : "New Assignment"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F4F6FA] rounded-lg">
              <FiX className="h-5 w-5 text-[#5A6478]" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#101625] mb-1.5">
                Teacher *
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none">
                <option value={0}>Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#101625] mb-1.5">
                Subject *
              </label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none">
                <option value={0}>Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#101625] mb-1.5">
                Academic Year *
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#101625] mb-1.5">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none">
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm text-[#5A6478] hover:text-[#101625]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] disabled:opacity-50 text-sm font-medium">
                {loading ?
                  "Saving..."
                : initialData ?
                  "Update"
                : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Export the component as default
const TeacherAssignments: React.FC = () => {
  const navigate = useNavigate();
  const {
    assignments,
    loading,
    error,
    clearError,
    loadAllAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useTeacherAssignments();

  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<
    TeacherAssignment | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    loadAllAssignments();
  }, [loadAllAssignments]);

  // Client-side filter by teacher name or subject name
  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return assignments;

    return assignments.filter((assignment) => {
      const teacherName = assignment.teacherName?.toLowerCase() || "";
      const subjectName = assignment.subjectName?.toLowerCase() || "";
      return teacherName.includes(term) || subjectName.includes(term);
    });
  }, [assignments, searchTerm]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <LoadingSpinner fullScreen label="Loading..." />
      </div>
    );
  }

  const handleCreate = () => {
    setEditingAssignment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: TeacherAssignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (assignment: TeacherAssignment) => {
    setAssignmentToDelete({
      id: assignment.id,
      name: `${assignment.teacherName || "Teacher"} - ${assignment.subjectName || "Subject"}`,
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;
    const success = await deleteAssignment(assignmentToDelete.id);
    setDeleteModalOpen(false);
    setAssignmentToDelete(null);
    if (success) {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Assignment Deleted",
        message: "Teacher assignment was deleted successfully.",
      });
    } else if (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Delete Failed",
        message: error,
      });
    }
  };

  const handleSubmit = async (data: TeacherAssignmentRequest) => {
    const result =
      editingAssignment ?
        await updateAssignment(editingAssignment.id, data)
      : await createAssignment(data);

    if (result) {
      setIsModalOpen(false);
      setAlert({
        isOpen: true,
        type: "success",
        title: editingAssignment ? "Assignment Updated" : "Assignment Created",
        message:
          editingAssignment ?
            "Teacher assignment was updated successfully."
          : "Teacher assignment was created successfully.",
      });
      await loadAllAssignments(); // <-- refetch so teacherName/subjectName are populated
    } else if (error) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Operation Failed",
        message: error,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#101625]">
              Teacher Assignments
            </h1>
            <p className="text-sm text-[#5A6478] mt-1">
              Manage teacher-subject assignments
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] text-sm font-medium">
            <FiPlus className="h-4 w-4" />
            New Assignment
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6478]" />
            <input
              type="text"
              placeholder="Search by teacher name or subject name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E4E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
            />
          </div>
        </div>

        {loading && assignments.length === 0 ?
          <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-[#E4E8F0]">
            <LoadingSpinner label="Loading assignments..." />
          </div>
        : filteredAssignments.length === 0 ?
          <div className="text-center py-12 bg-white rounded-xl border border-[#E4E8F0]">
            <FiUsers className="h-12 w-12 text-[#5A6478] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#101625] mb-2">
              {searchTerm ? "No matching assignments" : "No Assignments"}
            </h3>
            <p className="text-sm text-[#5A6478]">
              {searchTerm ?
                "Try adjusting your search"
              : "Create your first teacher assignment to get started."}
            </p>
          </div>
        : <div className="grid gap-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-[#E4E8F0] p-6 hover:border-[#3D6BFF]/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#101625]">
                      {assignment.teacherName ||
                        `Teacher #${assignment.teacherId}`}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-[#5A6478] flex items-center gap-1">
                        <FiBookOpen className="h-4 w-4" />
                        {assignment.subjectName ||
                          `Subject #${assignment.subjectId}`}
                      </span>
                      <span className="text-sm text-[#5A6478]">
                        {assignment.academicYear} - {assignment.semester}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 hover:bg-[#F4F6FA] rounded-lg text-[#5A6478] hover:text-[#101625]">
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(assignment)}
                      className="p-2 hover:bg-red-50 rounded-lg text-[#5A6478] hover:text-red-600">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }

        <AssignmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingAssignment}
          loading={loading}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Assignment"
          itemName={assignmentToDelete?.name}
          loading={loading}
          message="Are you sure you want to delete this teacher assignment? This action cannot be undone."
        />

        <AlertModal
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => {
            setAlert((prev) => ({ ...prev, isOpen: false }));
            if (alert.type === "error") clearError();
          }}
        />
      </div>
    </div>
  );
};

export default TeacherAssignments;
