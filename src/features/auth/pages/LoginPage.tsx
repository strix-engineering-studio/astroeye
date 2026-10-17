"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { LoaderCircle, Phone, Sparkles, User } from "lucide-react";

import { clientAuth } from "@/lib/firebase/client";
import { useGoogleLogin } from "@/features/auth/hooks/useAuth";
import { usePhoneAuth } from "@/features/auth/context/phone-auth.context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const router = useRouter();
  const googleLogin = useGoogleLogin();
  const { setPendingVerification } = usePhoneAuth();

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(
        clientAuth!,
        new GoogleAuthProvider(),
      );

      const idToken = await result.user.getIdToken();

      await googleLogin.mutateAsync({ idToken });

      router.replace("/account");
    } catch (err) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String(err.code)
          : "";

      if (code === "auth/popup-closed-by-user") {
        return;
      }

      setError(
        err instanceof Error ? err.message : "Unable to sign in with Google.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = phoneNumber.trim();

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError(
        "Enter a valid phone number with country code, e.g. +919876543210.",
      );
      return;
    }

    setIsSendingOtp(true);

    try {
      if (!recaptchaRef.current) {
        throw new Error(
          "Phone verification is not ready. Refresh and try again.",
        );
      }

      verifierRef.current?.clear();

      const verifier = new RecaptchaVerifier(
        clientAuth!,
        recaptchaRef.current,
        {
          size: "invisible",
        },
      );

      verifierRef.current = verifier;

      const confirmationResult = await signInWithPhoneNumber(
        clientAuth!,
        normalizedPhone,
        verifier,
      );

      setPendingVerification(normalizedPhone, confirmationResult);

      router.push("/verify");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send the OTP. Please try again.",
      );

      verifierRef.current?.clear();
      verifierRef.current = null;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const isBusy = isGoogleLoading || googleLogin.isPending;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] px-4 py-10">
      <Card className="w-full max-w-md border-stone-200 bg-white shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Welcome to MagicalStones
            </h1>
            <p className="text-sm text-stone-500">
              Sign in to continue your spiritual journey.
            </p>
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

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            disabled={isBusy || isSendingOtp}
            onClick={handleGoogleLogin}
          >
            {isBusy ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-stone-400">
              OR
            </span>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+919876543210"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="h-11 pl-10"
                  disabled={isSendingOtp || isBusy}
                  required
                />
              </div>

              <p className="text-xs text-stone-500">
                Include your country code.
              </p>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-stone-900 text-white hover:bg-stone-800"
              disabled={isSendingOtp || isBusy}
            >
              {isSendingOtp ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Continue with phone"
              )}
            </Button>
          </form>

          <div ref={recaptchaRef} />

          <p className="text-center text-xs leading-relaxed text-stone-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
