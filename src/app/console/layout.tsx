import type { ReactNode } from "react";
import AdminAuthProvider from "@/providers/AdminAuthProvider";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
