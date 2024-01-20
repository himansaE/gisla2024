import { NavBar } from "@/components/navbar/server";
import { Toaster } from "@/components/ui/sonner";
import { font_poppins_one } from "@/lib/font";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEEE GISLA 2024",
  description:
    "The Global AI Art Competition under the theme 'A Global Call for Climate Action'",
  metadataBase: new URL("https://gisla2024.vercel.app/"),
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "IEEE GISLA 2024",
    description:
      "The Global AI Art Competition under the theme 'A Global Call for Climate Action'",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font_poppins_one.className}>
        <NavBar />
        {children}
        <Toaster closeButton richColors theme="light" />
        <Analytics />
      </body>
    </html>
  );
}
