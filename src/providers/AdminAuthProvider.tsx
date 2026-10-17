"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import type { IAdminUser } from "@/features/admins";
import { useAdminAuthStore } from "@/lib/store/authStore";
import { adminAuthService } from "@/features/auth-admin/services/adminAuthService";

export interface AdminAuthContextType {
  user: IAdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<IAdminUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const { adminUser, isLoading, setAdminUser, setLoading } = useAdminAuthStore();

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await adminAuthService.getCurrentUser();
      setAdminUser(currentUser);
    } catch {
      setAdminUser(null);
    }
  }, [setAdminUser]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setLoading(true);

      try {
        const currentUser = await adminAuthService.getCurrentUser();

        if (isMounted) {
          setAdminUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setAdminUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setLoading, setAdminUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<IAdminUser> => {
      setLoading(true);

      try {
        const user = await adminAuthService.login({ email, password });

        setAdminUser(user);

        return user;
      } catch (error) {
        setAdminUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setAdminUser],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await adminAuthService.logout();
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setAdminUser]);

  const value = useMemo<AdminAuthContextType>(
    () => ({
      user: adminUser,
      isLoading,
      isAuthenticated: Boolean(adminUser),
      login,
      logout,
      refreshUser,
    }),
    [adminUser, isLoading, login, logout, refreshUser],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used within an AdminAuthProvider",
    );
  }

  return context;
}

export default AdminAuthProvider;