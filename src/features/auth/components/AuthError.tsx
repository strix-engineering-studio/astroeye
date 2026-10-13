"use client";

import { AlertCircle, X } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AuthErrorProps {
  error: string | Error | null | undefined;
  onDismiss?: () => void;
}

export function AuthError({ error, onDismiss }: AuthErrorProps) {
  if (!error) return null;

  const message = error instanceof Error ? error.message : error;

  return (
    <Alert variant="destructive" className="relative pr-10">
      <AlertCircle className="h-4 w-4" />

      <AlertTitle>Authentication failed</AlertTitle>

      <AlertDescription>{message}</AlertDescription>

      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="absolute right-1 top-1 h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
}