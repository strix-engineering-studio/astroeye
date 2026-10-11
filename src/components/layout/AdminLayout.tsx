import type { ReactNode, CSSProperties } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { CommandMenu } from "@/components/CommandMenu";
import { SiteHeader } from "@/components/site-header";
import { ScrollArea } from "../ui/scroll-area";
import { EnvironmentBanner } from "../environment-banner";

interface AdminLayoutProps {
  children: ReactNode;
}

// Server Component — no "use client" needed.
// SidebarProvider/AppSidebar/SiteHeader have their own client boundaries.
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "280px",
            "--sidebar-width-icon": "56px",
            "--header-height": "64px",
          } as CSSProperties
        }
        className="h-svh overflow-hidden"
      >
        <AppSidebar />
        <SidebarInset className="h-svh min-h-0 overflow-hidden">
          {/* Header */}
          <SiteHeader />
          <EnvironmentBanner />

          {/* Scrollable content */}
          <main className="flex min-h-full">
            <ScrollArea className="flex-1">
              <div className="pb-20">{children}</div>
            </ScrollArea>
          </main>
        </SidebarInset>
        <CommandMenu />
      </SidebarProvider>
    </div>
  );
}
