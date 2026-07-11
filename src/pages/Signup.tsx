// src/pages/Signup.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiUserCheck,
  FiArrowRight,
} from "react-icons/fi";

// Signature mark — kept identical to Login so the pair reads as one system.
const EvalMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="24"
      cy="24"
      r="19"
      stroke="#3D6BFF"
      strokeWidth="2.5"
      strokeOpacity="0.35"
    />
    <path
      d="M24 5a19 19 0 0 1 16.45 28.4"
      stroke="#3D6BFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15.5 24.5l5.5 5.5L32.5 18"
      stroke="#3D6BFF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const {
    signup,
    isLoading,
    error,
    validationErrors,
    clearError,
    clearValidationErrors,
  } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    clearError();
    clearValidationErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: "admin",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
      {/* Left — identity panel */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] text-[#F4F6FA] flex flex-col justify-between md:w-[44%] px-10 py-12 md:px-16 md:py-16">
        {/* Sapphire glow — a quiet light in the nightfall field */}
        <div
          className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
          style={{ background: "#3D6BFF" }}
        />
        <EvalMark className="pointer-events-none absolute -right-20 -bottom-20 w-[380px] h-[380px] opacity-[0.06]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-full bg-[#121A2E] ring-1 ring-[#3D6BFF]/30 flex items-center justify-center">
              <EvalMark className="w-6 h-6" />
            </div>
            <span
              className="text-[11px] font-medium tracking-[0.2em] text-[#6E8CFF] uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              }}>
              Secure Access
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            SPCT Evaluation
            <br />
            System
          </h1>
          <p className="mt-5 text-[#8E97AE] text-base leading-relaxed max-w-sm">
            Administrator accounts get full visibility into every submission and
            its score.
          </p>
        </div>

        <p
          className="relative text-[11px] text-[#4C5468] tracking-[0.15em] uppercase"
          style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Authorized personnel only
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-sm bg-[#FBFCFE] rounded-3xl px-8 py-9 md:px-10 md:py-10">
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold text-[#101625] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Create account
            </h2>
            <p className="text-[#5A6478] mt-1.5 text-sm">
              Set up administrator access to the system.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-[#FBEEF0] border border-[#F0CBD1] rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-[#C4536A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#9A3A50]">
                  {error.error}
                </p>
                <p className="text-sm text-[#B65A70]">{error.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              icon={FiUser}
              error={validationErrors.firstName}
              disabled={isLoading}
            />

            <AuthInput
              id="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              icon={FiUserCheck}
              error={validationErrors.lastName}
              disabled={isLoading}
            />

            <AuthInput
              id="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              icon={FiMail}
              error={validationErrors.email}
              disabled={isLoading}
            />

            <AuthInput
              id="password"
              type="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              icon={FiLock}
              error={validationErrors.password}
              disabled={isLoading}
            />

            <AuthButton
              type="submit"
              icon={FiArrowRight}
              isLoading={isLoading}
              disabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.password
              }
              fullWidth>
              Create Account
            </AuthButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#5A6478]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#101625] hover:text-[#3D6BFF] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
