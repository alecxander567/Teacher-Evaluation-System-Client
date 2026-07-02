// src/pages/Teachers.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTeacher } from "../hooks/useTeacher";
import { TeacherList } from "../components/teachers/TeacherList";
import { TeacherForm } from "../components/teachers/TeacherForm";
import { FiArrowLeft, FiLogOut, FiBell, FiUser } from "react-icons/fi";
import type { Teacher, TeacherRequest } from "../types/teacher";
import { EvalMark } from "../components/icons/EvalMark";
import { AlertModal } from "../components/AlertModal";

export const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const {
    teachers,
    loading,
    error,
    fetchTeachers,
    searchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    clearError,
  } = useTeacher();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchTeachers();
  }, [navigate, fetchTeachers]);

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

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      const success = await deleteTeacher(id);
      if (success) {
        // Refresh list
        if (searchTerm.trim()) {
          searchTeachers(searchTerm);
        } else {
          fetchTeachers();
        }
      }
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

  const handleLogout = () => {
    logout();
  };

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

        {/* Teacher List */}
        <TeacherList
          teachers={teachers}
          loading={loading}
          onAdd={handleAddTeacher}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
          onSearch={handleSearch}
          searchTerm={searchTerm}
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
