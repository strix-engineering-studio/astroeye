
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Gemstones", href: "/categories/gemstones" },
  { label: "Rudraksha", href: "/categories/rudraksha" },
  {
    label: "Spiritual Jewellery",
    href: "/categories/spiritual-jewellery",
  },
  { label: "Yantras", href: "/categories/yantras" },
  { label: "Puja Essentials", href: "/categories/puja-essentials" },
  { label: "Books", href: "/categories/books" },
];

const marketplaces = [
  {
    label: "Amazon",
    href: "https://www.amazon.in/",
  },
  {
    label: "Myntra",
    href: "https://www.myntra.com/",
  },
  {
    label: "Flipkart",
    href: "https://www.flipkart.com/",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keep the storefront header separate from the admin console.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/console")
  ) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DED0] bg-[#FCFAF6]/95 backdrop-blur-xl">
      {/* Announcement bar */}
      <div className="bg-[#29251F] px-3 py-2 text-center">
        <p className="text-[10px] font-medium tracking-[0.08em] text-[#F5E7D0] sm:text-xs">
          Discover spiritual essentials, gemstones and meaningful finds
        </p>
      </div>

      {/* Marketplace links */}
      <div className="hidden border-b border-[#E8DED0] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#827565]">
            Shop MagicalStones on
          </p>

          <div className="flex items-center gap-5">
            {marketplaces.map((marketplace) => (
              <a
                key={marketplace.label}
                href={marketplace.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#625546] transition hover:text-[#9D693A]"
              >
                {marketplace.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-4 py-3 lg:grid-cols-[auto_minmax(180px,1fr)_auto] lg:gap-8">
          {/* Brand */}
          <Link
            href="/"
            aria-label="MagicalStones home"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D7BE99] bg-[#F3E8D6] font-serif text-2xl text-[#956537]">
              ✧
            </span>

            <span className="min-w-0">
              <span className="block font-serif text-xl font-semibold leading-tight tracking-tight text-[#29251F] sm:text-2xl">
                MagicalStones
              </span>
              <span className="mt-1 hidden text-[9px] uppercase tracking-[0.17em] text-[#8D7B65] sm:block">
                Astrology · Gemstones · Spiritual Living
              </span>
            </span>
          </Link>

          {/* Desktop search */}
          <form
            action="/search"
            method="GET"
            role="search"
            className="hidden min-w-0 lg:block"
          >
            <label htmlFor="header-product-search" className="sr-only">
              Search products
            </label>

            <div className="flex h-11 items-center rounded-full border border-[#E5D9C8] bg-white px-4 transition focus-within:border-[#B28A5B]">
              <Search className="h-4 w-4 shrink-0 text-[#8D7B65]" />

              <input
                id="header-product-search"
                type="search"
                name="q"
                placeholder="Search gemstones, Rudraksha, jewellery..."
                className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-[#29251F] outline-none placeholder:text-[#A49A8D]"
              />

              <button
                type="submit"
                className="ml-2 text-xs font-semibold text-[#956537] transition hover:text-[#684626]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Shopping actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#514538] transition hover:bg-[#F1E7D9] lg:hidden"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            <Link
              href="/account"
              aria-label="My account"
              className="hidden h-10 items-center justify-center gap-2 rounded-full px-3 text-sm text-[#514538] transition hover:bg-[#F1E7D9] sm:flex"
            >
              <UserRound className="h-[18px] w-[18px]" />
              <span className="hidden xl:inline">Account</span>
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="flex h-10 items-center justify-center gap-2 rounded-full px-2 text-[#514538] transition hover:bg-[#F1E7D9] sm:px-3"
            >
              <ShoppingBag className="h-[19px] w-[19px]" />
              <span className="hidden text-sm xl:inline">Cart</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D9C8] text-[#514538] transition hover:bg-[#F1E7D9] lg:hidden"
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form
            action="/search"
            method="GET"
            role="search"
            className="pb-4 lg:hidden"
          >
            <label htmlFor="mobile-product-search" className="sr-only">
              Search products
            </label>

            <div className="flex h-11 items-center rounded-full border border-[#E5D9C8] bg-white px-4">
              <Search className="h-4 w-4 shrink-0 text-[#8D7B65]" />

              <input
                id="mobile-product-search"
                type="search"
                name="q"
                placeholder="Search products..."
                className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A49A8D]"
              />

              <button
                type="submit"
                className="ml-2 text-xs font-semibold text-[#956537]"
              >
                Search
              </button>
            </div>
          </form>
        )}

        {/* Desktop category navigation */}
        <nav
          aria-label="Product categories"
          className="hidden items-center justify-between gap-1 overflow-x-auto border-t border-[#E8DED0] py-1 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative whitespace-nowrap px-3 py-3 text-[11px] font-medium transition-colors",
                isActive(item.href)
                  ? "text-[#956537] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#956537]"
                  : "text-[#65594B] hover:text-[#956537]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-[#E8DED0] bg-[#FCFAF6] lg:hidden">
          <nav
            aria-label="Mobile product categories"
            className="mx-auto max-w-7xl px-4 py-3 sm:px-6"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-3 text-sm transition",
                  isActive(item.href)
                    ? "bg-[#F1E7D9] font-medium text-[#956537]"
                    : "text-[#514538] hover:bg-[#F7F0E6]",
                )}
              >
                <span>{item.label}</span>

                {isActive(item.href) ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#956537]" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-[#A49A8D]" />
                )}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#E8DED0] pt-4">
              {marketplaces.map((marketplace) => (
                <a
                  key={marketplace.label}
                  href={marketplace.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-[#E5D9C8] px-2 py-3 text-xs font-medium text-[#65594B] transition hover:border-[#C8AD87] hover:text-[#956537]"
                >
                  {marketplace.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
            </div>

            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-[#514538] hover:bg-[#F7F0E6] sm:hidden"
            >
              <UserRound className="h-4 w-4" />
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
