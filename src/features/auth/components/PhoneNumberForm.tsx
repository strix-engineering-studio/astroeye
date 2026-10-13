"use client";

import { useEffect, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { ArrowRight, Phone } from "lucide-react";

import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from "./AuthError";

interface PhoneNumberFormProps {
  onCodeSent: (
    confirmationResult: ConfirmationResult,
    phoneNumber: string,
  ) => void;
}

export function PhoneNumberForm({ onCodeSent }: PhoneNumberFormProps) {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recaptchaContainerRef.current) return;

    const verifier = new RecaptchaVerifier(
      auth,
      recaptchaContainerRef.current,
      {
        size: "invisible",
        callback: () => {
          // Firebase handles successful reCAPTCHA verification.
        },
        "expired-callback": () => {
          setError("Verification expired. Please try again.");
        },
      },
    );

    verifierRef.current = verifier;
    let mounted = true;

    void verifier
      .render()
      .then(() => {
        if (mounted) setIsRecaptchaReady(true);
      })
      .catch(() => {
        if (mounted) {
          setError(
            "Unable to initialize phone verification. Please refresh the page.",
          );
        }
      });

    return () => {
      mounted = false;
      verifier.clear();
      verifierRef.current = null;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = phoneNumber.trim();

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError(
        "Enter a valid international phone number, including the country code. Example: +919876543210.",
      );
      return;
    }

    const verifier = verifierRef.current;

    if (!verifier || !isRecaptchaReady) {
      setError("Phone verification is still initializing. Try again shortly.");
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        normalizedPhone,
        verifier,
      );

      onCodeSent(confirmationResult, normalizedPhone);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send the verification code. Please try again.",
      );

      // Recreate the verifier after a failed attempt so a stale
      // reCAPTCHA challenge does not block subsequent attempts.
      verifierRef.current?.clear();
      verifierRef.current = null;
      setIsRecaptchaReady(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthError error={error} onDismiss={() => setError(null)} />

      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone number</Label>

        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            id="phone-number"
            type="tel"
            autoComplete="tel"
            placeholder="+919876543210"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="h-11 pl-10"
            required
            disabled={isSending}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Include your country code. For India, use +91.
        </p>
      </div>

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={!isRecaptchaReady || isSending}
      >
        {isSending ? "Sending code..." : "Send verification code"}
        {!isSending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <div ref={recaptchaContainerRef} />
    </form>
  );
}
