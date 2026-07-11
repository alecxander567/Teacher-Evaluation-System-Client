// src/types/admin.ts
export interface IAdmin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface IAdminResponse {
  message?: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApiError {
  error: string;
  message: string;
  status: number;
}
