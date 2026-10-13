"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ConfirmationResult } from "firebase/auth";

interface PhoneAuthContextValue {
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  setPendingVerification: (phone: string, result: ConfirmationResult) => void;
  clearPendingVerification: () => void;
}

const PhoneAuthContext = createContext<PhoneAuthContextValue | null>(null);

export function PhoneAuthProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const setPendingVerification = useCallback(
    (phone: string, result: ConfirmationResult) => {
      setPhoneNumber(phone);
      setConfirmationResult(result);
    },
    [],
  );

  const clearPendingVerification = useCallback(() => {
    setPhoneNumber("");
    setConfirmationResult(null);
  }, []);

  return (
    <PhoneAuthContext.Provider
      value={{
        phoneNumber,
        confirmationResult,
        setPendingVerification,
        clearPendingVerification,
      }}
    >
      {children}
    </PhoneAuthContext.Provider>
  );
}

export function usePhoneAuth() {
  const context = useContext(PhoneAuthContext);

  if (!context) {
    throw new Error("usePhoneAuth must be used inside PhoneAuthProvider");
  }

  return context;
}
