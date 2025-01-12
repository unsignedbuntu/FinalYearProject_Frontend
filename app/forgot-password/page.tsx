"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image will be added here */}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-4">
          <Image 
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-white font-raleway text-2xl mb-4">
          Reset Your Password
        </h1>

        {/* Description */}
        <p className="text-white/70 text-center mb-8 max-w-md">
          Enter your email address and we'll send you instructions on how to reset your password.
        </p>

        {isSubmitted ? (
          <div className="text-center">
            <div className="text-[#00FF85] text-xl mb-4">
              ✓ Email Sent Successfully
            </div>
            <p className="text-white/70 mb-4">
              Please check your email for password reset instructions.
            </p>
            <Link 
              href="/sign-in"
              className="text-[#00FF85] hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-[300px] space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#00FF85] text-black font-medium py-2 rounded-lg hover:bg-[#00CC6A]"
            >
              Send Reset Instructions
            </button>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link 
                href="/sign-in"
                className="text-[#00FF85] hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 