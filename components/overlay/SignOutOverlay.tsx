"use client"
import { useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import UserInformation from "../icons/UserInformation";
import MyReviews from "../icons/MyReviews";
import Cart from "../icons/Cart";
import SignOutIcon from "../icons/SignOutIcon"; // Import SignOutIcon

interface SignOutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignOutOverlay({ isOpen, onClose }: SignOutOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout, user } = useAuth(); // Get logout function and user from context
  console.log('[SignOutOverlay] Rendering with user:', user); // Log user AFTER declaration

  // Sadece overlay dışındaki alana tıklandığında kapanacak
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSignOut = () => {
    logout();
    onClose();
    router.push('/'); // Redirect to homepage after sign out
  };

  if (!isOpen) return null;

  const menuItemStyle = `
    flex items-center gap-4 p-3 rounded-lg group relative cursor-pointer
    hover:bg-gray-100 transition-all duration-200
    before:content-[''] before:absolute before:inset-0 
    before:border-2 before:border-[#FF0303] before:border-dashed 
    before:rounded-lg before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-200
  `;

  return (
    // Overlay arka planı - tıklanabilir alan
    <div 
      className="fixed inset-0 bg-transparent z-[9999]" // Ensure overlay is above other elements
      onClick={handleClickOutside}
    >
      {/* Overlay içeriği - Updated position to match SignInOverlay */}
      <div
        ref={overlayRef}
        className="absolute z-[9999] bg-white bg-opacity-90 rounded-lg shadow-lg"
        style={{
          top: "160px", // Match SignInOverlay
          left: "1000px", // Match SignInOverlay
          width: "300px", // Keep slightly narrower or adjust if needed
          // height: "auto", 
        }}
      >
        {/* Triangle Indicator - Updated position to match SignInOverlay */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 z-[9998]">
          <div className="w-4 h-4 bg-white rotate-45 transform origin-center shadow-lg"></div>
        </div>

        {/* Main Menu */}
        <div className="relative p-4 space-y-3 z-[9999]">

          {/* Display User Info if available */}
          {user && (
            <div className="px-3 pb-3 mb-3 border-b border-gray-200">
                <p className="text-lg font-semibold truncate" title={user.fullName}>{user.fullName}</p>
                <p className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</p>
            </div>
          )}
          
          {/* Sign Out */}
          <button onClick={handleSignOut} className={menuItemStyle}>
            <div className="flex items-center justify-center w-10 h-10 text-red-600">
              <SignOutIcon width={28} height={28} />
            </div>
            <span className="text-lg font-medium text-red-600 group-hover:text-[#FF0303]">
              Sign Out
            </span>
          </button>

          {/* User Information */}
          <button onClick={() => {
            onClose();
            router.push('/user-info');
          }} className={menuItemStyle}>
             <div className="flex items-center justify-center w-10 h-10 text-gray-700">
              <UserInformation width={28} height={28} />
            </div>
            <span className="text-lg font-medium group-hover:text-[#9747FF]">
              User Information
            </span>
          </button>

          {/* My Reviews */}
          <button onClick={() => {
            onClose();
            router.push('/my-reviews');
          }} className={menuItemStyle}>
            <div className="flex items-center justify-center w-10 h-10 text-gray-700">
              <MyReviews width={30} height={20} /> 
            </div>
            <span className="text-lg font-medium group-hover:text-[#9747FF]">
              My Reviews
            </span>
          </button>

          {/* My Orders */}
          <button onClick={() => {
            onClose();
            router.push('/my-orders');
          }} className={menuItemStyle}>
            <div className="flex items-center justify-center w-10 h-10 text-gray-700">
              <Cart width={25} height={25} /> 
            </div>
            <span className="text-lg font-medium group-hover:text-[#9747FF]">
              My Orders
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 