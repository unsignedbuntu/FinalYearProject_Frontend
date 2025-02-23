"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import Arrowdown from '@/components/icons/Arrowdown'
import Visible from '@/components/icons/Visible'
import Unvisible from '@/components/icons/Unvisible'
import Exit from '@/components/icons/Exit'
import UserInformation from '@/components/icons/UserInformation'
import UserInformationMessage from '@/components/messages/UserInformationMessage'

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
    const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString())

export default function UserInfoPage() {
  const [showTransactions, setShowTransactions] = useState(false)
  const [showCloseAccountMessage, setShowCloseAccountMessage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    day: '',
    month: '',
    year: '',
    currentPassword: '',
    newPassword: '',
    newPasswordAgain: ''
  })

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthDate: '',
    currentPassword: '',
    newPassword: '',
    newPasswordAgain: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    newAgain: false
  })

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const isLongEnough = password.length >= 10

    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough
  }

  const handleUpdate = (section: 'info' | 'password' | 'phone') => {
    const newErrors = { ...errors }
    let hasError = false

    if (section === 'info') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
        hasError = true
      }
      if (!formData.surname.trim()) {
        newErrors.surname = 'Surname is required'
        hasError = true
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
        hasError = true
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
        hasError = true
      }
      if (!formData.day || !formData.month || !formData.year) {
        newErrors.birthDate = 'Please select your complete birth date'
        hasError = true
      }
    } else if (section === 'phone') {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
        hasError = true
      } else if (!/^[1-9][0-9]{9}$/.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number without leading zero'
        hasError = true
      }
    } else if (section === 'password') {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
        hasError = true
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required'
        hasError = true
      } else if (!validatePassword(formData.newPassword)) {
        newErrors.newPassword = 'Password must be at least 10 characters and contain uppercase, lowercase and number'
        hasError = true
      }
      if (!formData.newPasswordAgain) {
        newErrors.newPasswordAgain = 'Please confirm your new password'
        hasError = true
      } else if (formData.newPassword !== formData.newPasswordAgain) {
        newErrors.newPasswordAgain = 'Passwords do not match'
        hasError = true
      }
    }

    setErrors(newErrors)
    if (!hasError) {
      // Update işlemi başarılı
      alert('Update successful!')
      // Hata mesajlarını temizle
      setErrors({
        name: '',
        surname: '',
        email: '',
        phone: '',
        birthDate: '',
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      })
    }
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
  
      <Sidebar />
      
      <div className="ml-[480px]">
        {/* Header Rectangle */}
        <div className="w-[1000px] h-[75px] bg-[#F8F8F8] rounded-lg flex items-center justify-between px-8">
          <h1 className="font-raleway text-[48px] font-normal">
            My User Information
          </h1>
          
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setShowTransactions(true)}
          >
            <span className="font-raleway text-[20px] font-normal group-hover:text-[#FF8800] transition-colors">
              Transactions
            </span>
            <Arrowdown className="text-black group-hover:text-[#FF8800] transition-colors" />
          </div>
        </div>

        {/* Main Content Rectangle */}
        <div className="w-[1000px] bg-[#F8F8F8] mt-8 p-8 rounded-lg">
          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <h2 className="font-raleway text-[24px] mb-4">My membership information</h2>
              
              {/* Name Input */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">Name</label>
                <input
                  type="text"
                  className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.name ? 'border-2 border-red-500' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* Surname Input */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">Surname</label>
                <input
                  type="text"
                  className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.surname ? 'border-2 border-red-500' : ''}`}
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                />
                {errors.surname && (
                  <div className="text-red-500 text-sm mt-1">{errors.surname}</div>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">E-mail</label>
                <input
                  type="email"
                  className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.email ? 'border-2 border-red-500' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">Phone number</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="tel"
                      className="w-full h-[40px] bg-white rounded-lg px-4"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                      <div className="text-sm text-gray-500 mt-1">Please enter your phone number without the leading zero.</div>
                  </div>
                  <button
                    className="w-[120px] h-[40px] bg-[#FF9D00] bg-opacity-40 rounded-lg
                             font-raleway text-[16px] text-black
                             hover:bg-opacity-100 transition-all duration-200"
                    onClick={() => handleUpdate('phone')}
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">Date of birth</label>
                <div className="flex gap-4">
                  <select 
                    className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                  >
                   <option value="" disabled hidden>Day</option>
                    {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                     ))}
                    </select>

                  <select 
                    className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                  >
                    <option value="" disabled hidden>Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>

                  <select 
                    className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="" disabled hidden>Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.birthDate && (
                  <div className="text-red-500 text-sm mt-1">{errors.birthDate}</div>
                )}
              </div>

              <button
                onClick={() => handleUpdate('info')}
                className="w-[120px] h-[40px] bg-[#00EEFF] rounded-lg
                         font-raleway text-[16px] text-black
                         hover:bg-[#2F00FF] hover:text-white
                         transition-all duration-200"
              >
                Update
              </button>
            </div>

            {/* Right Column - Password Update */}
            <div className="space-y-6">
              <h2 className="font-raleway text-[24px] mb-4">Password update</h2>
              
              {/* Current Password */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">Current password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className={`w-full h-[40px] bg-white rounded-lg px-4 
                              ${errors.currentPassword ? 'border-2 border-red-500' : ''}`}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                  >
                    {showPasswords.current ? <Visible /> : <Unvisible />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <div className="text-red-500 text-sm mt-1">{errors.currentPassword}</div>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block font-raleway text-[16px] mb-2">New password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className={`w-full h-[40px] bg-white rounded-lg px-4
                              ${errors.newPassword ? 'border-2 border-red-500' : ''}`}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                  >
                    {showPasswords.new ? <Visible /> : <Unvisible />}
                  </button>
                </div>
                <div className="font-raleway text-[11px] text-gray-600 mt-1">
                  Your password must be at least 10 characters. It must contain 1 uppercase letter, 
                  1 lowercase letter and a number.
                </div>
                {errors.newPassword && (
                  <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
                )}
              </div>

              <button
                onClick={() => handleUpdate('password')}
                className="w-[120px] h-[40px] bg-[#FF0004] bg-opacity-30 rounded-lg
                         font-raleway text-[16px] text-black
                         hover:bg-opacity-40 transition-all duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Overlay */}
      {showTransactions && (
        <div 
          className="fixed inset-0 flex items-start justify-start pt-[315px] pl-[1280px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTransactions(false);
            }
          }}
        >
          <div className="w-[200px] h-[120px] bg-[#D9D9D9] rounded-lg p-4">
            <div 
              className="flex items-center gap-2 group cursor-pointer mb-4 pl-7"
              onClick={() => {
                setShowTransactions(false);
              }}
            >
              <UserInformation className="w-6 h-6 group-hover:text-[#FF8000] transition-colors" />
              <div className="flex flex-col">
                <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">My user</span>
                <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">information</span>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-2 group cursor-pointer pl-7"
              onClick={() => setShowCloseAccountMessage(true)}
            >
              <Exit className="w-6 h-6 group-hover:text-[#FF8000] transition-colors" />
              <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">
                Close account
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Close Account Message */}
      {showCloseAccountMessage && (
        <UserInformationMessage onClose={() => setShowCloseAccountMessage(false)} />
      )}
    </div>
  )
} 