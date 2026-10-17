"use client";

import React, { createContext, useContext, useEffect, useCallback, useMemo } from "react";
import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/lib/store/authStore";
import type { CustomerAuthUser } from "@/features/auth/types/auth.types";

export interface CustomerAuthContextType {
  user: CustomerAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setLoading(true);

      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
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
  }, [setLoading, setUser]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  const value = useMemo<CustomerAuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      logout,
      refreshUser,
    }),
    [user, isLoading, logout, refreshUser],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useAuth(): CustomerAuthContextType {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthProvider;
