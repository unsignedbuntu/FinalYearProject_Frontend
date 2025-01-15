"use client"  
import { useState } from 'react'  
import { useRouter } from 'next/navigation'  
import Sidebar from '@/components/sidebar/Sidebar'  
import AddressSuccessMessage from '@/components/messages/AddressSuccessMessage'  

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
  const [showSuccess, setShowSuccess] = useState(false);  
  const [formData, setFormData] = useState({  
    name: "",  
    surname: "",  
    phone: "",  
    address: "",  
    addressTitle: ""  
  });  
  const [errors, setErrors] = useState<{[key: string]: string}>({});  

  const validateForm = () => {  
    const newErrors: {[key: string]: string} = {};  

    if (!formData.name) newErrors.name = "Name is required";  
    if (!formData.surname) newErrors.surname = "Surname is required";  
    if (!formData.phone) newErrors.phone = "Phone number is required";  
    if (!selectedCity) newErrors.city = "City is required";  
    if (!formData.address) newErrors.address = "Address is required";  
    if (!formData.addressTitle) newErrors.addressTitle = "Address title is required";  

    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  

  const handleSave = () => {  
    if (validateForm()) {  
      setShowSuccess(true);  
      // Form verilerini kaydet  
    }  
  };  

  const handleClose = () => {  
    setShowSuccess(false);  
    router.push('/address/empty'); // Başarılı kayıttan sonra listeye dön  
  };  

  return (  
    <div className="min-h-screen pr-[160px] pt-[100px] relative">  
      <Sidebar />  
      
      {showSuccess ? (  
        <AddressSuccessMessage onClose={handleClose} />  
      ) : (  
        <div className="ml-[480px]">  
          <div className="w-[500px] h-[800px] bg-white mx-auto relative rounded-lg p-8">  
            <div className="mb-8">  
              <h1 className="font-inter text-[32px] mb-2">Add address</h1>  
              <div className="w-full h-[1px] bg-black" />  
            </div>  

            {/* Name input */}  
            <div className="mb-6">  
              <label className="font-inter text-[16px] mb-2 block">Name</label>  
              <input  
                value={formData.name}  
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}  
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4  
                         font-inter text-gray-600 placeholder-gray-500  
                         ${errors.name ? 'border-2 border-red-500' : ''}`}  
              />  
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}  
            </div>  

            {/* Surname input */}  
            <div className="mb-6">  
              <label className="font-inter text-[16px] mb-2 block">Surname</label>  
              <input  
                value={formData.surname}  
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}  
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4  
                         font-inter text-gray-600 placeholder-gray-500  
                         ${errors.surname ? 'border-2 border-red-500' : ''}`}  
              />  
              {errors.surname && <div className="text-red-500 text-sm mt-1">{errors.surname}</div>}  
            </div>  

            {/* Phone number input */}  
            <div className="mb-6">  
              <label className="font-inter text-[16px] mb-2 block">Phone number</label>  
              <input  
                value={formData.phone}  
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}  
                type="tel"  
                placeholder="Enter your phone number"  
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4  
                         font-inter text-gray-600 placeholder-gray-500  
                         ${errors.phone ? 'border-2 border-red-500' : ''}`}  
              />  
              <div className="text-sm text-gray-500 mt-1">Please enter your phone number without the leading zero</div>  
              {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}  
            </div>  

            {/* City selection */}  
            <div className="mb-6 relative">  
              <label className="font-inter text-[16px] mb-2 block">City</label>  
              <button  
                onClick={() => setShowCities(!showCities)}  
                className="w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4  
                         font-inter text-gray-600 text-left flex items-center justify-between"  
              >  
                {selectedCity || "Choose"}  
                <span>▼</span>  
              </button>  
              
              {showCities && (  
                <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto   
                             bg-white shadow-lg rounded-lg mt-1 z-10">  
                  {cities.map(city => (  
                    <button  
                      key={city}  
                      onClick={() => {  
                        setSelectedCity(city);  
                        setShowCities(false);  
                      }}  
                      className="w-full p-2 text-left hover:bg-gray-100 font-inter"  
                    >  
                      {city}  
                    </button>  
                  ))}  
                </div>  
              )}  
            </div>  

            {/* Address input */}  
            <div className="mb-6">  
              <label className="font-inter text-[16px] mb-2 block">Address</label>  
              <textarea  
                value={formData.address}  
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}  
                placeholder="Please enter the street, neighborhood, and other details"  
                className={`w-full h-[120px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] p-4  
                         font-inter text-gray-600 placeholder-gray-500 resize-none  
                         ${errors.address ? 'border-2 border-red-500' : ''}`}  
              />  
              <div className="text-sm text-gray-500 mt-1">  
                Please ensure that you have entered all detailed information such as neighborhood, street, and building correctly so that your package can reach you.  
              </div>  
              {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}  
            </div>  

            {/* Address Title */}  
            <div className="mb-8">  
              <label className="font-inter text-[16px] mb-2 block">Address Title</label>  
              <input  
                value={formData.addressTitle}  
                onChange={(e) => setFormData({ ...formData, addressTitle: e.target.value })}  
                type="text"  
                placeholder="Please enter the address title"  
                className={`w-full h-[40px] bg-[#C5C5C5] bg-opacity-40 rounded-[10px] px-4  
                         font-inter text-gray-600 placeholder-gray-500  
                         ${errors.addressTitle ? 'border-2 border-red-500' : ''}`}  
              />  
              {errors.addressTitle && <div className="text-red-500 text-sm mt-1">{errors.addressTitle}</div>}  
            </div>  

            {/* Save button */}  
            <button  
              onClick={handleSave}  
              className="w-full h-[55px] bg-[#00EEFF] rounded-[15px]  
                       font-inter text-[32px] text-black  
                       transition-all duration-200  
                       hover:bg-[#2F00FF] hover:text-white"  
            >  
              Save  
            </button>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
}
