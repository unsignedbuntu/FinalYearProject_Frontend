"use client"  
import { useState } from 'react'  
import { useRouter } from 'next/navigation'  
import Sidebar from '@/components/sidebar/Sidebar'  
import AddressSuccessMessage from '@/components/messages/AddressSuccessMessage'  
import { createUserAddress, UserAddressRequestDto } from '@/services/API_Service'  
import { toast } from 'react-hot-toast'  

const cities = [  
  "Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",  
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",  
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",  
  "Hatay", "Isparta", "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",  
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",   
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon",   
  "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",   
  "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"  
];  

export default function NewAddressPage() {  
  const router = useRouter();  
  const [showCities, setShowCities] = useState(false);  
  const [selectedCity, setSelectedCity] = useState("");  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [formData, setFormData] = useState<Omit<UserAddressRequestDto, 'city' | 'isDefault'> & { isDefaultForm: boolean }>({  
    addressTitle: "",  
    fullName: "",  
    phoneNumber: "",  
    district: "",  
    fullAddress: "",  
    isDefaultForm: false,  
  });  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});  

  const validateForm = () => {  
    const newErrors: { [key: string]: string } = {};  
    if (!formData.addressTitle.trim()) newErrors.addressTitle = "Address title is required";  
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";  
    if (!formData.phoneNumber.trim()) {  
      newErrors.phoneNumber = "Phone number is required";  
    } else if (!/^[1-9][0-9]{9}$/.test(formData.phoneNumber.trim())) {  
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number without leading zero";  
    }  
    if (!selectedCity) newErrors.city = "City is required";  
    if (!formData.fullAddress.trim()) newErrors.address = "Address is required";  

    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  

  const handleSave = async () => {  
    if (!validateForm()) return;  

    setIsSubmitting(true);  
    const payload: UserAddressRequestDto = {  
      ...formData,  
      city: selectedCity,  
      isDefault: formData.isDefaultForm,  
      district: formData.district?.trim() || undefined,  
    };  

    const toastId = toast.loading('Saving address...');  
    const response = await createUserAddress(payload);  
    toast.dismiss(toastId);  
    setIsSubmitting(false);  

    if (response.success && response.data) {  
      toast.success(response.message || 'Address saved successfully!');  
      setShowSuccessMessage(true);  
    } else {  
      toast.error(response.message || 'Failed to save address.');  
      if (response.errors) {  
        const backendErrors: { [key: string]: string } = {};  
        for (const error of response.errors) {  
          if (typeof error === 'string') {  
            if (error.toLowerCase().includes('title')) backendErrors.addressTitle = error;  
            else if (error.toLowerCase().includes('full name')) backendErrors.fullName = error;  
            else if (error.toLowerCase().includes('phone')) backendErrors.phoneNumber = error;  
            else if (error.toLowerCase().includes('city')) backendErrors.city = error;  
            else if (error.toLowerCase().includes('full address')) backendErrors.address = error;  
          }  
        }  
        if (Object.keys(backendErrors).length > 0) {  
          setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));  
        }  
      }  
    }  
  };  

  const handleCloseSuccessMessage = () => {  
    setShowSuccessMessage(false);  
    router.push('/address');  
  };  

  if (showSuccessMessage) {  
    return <AddressSuccessMessage onClose={handleCloseSuccessMessage} />;  
  }  
  
  return (
    <div className="min-h-screen pr-[160px] pt-[100px] relative">
      <Sidebar />
      
      <div className="ml-[480px] flex flex-col min-h-[calc(100vh-100px)]">
        <div className="w-[500px] bg-white mx-auto relative rounded-lg p-8 flex-grow">
            <div className="mb-8">
              <h1 className="font-inter text-[32px] mb-2">Add address</h1>
              <div className="w-full h-[1px] bg-black" />
            </div>

          {/* Address Title input */}
            <div className="mb-6">
            <label className="font-inter text-[16px] mb-2 block">Address Title</label>
              <input
              value={formData.addressTitle}
              onChange={(e) => setFormData({ ...formData, addressTitle: e.target.value })}
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4
                         font-inter text-gray-600 placeholder-gray-500
                       ${errors.addressTitle ? 'border-2 border-red-500' : ''}`}
              disabled={isSubmitting}
              />
            {errors.addressTitle && <div className="text-red-500 text-sm mt-1">{errors.addressTitle}</div>}
            </div>

          {/* Full Name input */}
            <div className="mb-6">
            <label className="font-inter text-[16px] mb-2 block">Full Name</label>
              <input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4
                         font-inter text-gray-600 placeholder-gray-500
                       ${errors.fullName ? 'border-2 border-red-500' : ''}`}
              disabled={isSubmitting}
              />
            {errors.fullName && <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>}
            </div>

            {/* Phone number input */}
            <div className="mb-6">
              <label className="font-inter text-[16px] mb-2 block">Phone number</label>
              <input
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4
                         font-inter text-gray-600 placeholder-gray-500
                       ${errors.phoneNumber ? 'border-2 border-red-500' : ''}`}
              disabled={isSubmitting}
              />
            <div className="text-sm text-gray-500 mt-1">Please enter your 10-digit phone number without the leading zero.</div>
            {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
            </div>

            {/* City selection */}
            <div className="mb-6 relative">
              <label className="font-inter text-[16px] mb-2 block">City</label>
              <button
                onClick={() => setShowCities(!showCities)}
              className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4
                       font-inter text-left flex items-center justify-between
                       ${errors.city ? 'border-2 border-red-500' : 'text-gray-600'}`}
              disabled={isSubmitting}
              >
                {selectedCity || "Choose"}
                <span>▼</span>
              </button>
            {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}
              
              {showCities && (
                <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto
                             bg-white shadow-lg rounded-lg mt-1 z-10">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCities(false);
                      setErrors(prev => ({...prev, city: ''}));
                      }}
                      className="w-full p-2 text-left hover:bg-gray-100 font-inter"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

          {/* District input (Optional) */}
          <div className="mb-6">
            <label className="font-inter text-[16px] mb-2 block">District (Optional)</label>
            <input
              value={formData.district || ''}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4
                       font-inter text-gray-600 placeholder-gray-500`}
              disabled={isSubmitting}
            />
          </div>

            {/* Address input */}
            <div className="mb-6">
              <label className="font-inter text-[16px] mb-2 block">Address</label>
              <textarea
              value={formData.fullAddress}
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                placeholder="Please enter the street, neighborhood, and other details"
                className={`w-full h-[120px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] p-4
                         font-inter text-gray-600 placeholder-gray-500 resize-none
                         ${errors.address ? 'border-2 border-red-500' : ''}`}
              disabled={isSubmitting}
              />
              <div className="text-sm text-gray-500 mt-1">
                Please ensure that you have entered all detailed information such as neighborhood, street, and building correctly so that your package can reach you.
              </div>
              {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
            </div>

          {/* Is Default Checkbox */}
          <div className="mb-8 flex items-center">
              <input
                type="checkbox" 
                id="isDefaultAddress"
                checked={formData.isDefaultForm}
                onChange={(e) => setFormData({...formData, isDefaultForm: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isSubmitting}
              />
            <label htmlFor="isDefaultAddress" className="ml-2 font-inter text-[16px]">Set as default address</label>
            </div>

            <button
              onClick={handleSave}
            disabled={isSubmitting}
              className="w-full h-[55px] bg-[#00EEFF] rounded-[15px]
                       font-inter text-[32px] text-black
                       transition-all duration-200
                     hover:bg-[#2F00FF] hover:text-white
                     disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
            {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
    </div>
  );
}