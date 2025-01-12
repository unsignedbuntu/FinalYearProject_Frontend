import { useEffect } from 'react';
import TickGreen from '../icons/TickGreen';
import Image from 'next/image';
import Close from '../icons/Close.png';

interface DeleteMessageFavoritesProps {
  onClose: () => void;
}

export default function DeleteMessageFavorites({ onClose }: DeleteMessageFavoritesProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      {/* Blur background */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Message content */}
      <div
        className="fixed top-8 right-8 w-[350px] h-[150px] bg-[#C5F3BA] rounded-[20px] z-50
                 animate-slide-in shadow-lg overflow-hidden"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-[14px] top-[14px] hover:opacity-80 transition-opacity
                   active:scale-95 transform duration-150"
        >
          <Image src={Close} alt="Close Icon" width={12} height={12} />
        </button>

        {/* Success line */}
        <div className="absolute left-0 top-0 w-[20px] h-full bg-[#5AD363]">
          <div className="w-full h-full rounded-l-[20px]" />
        </div>

        {/* Success icon */}
        <div className="absolute left-[36px] top-[40px] animate-bounce-in">
          <TickGreen />
        </div>

        {/* Message text */}
        <p className="absolute left-[80px] top-[40%] transform -translate-y-1/2 
                   font-inter text-[16px] text-black leading-tight max-w-[230px]
                   animate-fade-in">
          The product has been deleted from your favorites.
        </p>
      </div>
    </>
  );
}
