// src/pages/Teachers.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../hooks/useTeacher";
import { TeacherList } from "../components/teachers/TeacherList";
import { TeacherForm } from "../components/teachers/TeacherForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FiArrowLeft } from "react-icons/fi";
import type { Teacher, TeacherRequest } from "../types/teacher";
import { Navbar } from "../components/Navbar";
import { AlertModal } from "../components/AlertModal";

export const Teachers: React.FC = () => {
  const navigate = useNavigate();

  // Initialize user from localStorage directly
  const [user] = useState<{
    firstName: string;
    lastName: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    teachers,
    loading,
    error,
    departmentNames,
    fetchTeachers,
    searchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    clearError,
  } = useTeacher();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchTeachers(term);
    } else {
      fetchTeachers();
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const teacher = teachers.find((t) => t.id === id);
    if (teacher) {
      setTeacherToDelete({
        id: teacher.id,
        name: teacher.fullName,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;

    const success = await deleteTeacher(teacherToDelete.id);
    setDeleteModalOpen(false);
    setTeacherToDelete(null);

    if (success) {
      setAlert({
        type: "success",
        title: "Teacher Deleted",
        message: `${teacherToDelete.name} has been deleted successfully.`,
      });
      // Refresh list
      if (searchTerm.trim()) {
        searchTeachers(searchTerm);
      } else {
        fetchTeachers();
      }
    } else if (error) {
      setAlert({
        type: "error",
        title: "Delete Failed",
        message: error || "Failed to delete teacher. Please try again.",
      });
    }
  };

  const handleFormSubmit = async (data: TeacherRequest) => {
    let result: Teacher | undefined;
    if (editingTeacher) {
      result = await updateTeacher(editingTeacher.id, data);
    } else {
      result = await createTeacher(data);
    }

    if (result) {
      setAlert({
        type: "success",
        title: editingTeacher ? "Teacher Updated" : "Teacher Added",
        message: `${result.fullName} has been ${
          editingTeacher ? "updated" : "added"
        } successfully.`,
      });
      setIsFormOpen(false);
      setEditingTeacher(null);
    } else if (error) {
      setAlert({
        type: "error",
        title: "Operation Failed",
        message: error,
      });
    }

    // Refresh list
    if (searchTerm.trim()) {
      searchTeachers(searchTerm);
    } else {
      fetchTeachers();
    }
  };

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

        {/* Teacher List */}
        <TeacherList
          teachers={teachers}
          loading={loading}
          onAdd={handleAddTeacher}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          departmentNames={departmentNames}
        />
      </div>

      {/* Teacher Form Modal */}
      <TeacherForm
        isOpen={isFormOpen}
        teacher={editingTeacher}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTeacher(null);
        }}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTeacherToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        itemName={teacherToDelete?.name}
        confirmText="Delete Teacher"
        loading={loading}
        message={`Are you sure you want to delete the teacher "${teacherToDelete?.name}"? This action cannot be undone.`}
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
