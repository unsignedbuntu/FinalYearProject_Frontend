"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Satisfy } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import NavigationBar from "@/components/navigation/NavigationBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

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
  // Body classes: always full height; add background for non-auth pages
  const bodyBaseClasses = "flex flex-col min-h-screen";
  const bodyBackgroundClass = !isAuthPage
    ? "bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat bg-fixed"
    : "";

  const bodyClassName = `${bodyBaseClasses} ${bodyBackgroundClass}`.trim();

  return (
    <html lang="en" className="h-full">
      <body className={bodyClassName}>
      <AuthProvider>  {/* AuthProvider'ı main'in içine aldık, böylece tüm sayfalar AuthContext'e erişebilir */ }
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