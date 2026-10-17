"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";

import { clientAuth } from "@/lib/firebase/client";
import { usePhoneLogin } from "@/features/auth/hooks/useAuth";
import { usePhoneAuth } from "@/features/auth/context/phone-auth.context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VerifyOtp() {
  const router = useRouter();
  const phoneLogin = usePhoneLogin();

  const {
    phoneNumber,
    confirmationResult,
    setPendingVerification,
    clearPendingVerification,
  } = usePhoneAuth();

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (!phoneNumber || !confirmationResult) {
      router.replace("/login");
    }
  }, [phoneNumber, confirmationResult, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    return () => {
      verifierRef.current?.clear();
      verifierRef.current = null;
    };
  }, []);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit verification code.");
      return;
    }

    if (!confirmationResult) {
      setError("Your verification session has expired. Please try again.");
      return;
    }

    setIsVerifying(true);

    try {
      const credential = await confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();

      await phoneLogin.mutateAsync({ idToken });

      clearPendingVerification();
      router.replace("/account");
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String(err.code)
          : "";

      if (code === "auth/invalid-verification-code") {
        setError("Incorrect verification code. Please try again.");
      } else if (code === "auth/code-expired") {
        setError("The code has expired. Request a new verification code.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify the code. Please try again.",
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (
      !phoneNumber ||
      isResending ||
      resendCooldown > 0 ||
      !recaptchaRef.current
    ) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      verifierRef.current?.clear();

      const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
        size: "invisible",
      });

      verifierRef.current = verifier;

      const result = await signInWithPhoneNumber(clientAuth!, phoneNumber, verifier);

      setPendingVerification(phoneNumber, result);
      setOtp("");
      setResendCooldown(30);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the code. Please try again.",
      );

      verifierRef.current?.clear();
      verifierRef.current = null;
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeNumber = () => {
    verifierRef.current?.clear();
    verifierRef.current = null;
    clearPendingVerification();
    router.replace("/login");
  };

  if (!phoneNumber || !confirmationResult) {
    return null;
  }

  const isBusy = isVerifying || isResending || phoneLogin.isPending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] px-4 py-10">
      <Card className="w-full max-w-md border-stone-200 bg-white shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Verify your phone
            </h1>
            <p className="text-sm text-stone-500">
              Enter the six-digit code sent to
            </p>
            <p className="font-medium text-stone-900">{phoneNumber}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>

              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                className="h-12 text-center text-xl tracking-[0.5em]"
                disabled={isBusy}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-stone-900 text-white hover:bg-stone-800"
              disabled={isBusy || otp.length !== 6}
            >
              {isVerifying || phoneLogin.isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify and continue"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            {resendCooldown > 0 ? (
              <p className="text-stone-500">Resend code in {resendCooldown}s</p>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={isBusy}
                className="text-stone-900"
              >
                {isResending ? "Resending..." : "Resend verification code"}
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleChangeNumber}
            disabled={isBusy}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change phone number
          </Button>

          <div ref={recaptchaRef} />
        </CardContent>
      </Card>
    </main>
  );
}
