"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "../hooks/useAuth";
import { AuthError } from "./AuthError";
import { PersonStanding } from "lucide-react";

interface GoogleSignInButtonProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export function GoogleSignInButton({
  redirectTo = "/account",
  onSuccess,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const googleLogin = useGoogleLogin();

  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSigningIn || googleLogin.isPending) return;

    setError(null);
    setIsSigningIn(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const credential = await signInWithPopup(auth, provider);
      const idToken = await credential.user.getIdToken();

      // The backend verifies the token and sets the session cookie.
      await googleLogin.mutateAsync({ idToken });

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

      if (code === "auth/popup-closed-by-user") {
        return;
      }

      if (code === "auth/popup-blocked") {
        setError(
          "Your browser blocked the sign-in popup. Please allow popups and try again.",
        );
      } else if (code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for Firebase authentication.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to sign in with Google. Please try again.",
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const isPending = isSigningIn || googleLogin.isPending;

  return (
    <div className="space-y-3">
      <AuthError error={error} onDismiss={() => setError(null)} />

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        <PersonStanding className="mr-2 h-4 w-4" />

        {isPending ? "Connecting to Google..." : "Continue with Google"}
      </Button>
    </div>
  );
}
