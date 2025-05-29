"use client"
import { useState, useEffect, useCallback } from 'react';
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
  const [activeTab, setActiveTab] = useState('personalInfo')
  const [showTransactionsDropdown, setShowTransactionsDropdown] = useState(false)
  const [showCloseAccountMessage, setShowCloseAccountMessage] = useState(false)

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

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      <div className="ml-[480px]">
        <div className="w-[1000px] h-[75px] bg-[#F8F8F8] rounded-lg flex items-center justify-between px-8 mb-8">
          <h1 className="font-raleway text-[48px] font-normal">
            My Account
          </h1>
          <div 
            className="relative group"
            onMouseEnter={() => setShowTransactionsDropdown(true)}
            onMouseLeave={() => setShowTransactionsDropdown(false)}
          >
            <button
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="font-raleway text-[20px] font-normal group-hover:text-[#FF8800] transition-colors">
                Transactions
              </span>
              <Arrowdown className="text-black group-hover:text-[#FF8800] transition-colors" />
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
                      setShowTransactionsDropdown(false) 
                      setShowCloseAccountMessage(true)
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
            </button>
          </div>
        </div>

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

      {showCloseAccountMessage && (
        <UserInformationMessage onClose={() => setShowCloseAccountMessage(false)} />
      )}
    </div>
  )
} 