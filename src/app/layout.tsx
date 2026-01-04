import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import "@/app/globals.css";
import ShellLayout from "@/layouts/shell-layout";

export const metadata: Metadata = {
  title: "Ledgerly",
  description:
    "A minimal dashboard focused on Career, Health & Wellbeing, and Finance.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "Ledgerly — Career, Health & Finance",
    description:
      "A minimal dashboard focused on Career, Health & Wellbeing, and Finance.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledgerly — Career, Health & Finance",
    description:
      "A minimal dashboard focused on Career, Health & Wellbeing, and Finance.",
    images: ["/opengraph-image"],
  },
};

const GeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const MontserratSerif = Montserrat({
  subsets: ["latin"],
  variable: "--font-serif",
});

const InterFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        MontserratSerif.variable,
        InterFont.variable,
        "bg-background text-foreground",
      )}
    >
      <meta
        name="robots"
        content="noindex, nofollow, noarchive, nosnippet, noimageindex"
      />
      <body className="flex grow">
        <ShellLayout>{children}</ShellLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
