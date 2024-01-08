import { Toaster } from "@/components/ui/sonner";
import { font_poppins_one } from "@/lib/font";
import type { Metadata } from "next";
import "./globals.css";

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
      <body className={font_poppins_one.className}>
        {children}
        <Toaster closeButton richColors theme="light" />
      </body>
    </html>
  );
}
