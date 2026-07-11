// src/hooks/useAdmin.ts
import { useState, useEffect, useCallback } from "react";
import { AdminService } from "../services/adminService";
import type {
  Admin,
  AdminUpdateData,
  AdminResponse,
} from "../services/adminService";

interface UseAdminReturn {
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: AdminUpdateData) => Promise<AdminResponse>;
  refreshProfile: () => Promise<Admin>;
  isUpdating: boolean;
}

export function useAdmin(): UseAdminReturn {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await AdminService.getProfile();
      setAdmin(profile);

      // Update localStorage with new user data
      const userData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        role: profile.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      console.error("Error fetching admin profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: AdminUpdateData): Promise<AdminResponse> => {
      try {
        setIsUpdating(true);
        setError(null);
        const result = await AdminService.updateProfile(data);

        // Refresh profile after successful update
        await refreshProfile();

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshProfile],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount, not a cascading update
    refreshProfile();
  }, [refreshProfile]);

  return {
    admin,
    loading,
    error,
    updateProfile,
    refreshProfile,
    isUpdating,
  };
}
