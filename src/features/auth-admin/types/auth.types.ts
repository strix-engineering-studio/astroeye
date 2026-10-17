import { IAdminUser } from "@/features/admins";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  user: IAdminUser;
}
