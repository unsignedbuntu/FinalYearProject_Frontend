"use client"
// import { useState } from 'react' // İç state kaldırılacak
import Add from '../icons/Add'
// import CreateNewListOverlay from './CreateNewListOverlay' // Bu artık parent tarafından yönetiliyor
import Cancel from '../icons/Cancel'
import { FavoriteList } from '@/app/stores/favoritesStore' // Mevcut listeleri göstermek için (opsiyonel)

export interface MoveToListOverlayProps {
  productId: number | null;
  isOpen?: boolean;
  onBack: () => void; // Geri veya kapatma
  onOpenCreateNewList: (productId: number) => void; // Yeni liste oluşturma overlayini açar
  // onMoveToExistingList?: (productId: number, listId: number) => void; // Opsiyonel: Mevcut listeye taşıma
  // existingLists?: FavoriteList[]; // Opsiyonel: Mevcut listeleri göstermek için
}

export default function MoveToListOverlay({
  productId,
  onBack,
  onOpenCreateNewList,
  // existingLists
}: MoveToListOverlayProps) {
  // const [showCreateList, setShowCreateList] = useState(false) // Kaldırıldı

  const handleCreateNewListClick = () => {
    if (productId !== null) {
      onOpenCreateNewList(productId);
    }
    // setShowCreateList(true) // Kaldırıldı
  };

  // showCreateList state'i kaldırıldığı için render basitleşti.
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onBack} // Dışarı tıklanınca kapat
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-[#FFFFFF] rounded-lg z-50 p-4 shadow-xl flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-center pt-2 pb-4">
          <button 
            onClick={onBack}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 hover:opacity-80 transition-opacity"
          >
            <Cancel />
          </button>
          <h2 className="font-raleway font-semibold text-[20px] text-center">
            Move to another list
          </h2>
        </div>

        {/* Content - Şimdilik sadece Yeni Liste Oluştur butonu */}
        {/* Eğer mevcut listeler gösterilecekse, burası map ile render edilebilir */}
        <div className="flex-grow flex flex-col items-center justify-center py-4">
          {/* existingLists?.map(list => (...)) */}
          <button 
            onClick={handleCreateNewListClick}
            disabled={productId === null}
            className="w-[230px] h-[40px] bg-[#FFE8BD] rounded-lg 
                       flex items-center justify-center gap-2 
                       hover:bg-[#FFD280] active:scale-95 transition-all duration-200
                       disabled:opacity-50"
          >
            <Add />
            <span className="font-raleway font-normal text-[18px] text-[#FF7700]">
              Create new list
            </span>
          </button>
        </div>
        
        {/* Footer (Opsiyonel, belki bir Cancel butonu daha eklenebilir) */}
        {/* <div className="pt-4">
          <button onClick={onBack} className="w-full ...">Cancel</button>
        </div> */}
      </div>
    </>
  );
}