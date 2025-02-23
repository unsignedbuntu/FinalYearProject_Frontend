"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.country) newErrors.country = 'Country is required'
      if (!formData.phone) newErrors.phone = 'Phone number is required'
    } else if (currentStep === 2) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number'
      if (!formData.expiry) newErrors.expiry = 'Expiry date is required'
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Invalid expiry date'
      if (!formData.cvv) newErrors.cvv = 'CVV is required'
      else if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.back()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-lg relative" style={{ width: '1021.5px', height: '800px' }}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <button onClick={handleBack} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-raleway text-[24px] font-normal">Make Payment</h2>
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                step === currentStep ? 'bg-[#40BFFF]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Form Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`px-4 py-2 border rounded-lg w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`px-4 py-2 border rounded-lg w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address for Delivery"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`px-4 py-2 border rounded-lg w-full ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.country && <div className="text-red-500 text-sm mt-1">{errors.country}</div>}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`px-4 py-2 border rounded-lg w-full ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                    {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="w-[342px] h-[200px] bg-gray-700 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-8 bg-gray-500 rounded" />
                    <span className="font-medium">VISA</span>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9123 4567"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full bg-transparent border-b ${errors.cardNumber ? 'border-red-500' : 'border-gray-400'} pb-1 focus:outline-none placeholder-gray-400`}
                      maxLength={19}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="JOHN DOE"
                        className="bg-transparent border-b border-gray-400 pb-1 focus:outline-none placeholder-gray-400 uppercase"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className={`w-16 bg-transparent border-b ${errors.expiry ? 'border-red-500' : 'border-gray-400'} pb-1 focus:outline-none placeholder-gray-400`}
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[342px] mx-auto space-y-4">
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  maxLength={3}
                />
                {errors.cvv && <div className="text-red-500 text-sm">{errors.cvv}</div>}

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="saveCard" className="w-4 h-4" />
                  <label htmlFor="saveCard" className="text-sm text-gray-600">Save this credit card</label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#40BFFF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Success</h3>
                <button 
                  onClick={() => router.push('/')}
                  className="px-8 py-3 bg-[#40BFFF] text-white rounded-lg hover:bg-[#3aa8e6]"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== 3 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleNext}
              className="w-[350px] h-[70px] bg-[#40BFFF] text-white rounded-lg hover:bg-[#3aa8e6] font-inter text-[24px]"
            >
              {currentStep === 1 ? 'Go to Payment' : 'Confirm'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 