import type { ReactNode } from "react";
import { PhoneAuthProvider } from "@/features/auth/context/phone-auth.context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PhoneAuthProvider>{children}</PhoneAuthProvider>;
}
