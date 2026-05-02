"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> main
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Visible from "@/components/icons/Visible";
import Unvisible from "@/components/icons/Unvisible";
<<<<<<< HEAD
import { useAuth } from "@/contexts/AuthContext";
import SigninSuccessMessage from "@/components/messages/SigninSuccessMessage";
import { useUserActions } from "@/app/stores/userStore";
import { getAuthMe } from "@/services/API_Service";

export default function SignInPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const { setUser: actionSetUser } = useUserActions();
  console.log('DEBUG: actionSetUser from useUserActions:', actionSetUser);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSignIn triggered');
    setError("");
    setShowSuccess(false);
    try {
      console.log('Calling login function with:', email);
      await login(email, password);
      console.log('Login function finished successfully');
      
      console.log('Login successful, fetching user data from /me...');
      const userData = await getAuthMe();
      if (userData) {
        console.log('User data fetched:', userData);
        if (typeof actionSetUser === 'function') {
          actionSetUser({ 
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
          });
          console.log('User store updated via actionSetUser.');
        } else {
          console.error('actionSetUser from useUserActions is not a function! Check your Zustand store (userStore.ts) for a `setUser` action.');
        }
      } else {
        console.error('/me endpoint did not return user data after successful login.');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error("Sign in failed inside handleSignIn:", err);
      setError(err.message || "Sign in failed. Please check your credentials.");
    }
=======
import Sign from "@/components/icons/Sign.png";
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
>>>>>>> main
  };

  return (
    <div className="min-h-screen relative">
      <Image
<<<<<<< HEAD
        src="/Register.png"
        alt="Register background"
=======
        src={Sign}
        alt="Background"
>>>>>>> main
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

<<<<<<< HEAD
        <form onSubmit={handleSignIn} className="w-[300px] space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              aria-label="Email"
=======
        <div className="w-[300px] space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              aria-label="Username"
>>>>>>> main
            />
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
<<<<<<< HEAD
              required
=======
>>>>>>> main
              className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              aria-label="Password"
            />
            <button
<<<<<<< HEAD
              type="button"
              onClick={(e) => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
=======
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
>>>>>>> main
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            >
              {isPasswordVisible ? <Visible /> : <Unvisible />}
            </button>
          </div>

          <div className="text-center">
            <button 
<<<<<<< HEAD
              type="button"
=======
>>>>>>> main
              onClick={() => router.push('/forgot-password')}
              className="text-[#FFFF00] hover:underline"
            >
              Forgot Your Password?
            </button>
          </div>

          <button 
<<<<<<< HEAD
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B4D4FF] text-black font-medium py-2 rounded-lg hover:bg-[#86B6F6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
=======
            onClick={handleSignIn}
            className="w-full bg-[#B4D4FF] text-black font-medium py-2 rounded-lg hover:bg-[#86B6F6]"
          >
            Sign in
>>>>>>> main
          </button>

          <div className="text-center text-white">
            Don't have an account?{" "}
            <button 
<<<<<<< HEAD
              type="button"
=======
>>>>>>> main
              onClick={() => router.push('/sign-up')}
              className="text-[#00FF85] hover:underline"
            >
              Sign Up
            </button>
          </div>
<<<<<<< HEAD
        </form>
=======
        </div>
>>>>>>> main

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

<<<<<<< HEAD
      {showSuccess && (
        <SigninSuccessMessage onClose={() => setShowSuccess(false)} />
=======

      {showSuccessMessage && (
        <SigninSuccessMessage onClose={() => setShowSuccessMessage(false)} />
>>>>>>> main
      )}
    </div>
  );
}
