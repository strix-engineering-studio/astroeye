import { create } from "zustand";
import type { IAdminUser } from "@/features/admins";
import type { CustomerAuthUser } from "@/features/auth/types/auth.types";

export interface CustomerAuthStore {
  user: CustomerAuthUser | null;
  isLoading: boolean;
  setUser: (user: CustomerAuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface AdminAuthStore {
  adminUser: IAdminUser | null;
  isLoading: boolean;
  setAdminUser: (user: IAdminUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<CustomerAuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  adminUser: null,
  isLoading: true,
  setAdminUser: (adminUser) => set({ adminUser }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
