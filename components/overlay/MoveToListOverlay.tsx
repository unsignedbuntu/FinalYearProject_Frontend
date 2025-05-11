"use client"
// import { useState } from 'react' // İç state kaldırılacak
import Add from '../icons/Add'
// import CreateNewListOverlay from './CreateNewListOverlay' // Bu artık parent tarafından yönetiliyor
import Cancel from '../icons/Cancel'
import { FavoriteList } from '@/app/stores/favoritesStore' // Mevcut listeleri göstermek için (opsiyonel)

export interface MoveToListOverlayProps {
  productId: number | null;
  isOpen?: boolean; // This prop might not be used if visibility is controlled by parent via conditional rendering
  onBack: () => void; // Geri veya kapatma
  onOpenCreateNewList: (productId: number) => void; // Yeni liste oluşturma overlayini açar
  onMoveToExistingList: (productId: number, listId: number) => void; // Uncommented and activated
  existingLists: FavoriteList[]; // Uncommented and activated
}

export default function MoveToListOverlay({
  productId,
  onBack,
  onOpenCreateNewList,
  onMoveToExistingList, // Activated
  existingLists        // Activated
}: MoveToListOverlayProps) {
  // const [showCreateList, setShowCreateList] = useState(false) // Kaldırıldı

  const handleCreateNewListClick = () => {
    if (productId !== null) {
      onOpenCreateNewList(productId);
    }
    // setShowCreateList(true) // Kaldırıldı
  };

  const handleMoveToList = (listId: number) => {
    if (productId !== null) {
      onMoveToExistingList(productId, listId);
    }
  };

  // showCreateList state'i kaldırıldığı için render basitleşti.
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onBack} // Dışarı tıklanınca kapat
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] max-h-[80vh] bg-white rounded-lg z-50 p-4 shadow-xl flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-center pt-2 pb-4 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 hover:opacity-80 transition-opacity"
          >
            <Cancel />
          </button>
          <h2 className="font-raleway font-semibold text-lg text-gray-800">
            Move to List
          </h2>
        </div>

        {/* Content - Şimdilik sadece Yeni Liste Oluştur butonu */}
        {/* Eğer mevcut listeler gösterilecekse, burası map ile render edilebilir */}
        <div className="flex-grow overflow-y-auto py-3 space-y-2">
          {existingLists && existingLists.length > 0 ? (
            existingLists.map(list => (
              <button
                key={list.id}
                onClick={() => handleMoveToList(list.id)}
                disabled={productId === null}
                className="w-full flex items-center justify-between p-3 text-left rounded-md transition-colors 
                           hover:bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                <span className="font-inter text-sm truncate" title={list.name}>
                  {list.name}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600">
                  {list.productIds.length} item(s)
                </span>
              </button>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">No lists available. Create one!</p>
          )}
        </div>
        
        {/* Footer (Opsiyonel, belki bir Cancel butonu daha eklenebilir) */}
        {/* <div className="pt-4">
          <button onClick={onBack} className="w-full ...">Cancel</button>
        </div> */}

        <div className="pt-3 border-t border-gray-200">
          <button 
            onClick={handleCreateNewListClick}
            disabled={productId === null}
            className="w-full h-10 bg-blue-500 text-white rounded-md 
                       flex items-center justify-center gap-2 
                       hover:bg-blue-600 active:scale-95 transition-all duration-200
                       disabled:opacity-60 disabled:bg-gray-300"
          >
            <Add className="w-4 h-4"/>
            <span className="font-raleway font-medium text-sm">
              Create New List
            </span>
          </button>
        </div>
      </div>
    </>
  );
}