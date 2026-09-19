import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { CommandMenu } from "@/components/shared/command-menu";
import { PwaRegister } from "@/components/shared/pwa-register";
import { ThemeProvider } from "@/components/shared/theme-provider";

import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, siteConfig, websiteSchema } from "@/lib/seo";

import "./globals.css";
import { StrixCursor } from "../components/strix-cursor";

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
      className={`
    ${displayFont.variable}
    ${bodyFont.variable}
    ${monoFont.variable}
    h-full
    scroll-smooth
    antialiased
  `}
    >
      <head>
        <link rel="canonical" href={siteConfig.url} />

        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="relative isolate min-h-screen overflow-x-hidden text-text-primary bg-background">
        <ThemeProvider>
          <PwaRegister />

          <div className="relative flex min-h-screen flex-col">
            <div className="relative flex-1">{children}</div>
          </div>

          {/* <CommandMenu /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
