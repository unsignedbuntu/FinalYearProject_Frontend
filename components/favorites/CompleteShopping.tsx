import { useEffect } from 'react';
import Information from '../icons/Information';
import Image from 'next/image';
import Close from '../icons/Close.png';

interface CompleteShoppingProps {
  onClose: () => void;
}

export default function CompleteShopping({ onClose }: CompleteShoppingProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div
        className="fixed top-8 right-8 w-[350px] h-[150px] bg-[#73F1FF] rounded-[20px] z-50
                 animate-slide-in shadow-lg overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-[14px] top-[14px] hover:opacity-80 transition-opacity
                   active:scale-95 transform duration-150"
        >
          <Image src={Close} alt="Close Icon" width={12} height={12} />
        </button>

        <div className="absolute left-0 top-0 w-[20px] h-full bg-[#56C8FA]">
          <div className="w-full h-full rounded-l-[20px]" />
        </div>

        <div className="absolute left-[24px] top-[36px] animate-bounce-in">
          <Information />
        </div>

        <p
          className="absolute left-[80px] top-[40%] transform -translate-y-1/2 
                   font-inter text-[16px] text-black leading-tight max-w-[230px]
                   animate-fade-in"
        >
          To complete your shopping, you can select the products you want to purchase in your cart.
        </p>
      </div>
    </>
  );
}

