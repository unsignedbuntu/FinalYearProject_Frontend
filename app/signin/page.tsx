"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Visible from "@/components/icons/Visible";
import Unvisible from "@/components/icons/Unvisible";
import SigninSuccessMessage from "@/components/messages/SigninSuccessMessage";

export default function SignInPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSignIn = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen relative">
      <Image
        src="/icons/Sign.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <button onClick={() => router.push('/')}>
          <Image
            src={"/MyLogo.png"}
            alt="Logo"
            className="rounded-lg"
            width={100}
            height={100}
          />
        </button>

        <h1 className="text-[#ffffff] font-raleway text-6xl mb-8 text-center">
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
            <button 
              onClick={() => router.push('/forgot-password')}
              className="text-[#FFFF00] hover:underline"
            >
              Forgot Your Password?
            </button>
          </div>

          <button 
            onClick={handleSignIn}
            className="w-full bg-[#B4D4FF] text-black font-medium py-2 rounded-lg hover:bg-[#86B6F6]"
          >
            Sign in
          </button>

          <div className="text-center text-white">
            Don't have an account?{" "}
            <button 
              onClick={() => router.push('/sign-up')}
              className="text-[#00FF85] hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 max-w-md">
      
            <h2 className="text-[#00FF85] text-2xl mb-80 ml-36 font-bold">
            🎉 Welcome! Special 15% Discount Opportunity for New Members 🎉 🎉<br/>
            <ul className="space-y-2 text-white/80 text-base"> {/* Daha küçük font boyutu */}
            <li>Become a Member Quickly!</li>
            <li>We are happy that you have joined us! You can benefit from the 15% discount opportunity on all products,exclusively for our new members. Don't miss this advantage!</li>
            </ul>
            </h2>
          </div>

          <div className="absolute bottom-12 right-12 max-w-md">

            <h2 className="text-[#00FF85] text-2xl mb-80 mr-36 font-bold"> 
              How to Benefit?<br/>
            <ul className="space-y-2 text-white/80 text-base">
              <li>1. Sign Up: If you are not a member yet, quickly log in.</li>
              <li>2. Start Shopping: Add the products you like to your cart.</li>
              <li>3. Enter the code KTUN15 and the 15% discount will be applied instantly.</li>
              <li></li>Terms and Conditions:
              Discount code is valid for new memberships and first purchases only.<br/>
            </ul>
            </h2>
          </div>
      </div>


      {showSuccessMessage && (
        <SigninSuccessMessage onClose={() => setShowSuccessMessage(false)} />
      )}
    </div>
  );
}
