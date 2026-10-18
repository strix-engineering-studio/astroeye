'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SearchIcon, LogOutIcon, Settings2Icon } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useCommandMenu } from '@/hooks/useCommandMenu';

const routeLabels: Record<string, string> = {
  users: 'Users',
  communities: 'Communities',
  meetups: 'Meets',
  feed: 'Feed',
  webinars: 'Webinars',
  resources: 'Resources',
  memberships: 'Memberships',
  coins: 'Coins',
  notifications: 'Notifications',
  moderation: 'Moderation',
  analytics: 'Analytics',
  settings: 'Settings',
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: 'Dashboard', href: '/', isCurrent: true }];
  }

  return segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    return { label, href, isCurrent: idx === segments.length - 1 };
  });
}

function getInitials(name?: string | null) {
  if (!name) return 'H';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}


export function ConsoleSiteHeader() {
  const breadcrumbs = useBreadcrumbs();
  const { open: openCommandMenu } = useCommandMenu();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 py-5">
        {/* Left — trigger + breadcrumbs */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 h-8 w-8" />
          <Separator orientation="vertical" className="mx-1 h-8" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <Fragment key={crumb.href}>
                  {idx > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.isCurrent ? (
                      <BreadcrumbPage className="text-foreground text-sm font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink >
                        <Link
                          href={crumb.href}
                          className="text-muted-foreground hover:text-foreground text-sm"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Center — search */}
        <Button
          variant="outline"
          onClick={openCommandMenu}
          className="text-muted-foreground hidden h-8 w-52 justify-between gap-2 border-dashed px-3 text-sm font-normal sm:flex lg:w-64"
          id="search-trigger"
          aria-label="Open search (⌘K)"
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="size-3.5 shrink-0" />
            <span>Search...</span>
          </div>
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          {/* <ThemeToggle /> */}
          {/* <NotificationsButton /> */}
          {/* <UserQuickMenu /> */}
        </div>
      </div>
    </header>
  );
}