"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { astrologyConfig, astrologyContent } from "@/content/astrology/profile";

const navigation = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export function AstrologyHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-6xl rounded-[18px] border border-[#E2E6EF] bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-[#252A35] dark:bg-[#10131A]/90 dark:shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6">
          <Link href="#home" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#0038FD]/20 bg-[#0038FD]/5">
              <div className="absolute h-7 w-7 rounded-full border border-[#0038FD]/40" />
              <div className="absolute h-[2.4rem] w-[2.4rem] rounded-full border border-[#0038FD]/20" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-[#0038FD]" />
              <span className="relative text-[0.72rem] font-semibold tracking-[0.28em] text-[#0038FD]">
                A
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#0038FD] dark:text-[#8AB4FF]">
                {astrologyContent.brand}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#667085] transition hover:text-[#0A0D14] dark:text-[#98A2B3] dark:hover:text-[#F8FAFF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ThemeToggle className="flex items-center gap-1 rounded-full border border-[#E2E6EF] bg-white/60 p-1 shadow-sm backdrop-blur-xl dark:border-[#252A35] dark:bg-[#0B0F16]" />
            </div>

            <a
              href={astrologyConfig.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-[#0038FD] px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#1649FF] lg:inline-flex"
            >
              Join WhatsApp
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E6EF] bg-white/80 text-[#0A0D14] transition hover:border-[#0038FD]/25 hover:text-[#0038FD] dark:border-[#252A35] dark:bg-[#10131A] dark:text-[#F8FAFF] lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-[#E2E6EF] px-4 py-4 lg:hidden dark:border-[#252A35]">
            <div className="mb-3 flex justify-end">
              <ThemeToggle className="flex items-center gap-1 rounded-full border border-[#E2E6EF] bg-white/80 p-1 shadow-sm backdrop-blur-xl dark:border-[#252A35] dark:bg-[#0B0F16]" />
            </div>
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full px-3 py-3 text-sm font-medium text-[#0A0D14] transition hover:bg-[#F3F6FB] dark:text-[#F8FAFF] dark:hover:bg-[#171D28]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={astrologyConfig.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#0038FD] px-4 py-3 text-sm font-medium text-white"
              >
                Join WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
