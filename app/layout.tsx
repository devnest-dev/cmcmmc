import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ogImage,
  siteBaseUrl,
  siteDescription,
  siteName,
  siteShortName,
  siteUrl,
} from "../lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: siteBaseUrl,
  title: {
    default: siteName,
    template: `%s | ${siteShortName}`,
  },
  description: siteDescription,
  applicationName: siteShortName,
  keywords: [
    "CM-CMMC",
    "Cebu",
    "Catholic media",
    "Mass Media Congress",
    "Church communications",
    "Media ministry",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "CM-CMMC 2026 cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [ogImage],
    site: "@sugbosimbahan",
    creator: "@sugbosimbahan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
