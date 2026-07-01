// src/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  message: string;
  adminId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
}

export interface SignupResponse {
  message: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}
