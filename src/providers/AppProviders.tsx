"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import { PhoneAuthProvider } from "../features/auth/context/phone-auth.context";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
            
          <AuthProvider>
            <PhoneAuthProvider>
            {children}
            </PhoneAuthProvider>
            <Toaster position="top-center" richColors />
          </AuthProvider>
      
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
