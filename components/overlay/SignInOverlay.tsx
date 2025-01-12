"use client"
import { useRef } from "react";
import Vector from "../icons/Vector";
import Signup from "../icons/Signup";
import UserInformation from "../icons/UserInformation";
import MyReviews from "../icons/MyReviews";
import Cart from "../icons/Cart";
import Link from "next/link";

interface SignInOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInOverlay({ isOpen, onClose }: SignInOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sadece overlay dışındaki alana tıklandığında kapanacak
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const menuItemStyle = `
    flex items-center gap-4 p-3 rounded-lg group relative
    hover:bg-gray-100 transition-all duration-200
    before:content-[''] before:absolute before:inset-0 
    before:border-2 before:border-[#9747FF] before:border-dashed 
    before:rounded-lg before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-200
  `;

  return (
    // Overlay arka planı - tıklanabilir alan
    <div 
      className="fixed inset-0 bg-transparent z-[9999]"
      onClick={handleClickOutside}
    >
      {/* Overlay içeriği */}
      <div
        ref={overlayRef}
        className="absolute z-[9999]"
        style={{
          top: "160px",
          left: "1000px",
          width: "350px",
          height: "460px",
        }}
      >
        {/* Triangle Indicator */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 z-[9999]">
          <div className="w-4 h-4 bg-white rotate-45 transform origin-center shadow-lg"></div>
        </div>

        {/* Main Menu */}
        <div className="relative bg-white bg-opacity-75 rounded-lg shadow-lg w-full h-full z-[9999]">
          <div className="p-4 space-y-4">
            {/* Sign In */}
            <Link href="/signin" className={menuItemStyle}>
              <div className="flex items-center justify-center w-[72px] h-[45px]">
                <Vector width={72} height={45} />
              </div>
              <span className="text-lg font-medium group-hover:text-[#9747FF]">
                Sign In
              </span>
            </Link>

            {/* Sign Up */}
            <Link href="/signup" className={menuItemStyle}>
              <div className="flex items-center justify-center w-[90px] h-[70px]">
                <Signup width={90} height={70} />
              </div>
              <span className="text-lg font-medium group-hover:text-[#9747FF]">
                Sign Up
              </span>
            </Link>

            {/* User Information */}
            <Link href="/user-info" className={menuItemStyle}>
              <div className="flex items-center justify-center w-[65px] h-[52px]">
                <UserInformation width={65} height={52} />
              </div>
              <span className="text-lg font-medium group-hover:text-[#9747FF]">
                User Information
              </span>
            </Link>

            {/* My Reviews */}
            <Link href="/my-reviews" className={menuItemStyle}>
              <div className="flex items-center justify-center w-[70px] h-[45px]">
                <MyReviews width={70} height={45} />
              </div>
              <span className="text-lg font-medium group-hover:text-[#9747FF]">
                My Reviews
              </span>
            </Link>

            {/* My Orders */}
            <Link href="/my-orders" className={menuItemStyle}>
              <div className="flex items-center justify-center w-[60px] h-[50px]">
                <Cart width={60} height={50} />
              </div>
              <span className="text-lg font-medium group-hover:text-[#9747FF]">
                My Orders
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
