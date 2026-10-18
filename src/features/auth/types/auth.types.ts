// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CustomerAuthRequest {
  idToken: string;
}

export type CustomerAuthProvider = "google.com" | "phone";

export interface CustomerAuthUser {
  uid: string;
  id?: string;
  provider?: CustomerAuthProvider;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  fullName?: string;
  profileImageUrl?: string;
  membershipType?: string;
  isActive?: boolean;
  createdAt?: Date | string;
  preferences?: {
    themeMode?: "LIGHT" | "DARK" | "SYSTEM";
    languageCode?: string;
    notificationsEnabled?: boolean;
    emailNotificationsEnabled?: boolean;
    smsNotificationsEnabled?: boolean;
  };
}

export interface CustomerAuthResponse {
  user: CustomerAuthUser;
}
