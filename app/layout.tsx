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

  // Determine the body className based on the page type
  const bodyClassName = !isAuthPage
    ? "bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat min-h-screen" // Apply background for non-auth pages
    : "min-h-screen"; // Basic class for auth pages

  return (
    <html lang="en">
      {/* Apply conditional className to the body */}
      <body className={bodyClassName}>
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

