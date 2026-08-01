import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leon Strotz · Live-Projekte",
  description: "Öffentliche Projekte und ihr aktueller Erreichbarkeitsstatus.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
