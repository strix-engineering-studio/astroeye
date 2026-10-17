import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

// Server Component — no "use client" needed.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">MagicalStones Console</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your projects and resources</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © 2024 MagicalStones. All rights reserved.
      </p>
    </div>
  );
}
