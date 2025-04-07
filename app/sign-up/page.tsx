"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Visible from "@/components/icons/Visible";
import Unvisible from "@/components/icons/Unvisible";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Generate arrays for day, month, and year dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
      newErrors.birthDate = 'Birth date is required';
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits and without leading zero';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (validateForm()) {
      try {
        const { confirmPassword, birthDay, birthMonth, birthYear, ...registerData } = formData;
        await register(registerData);
        router.push('/signin?registered=true');
      } catch (err: any) {
        console.error("Sign up failed:", err);
        setErrors({ form: err.response?.data?.message || err.message || "Sign up failed. Please try again." });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.form) {
      setErrors(prev => ({
        ...prev,
        form: ''
      }));
    }
  };

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
            src={"/MyLogo.png"}
            alt="Logo"
            className="rounded-lg"
            width={100}
            height={100}
          />
        </button>

        <h1 className="text-yellow-200 font-raleway text-8xl mb-8 text-center">
          Create a new account
        </h1>

        <form onSubmit={handleSubmit} className="w-[400px] space-y-4">
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{errors.form}</span>
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.firstName ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
          </div>

          <div className="relative">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              required
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.lastName ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.email ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              name="birthDay"
              value={formData.birthDay}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg bg-[#B4D4FF] text-black"
            >
          <option value="" disabled hidden>Day</option>
                    {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                     ))}
                    </select>
            <select
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg bg-[#B4D4FF] text-black"
            >
                 <option value="" disabled hidden>Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>

            <select
              name="birthYear"
              value={formData.birthYear}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg bg-[#B4D4FF] text-black"
            >
              <option value="" disabled hidden>Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
          </div>
          {errors.birthDate && <div className="text-red-500 text-sm mt-1">{errors.birthDate}</div>}

          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone number (Optional)"
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.password ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            >
              {isPasswordVisible ? <Visible /> : <Unvisible />}
            </button>
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>

          <div className="relative">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              required
              className={`w-full px-4 py-2 rounded-lg bg-[#B4D4FF] text-black placeholder-black/70 focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'ring-red-500' : 'focus:ring-[#B4D4FF]'}`}
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            >
              {isConfirmPasswordVisible ? <Visible /> : <Unvisible />}
            </button>
            {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-[300px] h-[75px] bg-[#8EE7ED] text-black rounded-[40px] mx-auto block hover:bg-[#7ad4da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-raleway text-[36px] font-normal text-center">
              {isLoading ? 'Signing up...' : 'Sign up'}
            </span>
          </button>

          <div className="text-center mt-4">
            <span className="text-white">Already have an account? </span>
            <button
                onClick={() => router.push('/signin')}
              className="text-[#B4D4FF] hover:text-[#86B6F6] font-medium"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="absolute bottom-12 left-12 max-w-md">
          <h2 className="text-[#00FF85] text-2xl mb-80 ml-36 font-bold">
            🎉 Welcome! Special 15% Discount Opportunity for New Members 🎉<br/>
            <ul className="space-y-2 text-white/80 text-base">
              <li>Become a Member Quickly!</li>
              <li>We are happy that you have joined us! You can benefit from the 15% discount opportunity on all products, exclusively for our new members. Don't miss this advantage!</li>
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
    </div>
  );
} 