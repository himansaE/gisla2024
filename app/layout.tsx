import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { font_lato } from "@/lib/font";

export const metadata: Metadata = {
  title: "Gisla 2024",
  description: "Empower your imagination",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font_lato.className}>
        {children}
        <Toaster closeButton richColors theme="light" />
      </body>
    </html>
  );
}
