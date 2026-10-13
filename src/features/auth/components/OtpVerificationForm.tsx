"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePhoneLogin } from "../hooks/useAuth";
import { AuthError } from "./AuthError";


interface OtpVerificationFormProps {
  confirmationResult: ConfirmationResult;
  phoneNumber: string;
  redirectTo?: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export function OtpVerificationForm({
  confirmationResult,
  phoneNumber,
  redirectTo = "/account",
  onBack,
  onSuccess,
}: OtpVerificationFormProps) {
  const router = useRouter();
  const phoneLogin = usePhoneLogin();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit verification code.");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      // Firebase validates the OTP and signs in the phone user.
      const credential = await confirmationResult.confirm(otp);

      // Exchange the Firebase ID token for a backend session.
      const idToken = await credential.user.getIdToken();

      await phoneLogin.mutateAsync({ idToken });

      if (onSuccess) {
        onSuccess();
      } else {
        router.replace(redirectTo);
      }
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String(err.code)
          : "";

      if (
        code === "auth/invalid-verification-code" ||
        code === "auth/code-expired"
      ) {
        setError(
          code === "auth/code-expired"
            ? "This verification code has expired. Request a new code."
            : "Incorrect verification code. Please try again.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Phone verification failed. Please try again.",
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const isPending = isVerifying || phoneLogin.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isPending}
          className="-ml-3"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change phone number
        </Button>

        <h2 className="text-xl font-semibold tracking-tight">
          Verify your phone
        </h2>

        <p className="text-sm text-muted-foreground">
          Enter the six-digit code sent to{" "}
          <span className="font-medium text-foreground">{phoneNumber}</span>.
        </p>
      </div>

      <AuthError error={error} onDismiss={() => setError(null)} />

      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification code</Label>

        <Input
          id="verification-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError(null);
          }}
          className="h-12 text-center text-xl tracking-[0.4em]"
          required
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={isPending || otp.length !== 6}
      >
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify and continue"
        )}
      </Button>
    </form>
  );
}
