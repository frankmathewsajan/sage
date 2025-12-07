import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/providers/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sage | Duolingo for DSA",
  description: "Learn data structures and algorithms with streaks, XP, and adaptive practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://kit.fontawesome.com/35c881c056.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body
        className={`${inter.variable} antialiased`}
        style={{ overflowX: "auto", overflowY: "auto" }}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
