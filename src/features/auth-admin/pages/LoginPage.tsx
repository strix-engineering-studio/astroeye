
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/providers/AdminAuthProvider";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layout/AuthLayout";

import {
  type LoginFormValues,
  loginSchema,
} from "../schemas/auth.schema";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await login(data.email.trim(), data.password);

      toast.success("Login successful");

      // Replace the login page in browser history and refresh
      // server components so they read the newly created session.
      router.replace("/console");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full min-w-0 sm:min-w-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border">
            <Image
              src="/MagicalStones-logo-512x512.png"
              alt="MagicalStones logo"
              width={48}
              height={48}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>

          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  className="pl-10"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-destructive text-sm"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="pr-10 pl-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-destructive text-sm"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <div className="border-t pt-4">
              <p className="text-muted-foreground text-center text-xs">
                Crafted by{" "}
                <Link
                  href="https://strix.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground font-semibold transition-colors"
                >
                  Strix
                </Link>
              </p>
            </div>
          </CardContent>
        </form>
      </Card>
    </AuthLayout>
  );
}
