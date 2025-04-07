"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Satisfy } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import NavigationBar from "@/components/navigation/NavigationBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/sign-up" || pathname === "/forgot-password";

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {!isAuthPage && (
            <>
              <Header />
              <NavigationBar />
            </>
          )}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

