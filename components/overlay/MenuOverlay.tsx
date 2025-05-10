"use client"
// import { useState } from 'react' // Artık iç state yok
import Cancel from '../icons/Cancel'
import ArrowRight from '../icons/ArrowRight'
import Trash from '../icons/Trash'
// MoveToListOverlay ve DeleteSuccessMessage importları ve kullanımları kaldırıldı,
// çünkü bu mantık artık FavoritesPage tarafından yönetilecek.
// import MoveToListOverlay from './MoveToListOverlay' 
// import DeleteSuccessMessage from '../messages/DeleteSuccessMessage'

export interface MenuOverlayProps {
  productId: number | null; // Hangi ürün için menü açıldı
  isOpen?: boolean; // Parent kontrol eder
  onClose: () => void;
  onDeleteClick: (productId: number) => void;
  onMoveToListClick: (productId: number) => void;
}

export default function MenuOverlay({
  productId,
  onClose,
  onDeleteClick,
  onMoveToListClick
}: MenuOverlayProps) {
  // const [showMoveToList, setShowMoveToList] = useState(false) // Kaldırıldı
  // const [showDeleteSuccess, setShowDeleteSuccess] = useState(false) // Kaldırıldı

  const handleDelete = () => {
    if (productId !== null) {
      onDeleteClick(productId);
    }
    // setShowDeleteSuccess(true) // Kaldırıldı
  };

  const handleMoveToList = () => {
    if (productId !== null) {
      onMoveToListClick(productId);
    }
    // setShowMoveToList(true) // Kaldırıldı
  };

  // const handleDeleteSuccessClose = () => { // Kaldırıldı
  //   setShowDeleteSuccess(false)
  //   onClose()
  // }

  // showDeleteSuccess ve showMoveToList state'leri kaldırıldığı için koşullu render basitleşti.
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose} // Dışarı tıklanınca her zaman ana kapatma fonksiyonunu çağırır
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-[#FFFFFF] rounded-lg z-50 p-4 shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1"
          aria-label="Close menu"
        >
          <Cancel />
        </button>

        <div className="mt-8 space-y-3">
          <button 
            className="flex items-center px-3 py-2 w-full hover:bg-gray-100 rounded-md text-left transition-colors duration-150"
            onClick={handleMoveToList}
            disabled={productId === null}
          >
            <ArrowRight width={18} height={18} className="mr-3 text-gray-600" />
            <span className="font-raleway text-[16px] text-gray-700">
              Move to another list
            </span>
          </button>

          <button 
            className="flex items-center px-3 py-2 w-full hover:bg-gray-100 rounded-md text-left transition-colors duration-150"
            onClick={handleDelete}
            disabled={productId === null}
          >
            <Trash />
            <span className="font-raleway text-[16px] text-red-500 ml-3">
              Delete from list
            </span>
          </button>
        </div>
      </div>
    </>
  );
} 