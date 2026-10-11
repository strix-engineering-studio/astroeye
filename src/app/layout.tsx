import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";

import { organizationSchema, siteConfig, websiteSchema } from "@/lib/seo";

import "./globals.css";
import { StrixCursor } from "../components/strix-cursor";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

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
    default:
      "Strix Engineering Studio | Architecture-First Product Engineering",
    template: "%s | Strix Engineering Studio",
  },
  description: siteConfig.description,
  keywords: siteConfig.defaultKeywords,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Strix",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Strix Engineering Studio | Architecture-First Product Engineering",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strix Engineering Studio",
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
      <body className="relative isolate min-h-screen overflow-x-hidden text-text-primary bg-background">
        <ThemeProvider>
          {/* <PwaRegister /> */}

          <div className="relative flex min-h-screen flex-col">
            <div className="relative flex-1">{children}</div>
          </div>

          {/* <CommandMenu /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
