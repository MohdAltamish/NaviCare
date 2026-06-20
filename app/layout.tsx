import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NaviCare — AI Benefits Navigator",
  description:
    "Find out what help you qualify for. NaviCare helps you discover US government benefit programs — food, healthcare, housing, and more — in under 2 minutes.",
  keywords: [
    "benefits navigator",
    "government assistance",
    "SNAP",
    "Medicaid",
    "housing assistance",
    "food assistance",
    "benefits finder",
    "NaviCare",
  ],
  openGraph: {
    title: "NaviCare — AI Benefits Navigator",
    description:
      "Find out what help you qualify for. Discover US government benefit programs in under 2 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: "var(--nc-bg)" }}
      >
        {children}
      </body>
    </html>
  );
}
