'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import packageJson from '../../package.json';
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
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';

const data = {
  user: {
    name: 'Admin',
    email: 'admin@hugged.app',
    avatar: '/avatars/admin.png',
  },

  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Users',
      url: '/users',
      icon: UsersIcon,
    },
    {
      title: 'Communities',
      url: '/communities',
      icon: UsersRoundIcon,
    },
    {
      title: 'Meets',
      url: '/meets',
      icon: Map,
    },
    {
      title: 'Feed',
      url: '/feed',
      icon: RssIcon,
    },
    {
      title: 'Webinars',
      url: '/webinars',
      icon: VideoIcon,
    },
    {
      title: 'Resources',
      url: '/resources',
      icon: LibraryBigIcon,
    },
    {
      title: 'Expert Requests',
      url: '/expert-requests',
      icon: Crown,
    },
    {
      title: 'Moderation',
      url: '/moderation',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: BellIcon,
    },
    {
      title: 'Team',
      url: '/admins',
      icon: CrownIcon,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2Icon,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:p-1.5">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/hugged-logo-512x512.png"
                  alt="HUGGED"
                  width={40}
                  height={40}
                  priority
                  className="rounded"
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold">HUGGED</span>
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
          Built by{' '}
          <Link
            href="https://strix.website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium"
          >
            Strix Engineering Studio
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
