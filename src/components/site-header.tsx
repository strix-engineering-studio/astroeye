"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  GitBranch,
  Link2,
  Menu,
  PhoneOutgoing,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  {
    label: "System",
    href: "/systems",
  },
  {
    label: "Case Study",
    href: "/case-studies",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Open Source",
    href: "/open-source",
  },
  {
    label: "About",
    href: "/about",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/strix-engineering-studio",
    icon: GitBranch,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/strix-engineering-studio/",
    icon: Link2,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/strix.website/",
    icon: PhoneOutgoing,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/astrology")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-4 sm:px-4 lg:px-6">
      <div
        className="
          mx-auto
          max-w-7xl
          rounded
          border
          border-border
          bg-background/95
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
        "
      >
        {/* Main Header */}
        <div
          className="
            grid
            items-center
            gap-3
            px-4
            py-3
            sm:px-5
            lg:grid-cols-[auto_minmax(0,1fr)_auto]
            lg:px-6
          "
        >
          {/* Brand */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/strix.svg"
              width={36}
              height={36}
              alt="Astroeye"
              priority
            />

            <div className="hidden sm:block">
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-primary
                "
              >
                STRIX
              </p>

              <p className="text-sm text-foreground/60">
                System Before Software
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden min-w-0 items-center justify-center gap-1 lg:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `
                      relative
                      whitespace-nowrap
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.24em]
                      transition-colors
                    `,
                    active
                      ? `
                        text-primary
                        after:absolute
                        after:bottom-0
                        after:left-3
                        after:right-3
                        after:h-px
                        after:bg-primary
                      `
                      : "text-foreground/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Social System */}
          <div className="hidden items-center justify-end gap-1 lg:flex">
            <div className="mr-2 h-4 w-px bg-border" />

            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Astroeye on ${social.label}`}
                  className="
                    group
                    relative
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded
                    text-foreground/45
                    transition-all
                    duration-200
                    hover:bg-primary/10
                    hover:text-primary
                  "
                >
                  <Icon className="h-[15px] w-[15px] transition-transform duration-200 group-hover:scale-110" />

                  {/* Technical hover indicator */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-1
                      left-1/2
                      h-px
                      w-0
                      -translate-x-1/2
                      bg-primary
                      transition-all
                      duration-200
                      group-hover:w-3
                    "
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="
              justify-self-end
              rounded
              border
              border-border
              p-2
              text-foreground/70
              transition
              hover:border-primary/40
              hover:text-primary
              lg:hidden
            "
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open ? (
          <div className="border-t border-border px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      `
                        flex
                        items-center
                        justify-between
                        rounded
                        px-3
                        py-3
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.24em]
                        transition
                      `,
                      active
                        ? "bg-primary/10 text-primary"
                        : `
                          text-foreground/70
                          hover:bg-black/5
                          hover:text-foreground
                          dark:hover:bg-white/5
                        `,
                    )}
                  >
                    <span>{item.label}</span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Social */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.25em]
                    text-foreground/35
                  "
                >
                  Connect / Astroeye
                </span>

                <span
                  className="
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.2em]
                    text-foreground/25
                  "
                >
                  03
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="
                        group
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded
                        border
                        border-border
                        px-3
                        py-3
                        text-foreground/55
                        transition
                        hover:border-primary/30
                        hover:bg-primary/5
                        hover:text-primary
                      "
                    >
                      <Icon className="h-3.5 w-3.5" />

                      <span
                        className="
                          text-[9px]
                          font-medium
                          uppercase
                          tracking-[0.16em]
                        "
                      >
                        {social.label}
                      </span>

                      <ArrowUpRight
                        className="
                          h-3
                          w-3
                          opacity-0
                          transition
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
