import { useEffect } from 'react';
import TickGreen from '../icons/TickGreen';
import Image from 'next/image';
import Link from 'next/link';

interface CartSuccessMessageProps {
  onClose: () => void;
}

export default function CartSuccessMessage({ onClose }: CartSuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Keep visible for 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true" // Hide from screen readers
      />

      {/* Message Box */}
      <div
        role="alert"
        aria-live="assertive"
        className="fixed top-8 right-8 w-[350px] h-[150px] bg-[#C5F3BA] rounded-[20px] z-50
                 animate-slide-in shadow-lg overflow-hidden border border-green-200" // Added border
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[14px] top-[14px] hover:opacity-80 transition-opacity
                   active:scale-95 transform duration-150 p-1" // Added padding for easier click
          aria-label="Close notification"
        >
          <Image src="/icons/Close.png" alt="Close Icon" width={12} height={12} />
        </button>

        {/* Color Strip */}
        <div className="absolute left-0 top-0 w-[20px] h-full bg-[#5AD363]" aria-hidden="true">
          <div className="w-full h-full rounded-l-[20px]" />
        </div>

        {/* Icon */}
        <div className="absolute left-[36px] top-[40px] animate-bounce-in" aria-hidden="true">
          <TickGreen />
        </div>

        {/* Message Text */}
        <div className="absolute left-[80px] top-[40%] transform -translate-y-1/2
                   font-inter text-[16px] text-black leading-tight max-w-[230px]
                   animate-fade-in">
          Product added to cart!
        </div>

        {/* Link */}
        <Link href="/cart">
          <span className="absolute left-[80px] top-[78px] font-inter text-[18px] text-[#4CAF50] // Adjusted color
                        hover:underline transition-opacity cursor-pointer font-semibold"> {/* Added underline on hover */}
            Go to cart
          </span>
        </Link>
      </div>
    </>
  );
} 