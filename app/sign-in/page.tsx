"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Visible from "@/components/icons/Visible";
import Unvisible from "@/components/icons/Unvisible";
import Username from "@/components/icons/Username";

export default function SignInPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/icons/Sign.png"
          alt="Background"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <header style={{ top: "22px", left: "24px" }} className="absolute">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={100}
            height={100}
            priority
            className="rounded-lg"
          />
        </header>

        <h1 className="text-[#00FF85] font-raleway text-2xl mb-8 text-center">
          Welcome to Atalay's<br />
          Management Store
        </h1>

        <div className="w-[300px] space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              aria-label="Username"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Username />
            </div>
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              aria-label="Password"
            />
            <button
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            >
              {isPasswordVisible ? <Visible /> : <Unvisible />}
            </button>
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-[#FFFF00] hover:underline">
              Forgot Your Password?
            </Link>
          </div>

          <button className="w-full bg-[#B4D4FF] text-black font-medium py-2 rounded-lg hover:bg-[#86B6F6]">
            Sign in
          </button>

          <div className="text-center text-white">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-[#00FF85] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 