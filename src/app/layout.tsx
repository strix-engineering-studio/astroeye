import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";

import { siteConfig } from "@/lib/seo";

import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { cn } from "@/lib/utils";
import { ensureIAdminUser } from "../lib/firebase/seed-admin";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

/* -------------------------------------------------------------------------- */
/* Fonts                                                                       */
/* -------------------------------------------------------------------------- */

const displayFont = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MagicalStones | Architecture-First Product Engineering",
    template: "%s | MagicalStones",
  },
  description: siteConfig.description,
  keywords: siteConfig.defaultKeywords,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MagicalStones",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "MagicalStones | Architecture-First Product Engineering",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicalStones",
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Viewport                                                                    */
/* -------------------------------------------------------------------------- */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#081316",
};

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "scroll-smooth",
        "antialiased",
        displayFont.variable,
        bodyFont.variable,
        monoFont.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="relative isolate min-h-screen overflow-x-hidden text-text-primary bg-background"
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
