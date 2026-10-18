"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import packageJson from "../../package.json";
import {
  LayoutDashboardIcon,
  UsersIcon,
  VideoIcon,
  BellIcon,
  ShieldCheckIcon,
  Settings2Icon,
  RssIcon,
  CalendarDaysIcon,
  UsersRoundIcon,
  LibraryBigIcon,
  CrownIcon,
  Crown,
  LogsIcon,
  Menu,
  Map,
  Package,
  ShoppingBagIcon,
  Wallet,
  Tag,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";

const data = {
  user: {
    name: "Admin",
    email: "admin@MagicalStones.app",
    avatar: "/avatars/admin.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/console/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Customers",
      url: "/console/customers",
      icon: UsersIcon,
    },
    {
      title: "Products",
      url: "/console/products",
      icon: Package,
    },
    {
      title: "Coupons",
      url: "/console/coupons",
      icon: Tag,
    },
    {
      title: "Orders",
      url: "/console/orders",
      icon: ShoppingBagIcon,
    },
    {
      title: "Payments",
      url: "/console/payments",
      icon: Wallet,
    },

    {
      title: "Team",
      url: "/console/admins",
      icon: UsersRoundIcon,
    },
   
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/MagicalStones-logo-512x512.png"
                  alt="MagicalStones"
                  width={40}
                  height={40}
                  priority
                  className="rounded"
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold">MagicalStones</span>
                  <span className="text-muted-foreground text-xs">
                    Admin Console v{packageJson.version}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <p className="text-muted-foreground text-xs">
          Built by{" "}
          <Link
            href="https://strix.website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium"
          >
            MagicalStones
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
