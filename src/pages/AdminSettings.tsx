// src/pages/AdminSettings.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import type { AdminUpdateData } from "../services/adminService";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertModal } from "../components/AlertModal";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const { admin, loading, updateProfile, isUpdating } = useAdmin();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [alertModal, setAlertModal] = useState<{
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

  // Populate form when admin data is loaded (syncing local form state
  // from data fetched asynchronously by useAdmin — not a cascading update)
  useEffect(() => {
    if (admin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing form from freshly-loaded async data
      setFormData({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        email: admin.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [admin]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = "First name cannot exceed 100 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = "Last name cannot exceed 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email cannot exceed 255 characters";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: AdminUpdateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(updateData);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setAlertModal({
        isOpen: true,
        type: "success",
        title: "Profile Updated!",
        message: "Your profile has been updated successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      setAlertModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: errorMessage || "Failed to update profile. Please try again.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const closeAlertModal = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <LoadingSpinner fullScreen label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <nav className="bg-gradient-to-b from-[#0A0E1A] to-[#121A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[#8E97AE] hover:text-white">
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-[#F4F6FA]">
                Admin Settings
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#101625] mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5A6478] mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97AE] h-4 w-4" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.firstName ?
                          "border-red-500 focus:ring-red-200"
                        : "border-[#E4E8F0] focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
                      }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A6478] mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97AE] h-4 w-4" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.lastName ?
                          "border-red-500 focus:ring-red-200"
                        : "border-[#E4E8F0] focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#5A6478] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97AE] h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      errors.email ?
                        "border-red-500 focus:ring-red-200"
                      : "border-[#E4E8F0] focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="border-t border-[#E4E8F0] pt-6">
              <h2 className="text-lg font-semibold text-[#101625] mb-4">
                Change Password
              </h2>
              <p className="text-sm text-[#5A6478] mb-4">
                Leave password fields blank to keep current password
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#5A6478] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97AE] h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      errors.password ?
                        "border-red-500 focus:ring-red-200"
                      : "border-[#E4E8F0] focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
                    }`}
                    placeholder="Enter new password (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E97AE] hover:text-[#101625] transition-colors">
                    {showPassword ?
                      <FiEyeOff className="h-4 w-4" />
                    : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A6478] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97AE] h-4 w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ?
                        "border-red-500 focus:ring-red-200"
                      : "border-[#E4E8F0] focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF]"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E97AE] hover:text-[#101625] transition-colors">
                    {showConfirmPassword ?
                      <FiEyeOff className="h-4 w-4" />
                    : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#E4E8F0]">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3D6BFF] hover:bg-[#2A5AF0] text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isUpdating ?
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                : <>
                    <FiSave className="h-4 w-4" />
                    Save Changes
                  </>
                }
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 text-[#5A6478] hover:text-[#101625] font-medium text-sm transition-colors">
                Cancel
              </button>
            </div>

            <div className="mt-4 p-4 bg-[#F4F6FA] rounded-lg">
              <p className="text-sm text-[#5A6478]">
                <span className="font-medium">Role:</span> {admin?.role}
              </p>
              <p className="text-xs text-[#8E97AE] mt-1">
                Last updated:{" "}
                {admin?.updatedAt ?
                  new Date(admin.updatedAt).toLocaleString()
                : "Never"}
              </p>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        autoClose={4000}
      />
    </div>
  );
};

export default AdminSettings;
