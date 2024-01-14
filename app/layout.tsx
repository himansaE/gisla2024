import { NavBar } from "@/components/navbar/server";
import { Toaster } from "@/components/ui/sonner";
import { font_poppins_one } from "@/lib/font";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEEE GISLA 2024",
  description: "The Global AI Art Competition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content="IEEE GISLA 2024"></meta>
        <meta
          property="og:description"
          content="The Global AI Art Competition"
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="/og-image.jpg" />
      </head>
      <body className={font_poppins_one.className}>
        <NavBar />
        {children}
        <Toaster closeButton richColors theme="light" />
        <Analytics />
      </body>
    </html>
  );
}
