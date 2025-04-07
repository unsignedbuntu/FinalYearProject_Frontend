"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Burada şifre sıfırlama e-postası gönderme işlemi yapılacak
    setIsSubmitted(true)
  }

  const handleReturnToSignIn = () => {
    router.push('/signin')
  }

  return (
    <div className="min-h-screen relative">
      <Image
        src="/Register.png"
        alt="Register background"
        fill
        className="object-cover"
        priority
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <button onClick={() => router.push('/')}>
          <Image 
            src="/MyLogo.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-lg mb-8"
          />
        </button>

        <h1 className="text-white font-raleway text-4xl mb-4">
          Reset Your Password
        </h1>

        <div className="text-white/70 text-center mb-8 max-w-md px-4">
          Enter your email address and we'll send you instructions on how to reset your password.
        </div>

        {isSubmitted ? (
          <div className="text-center px-4">
            <div className="text-[#00FF85] text-xl mb-4">
              ✓ Email Sent Successfully
            </div>
            <div className="text-white/70 mb-4">
              Please check your email for password reset instructions.
            </div>
            <button 
              onClick={handleReturnToSignIn}
              className="text-[#00FF85] hover:underline"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-[300px] space-y-4 px-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-[#B4D4FF]"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#B4D4FF] text-black font-medium py-2 rounded-lg hover:bg-[#86B6F6]"
            >
              Send Reset Instructions
            </button>

            <div className="text-center">
              <button 
                onClick={handleReturnToSignIn}
                className="text-[#FFFF00] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 