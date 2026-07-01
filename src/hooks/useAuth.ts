// src/hooks/useAuth.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import type {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  ErrorResponse,
} from "../types/auth";
import { getValidationErrors } from "../utils/validation";

interface UseAuthReturn {
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: ErrorResponse | null;
  validationErrors: Record<string, string>;
  clearError: () => void;
  clearValidationErrors: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const clearError = () => setError(null);
  const clearValidationErrors = () => setValidationErrors({});

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const response: LoginResponse = await authApi.login(data);

      // Store token and user info
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.adminId,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
        }),
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err as ErrorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    // Validate input
    const errors = getValidationErrors(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
    );

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await authApi.signup(data);
      // Redirect to login after successful signup
      navigate("/login", {
        state: { message: "Account created successfully! Please login." },
      });
    } catch (err) {
      setError(err as ErrorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return {
    login,
    signup,
    logout,
    isLoading,
    error,
    validationErrors,
    clearError,
    clearValidationErrors,
  };
};
