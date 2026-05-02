"use client"
import { useState } from 'react'
import Back from '../icons/Back'
import ToggleOff from '../icons/ToggleOff'
import ToggleOn from '../icons/ToggleOn'
<<<<<<< HEAD
import Cancel from '../icons/Cancel'
import { FavoriteList } from '@/app/stores/favoritesStore'

export interface CreateNewListOverlayProps {
  productId: number | null;
  isOpen?: boolean;
  onBack: () => void;
  onListCreateAndMove: (productId: number, listName: string, isPrivate: boolean) => void;
  existingLists: FavoriteList[];
}

export default function CreateNewListOverlay({
  productId,
  onBack,
  onListCreateAndMove,
  existingLists 
}: CreateNewListOverlayProps) {
  const [listName, setListName] = useState('');

  const handleCreateAndMove = () => {
    if (!listName.trim()) {
      alert("Please enter a list name.");
      return;
    }
    if (existingLists.some(list => list.name.toLowerCase() === listName.trim().toLowerCase())) {
      alert("A list with this name already exists.");
      return;
    }
    if (productId === null) {
        alert("No product selected to add to the list.");
        return;
    }
    onListCreateAndMove(productId, listName.trim(), false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onBack}
      />
      
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[300px] h-[300px]
                    bg-[#FFFFFF] rounded-lg z-50 p-4 flex flex-col justify-between`}>
        <div className="relative flex items-center justify-center pt-2 pb-4">
          <button 
            onClick={onBack}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 hover:opacity-80 transition-opacity"
          >
            <Cancel />
          </button>
          <h2 className="font-raleway font-semibold text-[24px]"> 
            New list
          </h2>
        </div>

        <div className="flex-grow flex flex-col justify-center px-2 space-y-4">
          <input
            type="text"
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full h-[40px] 
                     bg-gray-100 rounded-[10px] px-4
                     font-raleway text-gray-600 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#FFE8BD]"
          />

          <div className="flex items-center justify-between">
            <span className="font-raleway text-[13px] w-4/5">
              Notify me when product prices in this list drop
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <button 
            onClick={handleCreateAndMove}
            className="w-full h-[50px] 
                     bg-[#FF8800] rounded-lg
                     font-raleway font-semibold text-white text-[16px]
                     hover:bg-[#FF7700] active:scale-95 transition-all duration-200
                     shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={!listName.trim() || productId === null}
          >
            Create and move
          </button>

          <button 
            onClick={onBack}
            className="w-full h-[45px]
                     bg-[#FFEFE5] rounded-lg
                     font-raleway font-normal text-[#FF8800] text-[16px]
                     hover:bg-[#FFE8BD] active:scale-95 transition-all duration-200
                     shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
=======
import SuccessMessage from '@/components/messages/SuccessMessage'
import DeleteMessageFavorites from '@/components/messages/DeleteMessageFavorites'
import CloseIcon from '../icons/Close.png'
import Cancel from '../icons/Cancel'

interface CreateNewListOverlayProps {
  onBack: () => void;
  onCreateList: (listName: string) => void;
  existingLists: string[];
}

export default function CreateNewListOverlay({ onBack, onCreateList, existingLists }: CreateNewListOverlayProps) {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCreateAndMove = () => {
    setShowSuccess(true)
  }

  const handleClose = () => {
    setShowSuccess(false)
    onBack()
  }

  return (
    <>
      {showSuccess ? (
          <DeleteMessageFavorites onClose={handleClose} />
      ) : (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onBack}
          />
          
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-[300px] ${isNotificationEnabled ? 'h-[450px]' : 'h-[400px]'} 
                        bg-[#FFFFFF] rounded-lg z-50`}>
            {/* Close button */}
            <button 
              onClick={onBack}
              className="absolute left-[17px] top-[33px] hover:opacity-80 transition-opacity"
            >
              <Cancel />
            </button>

            {/* Title */}
            <h2 className="absolute font-raleway font-normal text-[48px] left-[61px] top-[51px]">
              New list
            </h2>

            {/* List name input */}
            <input
              type="text"
              placeholder="List name"
              className="absolute left-[25px] top-[133px] w-[250px] h-[40px] 
                       bg-gray-100 rounded-[10px] px-4
                       font-raleway text-gray-600 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#FFE8BD]"
            />

            {/* Notification text */}
            <div className="absolute left-[7px] top-[185px] font-raleway font-normal text-[16px] w-[230px]">
              I would like to be notified when the price of the products in this list drops
            </div>

            {/* Toggle button */}
            <button 
              onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
              className="absolute left-[247px] top-[229px] hover:opacity-90 active:scale-95 transition-all"
            >
              {isNotificationEnabled ? <ToggleOn /> : <ToggleOff />}
            </button>

            {/* Extended content when notifications are enabled */}
            {isNotificationEnabled && (
              <>
                {/* Create and Move button */}
                <button 
                  onClick={handleCreateAndMove}
                  className="absolute left-[75px] top-[277px] w-[150px] h-[65px] 
                           bg-[#FF8800] rounded-lg
                           font-raleway font-normal text-white text-[16px]
                           hover:bg-[#FF7700] active:scale-95 transition-all duration-200
                           shadow-md hover:shadow-lg"
                >
                  Create and move
                </button>

                {/* Cancel button */}
                <button 
                  onClick={onBack}
                  className="absolute left-[75px] top-[365px] w-[150px] h-[60px]
                           bg-[#FFEFE5] rounded-lg
                           font-raleway font-normal text-[#FF8800] text-[16px]
                           hover:bg-[#FFE8BD] active:scale-95 transition-all duration-200
                           shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
>>>>>>> main
}