"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Gerekirse yönlendirme için
import { toast } from 'react-hot-toast';
import { useUserStore, User } from '@/app/stores/userStore';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCurrentUserInformation,
  createOrUpdateCurrentUserInformation,
  UserInformationRequestDto,
  // UserInformationResponseDto, // API servis fonksiyonlarının dönüş tiplerinde dolaylı olarak kullanılıyor
} from '@/services/API_Service';
import Visible from '@/components/icons/Visible';
import Unvisible from '@/components/icons/Unvisible';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

export default function PersonalInformationTab() {
  const router = useRouter();
  const { user: userFromStore } = useUserStore();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<UserInformationRequestDto & { 
    email?: string; // Sadece gösterim için
    currentPassword?: string; 
    newPassword?: string; 
   }>({
    firstName: '',
    lastName: '',
    email: '', 
    phoneNumber: '', 
    dateOfBirth: null, 
    currentPassword: '',
    newPassword: '',
  });

  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  useEffect(() => {
    if (userFromStore?.id) {
      const fetchUserInfo = async () => {
        setIsLoading(true);
        setFormData(prev => ({
          ...prev,
          email: userFromStore.email || '' 
        }));

        const response = await getCurrentUserInformation();
        console.log('[PersonalInformationTab] Raw API Response:', response);

        if (response.success && response.data) {
          const userInfo = response.data;
          console.log('[PersonalInformationTab] UserInfo Data from API:', userInfo);
          console.log('[PersonalInformationTab] Date of Birth string from API:', userInfo.dateOfBirth);

          setFormData(prev => ({
            ...prev,
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            dateOfBirth: userInfo.dateOfBirth,
            phoneNumber: userInfo.phoneNumber || ''
          }));

          if (userInfo.dateOfBirth) {
            try {
                const dob = new Date(userInfo.dateOfBirth);
                if (!isNaN(dob.getTime())) {
                    console.log('[PersonalInformationTab] Parsed Date Object:', dob);
                    setBirthDay(dob.getDate().toString());
                    setBirthMonth(months[dob.getMonth()]);
                    setBirthYear(dob.getFullYear().toString());
                    console.log('[PersonalInformationTab] Set Day, Month, Year states:', dob.getDate().toString(), months[dob.getMonth()], dob.getFullYear().toString());
                } else {
                    console.error('[PersonalInformationTab] Invalid Date after parsing:', userInfo.dateOfBirth);
                    setBirthDay(''); setBirthMonth(''); setBirthYear('');
                }
            } catch (e) {
                console.error("[PersonalInformationTab] Error parsing dateOfBirth from API:", userInfo.dateOfBirth, e);
                setBirthDay(''); setBirthMonth(''); setBirthYear('');
            }
          } else {
            console.log('[PersonalInformationTab] dateOfBirth is null or undefined from API');
            setBirthDay(''); setBirthMonth(''); setBirthYear('');
          }
        } else if (!response.success && response.message !== "User information not found.") {
          toast.error(response.message || "Failed to load user information.");
        }
        setIsLoading(false);
      };
      fetchUserInfo();
    } else {
      if (useUserStore.getState().hasCheckedAuth && !userFromStore) {
        setIsLoading(false);
      } else if (!useUserStore.getState().hasCheckedAuth) {
        // Oturum kontrolü bekleniyor
      } else {
        setIsLoading(false);
      }
    }
  }, [userFromStore]);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 10;
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  };

  const handleUpdateInfo = async () => {
    let hasError = false;
    const newErrors = { firstName: '', lastName: '', dateOfBirth: '', phoneNumber: '' };

    if (!formData.firstName?.trim()) { newErrors.firstName = 'Name is required'; hasError = true; }
    if (!formData.lastName?.trim()) { newErrors.lastName = 'Surname is required'; hasError = true; }
    if (!formData.phoneNumber?.trim()) { 
      newErrors.phoneNumber = 'Phone number is required'; hasError = true; 
    } else if (!/^[1-9][0-9]{9}$/.test(formData.phoneNumber.trim())) { 
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number without leading zero'; hasError = true; 
    }
        
    let dobString: string | null = null;
    if (birthDay && birthMonth && birthYear) {
      const monthIndex = months.indexOf(birthMonth);
      if (monthIndex !== -1) {
        dobString = `${birthYear}-${(monthIndex + 1).toString().padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      }
    } else if (birthDay || birthMonth || birthYear) { 
        newErrors.dateOfBirth = 'Please select your complete birth date'; hasError = true;
    }

    setErrors(prev => ({...prev, ...newErrors}));
    if (hasError) return;

    const payload: UserInformationRequestDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: dobString,
      phoneNumber: formData.phoneNumber
    };

    const toastId = toast.loading('Updating information...');
    const response = await createOrUpdateCurrentUserInformation(payload);
    toast.dismiss(toastId);

    if (response.success && response.data) {
      toast.success(response.message || 'Information updated successfully!');
      await refreshUser();
      const updatedInfo = response.data;
      setFormData(prev => ({
        ...prev,
        firstName: updatedInfo.firstName || '',
        lastName: updatedInfo.lastName || '',
        dateOfBirth: updatedInfo.dateOfBirth,
        phoneNumber: updatedInfo.phoneNumber || ''
      }));
      if (updatedInfo.dateOfBirth) {
        try {
            const dob = new Date(updatedInfo.dateOfBirth);
            if (!isNaN(dob.getTime())) {
                setBirthDay(dob.getDate().toString());
                setBirthMonth(months[dob.getMonth()]);
                setBirthYear(dob.getFullYear().toString());
            }
        } catch (e) { console.error("Error parsing updated DOB", e); }
      }
    } else {
      toast.error(response.message || 'Failed to update information.');
      if (response.errors) { console.error("Validation Errors:", response.errors); }
    }
  };

  const handleUpdatePassword = async () => {
    let hasError = false;
    const newErrorsPwd = { currentPassword: '', newPassword: '' };
    if (!formData.currentPassword) { newErrorsPwd.currentPassword = 'Current password is required'; hasError = true; }
    if (!formData.newPassword) { newErrorsPwd.newPassword = 'New password is required'; hasError = true; }
    else if (!validatePassword(formData.newPassword)) { 
        newErrorsPwd.newPassword = 'Password must be at least 10 characters and contain uppercase, lowercase and number'; hasError = true; 
    }
    setErrors(prev => ({...prev, ...newErrorsPwd}));
    if (hasError) return;

    toast.loading('Updating password...');
    // TODO: API call for password change
    setTimeout(() => {
        toast.dismiss();
        toast.success('Password updated successfully (Placeholder)!');
        setFormData(prev => ({...prev, currentPassword: '', newPassword: ''}));
    }, 1000);
  };

  if (isLoading && !userFromStore?.id && !useUserStore.getState().hasCheckedAuth) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading user data...</span>
      </div>
    );
  }
  
  return (
    <div className="w-[1000px] bg-[#F8F8F8] mt-8 p-8 rounded-lg">
      <div className="grid grid-cols-2 gap-x-16 gap-y-8">
        {/* Kişisel Bilgiler Formu */}
        <div className="space-y-6">
          <h2 className="font-raleway text-[24px] mb-4">My membership information</h2>
          <div>
            <label className="block font-raleway text-[16px] mb-2">Name</label>
            <input
              type="text"
              className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.firstName ? 'border-2 border-red-500' : ''}`}
              value={formData.firstName || ''}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              disabled={isLoading}
            />
            {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
          </div>
          <div>
            <label className="block font-raleway text-[16px] mb-2">Surname</label>
            <input
              type="text"
              className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.lastName ? 'border-2 border-red-500' : ''}`}
              value={formData.lastName || ''}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              disabled={isLoading}
            />
            {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
          </div>
          <div>
            <label className="block font-raleway text-[16px] mb-2">E-mail (Cannot be changed here)</label>
            <input type="email" readOnly className="w-full h-[40px] bg-gray-200 rounded-lg px-4 text-gray-700" value={formData.email || ''} disabled={isLoading} />
          </div>
          <div>
            <label className="block font-raleway text-[16px] mb-2">Phone number</label>
            <input
              type="tel"
              className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.phoneNumber ? 'border-2 border-red-500' : ''}`}
              value={formData.phoneNumber || ''}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              disabled={isLoading}
            />
            <div className="text-sm text-gray-500 mt-1">Please enter your 10-digit phone number without the leading zero.</div>
            {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
          </div>
          <div>
            <label className="block font-raleway text-[16px] mb-2">Date of birth</label>
            <div className="flex gap-4">
              <select className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.dateOfBirth ? 'border-2 border-red-500' : ''}`} value={birthDay} onChange={(e) => setBirthDay(e.target.value)} disabled={isLoading}>
                <option value="" disabled>Day</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
              <select className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.dateOfBirth ? 'border-2 border-red-500' : ''}`} value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} disabled={isLoading}>
                <option value="" disabled>Month</option>
                {months.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
              <select className={`w-1/3 h-[40px] bg-white rounded-lg px-2 ${errors.dateOfBirth ? 'border-2 border-red-500' : ''}`} value={birthYear} onChange={(e) => setBirthYear(e.target.value)} disabled={isLoading}>
                <option value="" disabled>Year</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
          </div>
          <button onClick={handleUpdateInfo} className="w-[120px] h-[40px] bg-[#00EEFF] rounded-lg font-raleway text-[16px] text-black hover:bg-[#2F00FF] hover:text-white transition-all duration-200" disabled={isLoading}>
            Update Info
          </button>
        </div>

        {/* Şifre Güncelleme Formu */}
        <div className="space-y-6">
          <h2 className="font-raleway text-[24px] mb-4">Password update</h2>
          <div>
            <label className="block font-raleway text-[16px] mb-2">Current password</label>
            <div className="relative">
              <input type={showPasswords.current ? "text" : "password"} className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.currentPassword ? 'border-2 border-red-500' : ''}`} value={formData.currentPassword || ''} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} disabled={isLoading} />
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))} disabled={isLoading}>
                {showPasswords.current ? <Visible /> : <Unvisible />}
              </button>
            </div>
            {errors.currentPassword && <div className="text-red-500 text-sm mt-1">{errors.currentPassword}</div>}
          </div>
          <div>
            <label className="block font-raleway text-[16px] mb-2">New password</label>
            <div className="relative">
              <input type={showPasswords.new ? "text" : "password"} className={`w-full h-[40px] bg-white rounded-lg px-4 ${errors.newPassword ? 'border-2 border-red-500' : ''}`} value={formData.newPassword || ''} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} disabled={isLoading} />
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))} disabled={isLoading}>
                {showPasswords.new ? <Visible /> : <Unvisible />}
              </button>
            </div>
            <div className="font-raleway text-[11px] text-gray-600 mt-1">Your password must be at least 10 characters. It must contain 1 uppercase letter, 1 lowercase letter and a number.</div>
            {errors.newPassword && <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>}
          </div>
          <button onClick={handleUpdatePassword} className="w-[120px] h-[40px] bg-[#FF0004] bg-opacity-30 rounded-lg font-raleway text-[16px] text-black hover:bg-opacity-40 transition-all duration-200" disabled={isLoading}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
} 