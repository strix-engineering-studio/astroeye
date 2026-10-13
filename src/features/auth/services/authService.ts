import { apiClient } from "@/lib/api/client";
import type { IAdminUser } from "@/features/admins";
import {
  LoginRequest,
  CustomerAuthRequest,
  CustomerAuthResponse,
  CustomerAuthUser,
} from "../types/auth.types";

// --------------------------------------------------
// AUTH SERVICE
// --------------------------------------------------

export const authService = {
  /**
   * Admin login using email and password.
   * The backend validates the admin profile.
   */
  login: (data: LoginRequest) =>
    apiClient.post<IAdminUser>("/auth/login", data),

  /**
   * Customer signup/login using Google.
   * The client must first authenticate with Firebase
   * and obtain an ID token.
   */
  loginWithGoogle: (data: CustomerAuthRequest) =>
    apiClient.post<CustomerAuthResponse>("/auth/customer/google", data),

  /**
   * Customer signup/login using phone OTP.
   * The client must first verify the OTP through Firebase
   * and obtain an ID token.
   */
  loginWithPhoneNumber: (data: CustomerAuthRequest) =>
    apiClient.post<CustomerAuthResponse>("/auth/customer/phone", data),

  /**
   * Logout the current session.
   */
  logout: () => apiClient.post<void>("/auth/logout", {}),

  /**
   * Retrieve the currently authenticated user.
   */
  getCurrentUser: () =>
    apiClient.get<IAdminUser | CustomerAuthUser | null>("/auth/me"),
};
