import { useEffect } from 'react';
import FavoriteIcon from '../icons/FavoriteIcon'; // Veya uygun bir favori ikonu
import Image from 'next/image';
import Link from 'next/link';

interface FavoritesAddedMessageProps {
  onClose: () => void;
}

export default function FavoritesAddedMessage({ onClose }: FavoritesAddedMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Keep visible for 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" // z-index'i CartSuccess'dan düşük olabilir
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Mesaj Kutusu */}
      <div
        role="alert"
        aria-live="assertive"
        className="fixed top-24 right-8 w-[350px] h-[150px] bg-[#FFE0E6] rounded-[20px] z-50
                 animate-slide-in shadow-lg overflow-hidden border border-red-200" // Renk ve stil favorilere göre ayarlandı
      >
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose}
          className="absolute right-[14px] top-[14px] hover:opacity-80 transition-opacity
                   active:scale-95 transform duration-150 p-1"
          aria-label="Close notification"
        >
          <Image src="/Close.png" alt="Close Icon" width={12} height={12} />
        </button>

        {/* Renkli Şerit */}
        <div className="absolute left-0 top-0 w-[20px] h-full bg-[#F4717F]" aria-hidden="true"> 
          <div className="w-full h-full rounded-l-[20px]" />
        </div>

        {/* İkon */}
        <div className="absolute left-[36px] top-[40px] animate-bounce-in text-red-500" aria-hidden="true">
          <FavoriteIcon width={28} height={28} /> 
        </div>

        {/* Mesaj Metni */}
        <div className="absolute left-[80px] top-[40%] transform -translate-y-1/2 
                   font-inter text-[16px] text-black leading-tight max-w-[230px]
                   animate-fade-in">
          Product added to favorites! 
        </div>

        {/* Link */}
        <Link href="/favorites">
          <span className="absolute left-[80px] top-[78px] font-inter text-[18px] text-[#D64D5B] 
                        hover:underline transition-opacity cursor-pointer font-semibold">
            Go to favorites
          </span>
        </Link>
      </div>
    </>
  );
} 