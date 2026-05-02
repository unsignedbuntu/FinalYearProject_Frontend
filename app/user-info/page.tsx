"use client"
<<<<<<< HEAD
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar'
import Arrowdown from '@/components/icons/Arrowdown'
import Exit from '@/components/icons/Exit'
import UserInformationIcon from '@/components/icons/UserInformation'
import UserInformationMessage from '@/components/messages/UserInformationMessage'
import PersonalInformationTab from './components/PersonalInformationTab'
import { useUserStore } from '@/app/stores/userStore'
import { getCurrentUserAddresses, deleteUserAddress, UserAddressResponseDto } from '@/services/API_Service'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext';

// Geçici İkon Tanımlamaları (Kendi ikonlarınızla değiştirin)
const EditIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const DeleteIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.032 3.223.096M15 5.25h-4.5v-.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v.75z" />
  </svg>
);
const PlusIconSvg = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Adres Kartı Component'i (Sayfa içinde tanımlı)
interface AddressCardProps {
  address: UserAddressResponseDto;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-150">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{address.addressTitle}</h3>
        {address.isDefault && (
          <span className="px-2.5 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Default
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{address.fullName}</p>
      <p className="text-gray-600 text-sm">{address.phoneNumber}</p>
      <p className="text-gray-500 text-sm mb-3">
        {address.fullAddress}{address.district ? `, ${address.district}` : ''}, {address.city}
      </p>
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
        <button 
          onClick={() => onEdit(address.userAddressID)}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <EditIconSvg className="w-4 h-4 mr-1.5" /> Edit
        </button>
        <button 
          onClick={() => onDelete(address.userAddressID)}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          <DeleteIconSvg className="w-4 h-4 mr-1.5" /> Delete
        </button>
      </div>
    </div>
  );
};

export default function UserInfoPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personalInfo')
  const [showTransactionsDropdown, setShowTransactionsDropdown] = useState(false)
  const [showCloseAccountMessage, setShowCloseAccountMessage] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Adresler için state'ler
  const [addresses, setAddresses] = useState<UserAddressResponseDto[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [errorAddresses, setErrorAddresses] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) {
      // Kullanıcı yoksa veya henüz yüklenmediyse adresleri çekme
      // Eğer userStore'da oturum kontrolü tamamlandı ve kullanıcı yoksa, yüklemeyi durdurabiliriz.
      if (useUserStore.getState().hasCheckedAuth && !user) {
        setIsLoadingAddresses(false)
      }
      return
    }
    setIsLoadingAddresses(true)
    setErrorAddresses(null)
    const response = await getCurrentUserAddresses()
    if (response.success && response.data) {
      setAddresses(response.data)
    } else {
      setErrorAddresses(response.message || 'Failed to load addresses.')
      // toast.error(response.message || 'Failed to load addresses.'); // İsteğe bağlı: Zaten hata mesajı gösterilecek
    }
    setIsLoadingAddresses(false)
  }, [user])

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses()
    }
  }, [activeTab, fetchAddresses])

  const handleAddNewAddress = () => {
    router.push('/address/new')
  }

  const handleEditAddress = (id: number) => {
    router.push(`/address/edit/${id}`)
  }

  const handleDeleteAddress = async (id: number) => {
    const addressToDelete = addresses.find(addr => addr.userAddressID === id)
    if (!addressToDelete) return

    if (window.confirm(`Are you sure you want to delete the address "${addressToDelete.addressTitle}"?`)) {
      const toastId = toast.loading('Deleting address...')
      const response = await deleteUserAddress(id)
      toast.dismiss(toastId)

      if (response.success) {
        toast.success(response.message || 'Address deleted successfully!')
        setAddresses(prev => prev.filter(addr => addr.userAddressID !== id))
      } else {
        toast.error(response.message || 'Failed to delete address.')
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out.');
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
    setShowTransactionsDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTransactionsDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setShowTransactionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTransactionsDropdown]);

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      <div className="ml-[480px]">
        <div className="w-[1000px] h-[75px] bg-[#F8F8F8] rounded-lg flex items-center justify-between px-8 mb-8">
          <h1 className="font-raleway text-[48px] font-normal">
            My Account
          </h1>
          <div 
            ref={dropdownRef}
            className="relative group"
          >
            <button
              ref={dropdownButtonRef}
              onClick={() => setShowTransactionsDropdown(!showTransactionsDropdown)}
              className="flex items-center gap-2 cursor-pointer"
=======
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
>>>>>>> main
          >
            <span className="font-raleway text-[20px] font-normal group-hover:text-[#FF8800] transition-colors">
              Transactions
            </span>
            <Arrowdown className="text-black group-hover:text-[#FF8800] transition-colors" />
<<<<<<< HEAD
            </button>
            {showTransactionsDropdown && (
              <div className="absolute right-0 mt-2 w-[200px] bg-[#D9D9D9] rounded-lg p-4 shadow-lg z-50">
                <div 
                  className="flex items-center gap-2 group cursor-pointer mb-4 pl-2 hover:bg-gray-200 p-1 rounded-md" 
                  onClick={() => {
                    setActiveTab('personalInfo') 
                    setShowTransactionsDropdown(false)
                  }}
                >
                  <UserInformationIcon className="w-6 h-6 group-hover:text-[#FF8000] transition-colors" />
                  <div className="flex flex-col">
                    <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">My user</span>
                    <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">information</span>
          </div>
        </div>
                <div 
                  className="flex items-center gap-2 group cursor-pointer pl-2 hover:bg-gray-200 p-1 rounded-md" 
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <Exit className="w-6 h-6 group-hover:text-[#FF8000] transition-colors" />
                  <span className="font-raleway text-[16px] group-hover:text-[#FF8000] transition-colors">
                    Close account
                  </span>
              </div>
              </div>
                )}
              </div>
                  </div>

        <div className="w-[1000px] mb-6">
          <div className="flex border-b border-gray-300">
            <button 
              onClick={() => setActiveTab('personalInfo')}
              className={`py-3 px-6 font-raleway text-lg transition-colors 
                          ${
                            activeTab === 'personalInfo' 
                              ? 'border-b-2 border-[#FF8800] text-[#FF8800]' 
                              : 'text-gray-600 hover:text-[#FF8800]'
                          }`}
            >
              Personal Information
            </button>
                  <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3 px-6 font-raleway text-lg transition-colors 
                          ${
                            activeTab === 'addresses' 
                              ? 'border-b-2 border-[#FF8800] text-[#FF8800]' 
                              : 'text-gray-600 hover:text-[#FF8800]'
                          }`}
            >
              My Addresses
=======
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
>>>>>>> main
                  </button>
                </div>
              </div>

<<<<<<< HEAD
        {activeTab === 'personalInfo' && (
          <PersonalInformationTab />
        )}
        {activeTab === 'addresses' && (
          <div className="w-[1000px] bg-[#F8F8F8] mt-8 p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-raleway text-[24px]">My Addresses</h2>
              <button
                onClick={handleAddNewAddress}
                className="flex items-center bg-[#00EEFF] text-black px-4 py-2 rounded-lg font-raleway text-[16px] hover:bg-[#2F00FF] hover:text-white transition-all duration-200"
              >
                <PlusIconSvg className="w-5 h-5 mr-2" /> Add New Address
              </button>
            </div>

            {isLoadingAddresses && (
              <div className="flex justify-center items-center min-h-[150px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-700">Loading addresses...</span>
              </div>
            )}

            {!isLoadingAddresses && errorAddresses && addresses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-red-500 text-lg mb-2">{errorAddresses}</p>
                <button onClick={fetchAddresses} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Retry
                  </button>
                </div>
                )}

            {!isLoadingAddresses && !errorAddresses && addresses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg mb-2">You haven't added any addresses yet.</p>
                <p className="text-gray-500">Click "Add New Address" to get started.</p>
              </div>
            )}

            {!isLoadingAddresses && addresses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                  <AddressCard 
                    key={address.userAddressID} 
                    address={address} 
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

=======
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
>>>>>>> main
      {showCloseAccountMessage && (
        <UserInformationMessage onClose={() => setShowCloseAccountMessage(false)} />
      )}
    </div>
  )
} 