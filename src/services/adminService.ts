// src/services/adminService.ts
export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface AdminResponse {
  message?: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export class AdminService {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  private static async parseErrorMessage(
    response: Response,
    fallback: string,
  ): Promise<string> {
    const errorText = await response.text();

    if (!errorText) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(errorText);
      return parsed?.message || parsed?.error || errorText;
    } catch {
      return errorText;
    }
  }

  static async getProfile(): Promise<Admin> {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const message = await this.parseErrorMessage(
        response,
        `Failed to fetch profile: ${response.status} ${response.statusText}`,
      );
      throw new Error(message);
    }

    return await response.json();
  }

  static async updateProfile(data: AdminUpdateData): Promise<AdminResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = await this.parseErrorMessage(
        response,
        `Failed to update profile: ${response.status} ${response.statusText}`,
      );
      throw new Error(message);
    }

    const result = await response.json();
    return result.admin || result;
  }
}
