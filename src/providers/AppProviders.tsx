"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import React, { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  // Recursively replace any <script> elements found in children with <template>
  // This prevents React from encountering HTMLScriptElement nodes during render
  // which causes the runtime error seen in dev: scripts inside React components
  // are never executed. We also log the occurrence for debugging.
  function sanitizeChildren(node: React.ReactNode): React.ReactNode {
    if (node === null || node === undefined || typeof node === "boolean")
      return node;

    if (typeof node === "string" || typeof node === "number") return node;

    if (Array.isArray(node)) {
      return node.map((child) => sanitizeChildren(child));
    }

    if (React.isValidElement(node)) {
      const { type, props } = node as React.ReactElement<any>;

      if (typeof type === "string" && type.toLowerCase() === "script") {
        // Log once to help locate the source component

        console.error(
          "Sanitized unexpected <script> element in React tree:",
          node,
        );
        return React.createElement("template", null);
      }

      if (props && props.children) {
        const cleanedChildren = sanitizeChildren(props.children);
        return React.cloneElement(node, { ...props }, cleanedChildren);
      }

      return node;
    }

    return node;
  }

  const safeChildren = sanitizeChildren(children);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NextTopLoader color="#E14D3D" showSpinner={false} />
            {safeChildren}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
