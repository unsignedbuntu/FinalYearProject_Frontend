"use client"
import { useState } from 'react'
import Back from '../icons/Back'
import ToggleOff from '../icons/ToggleOff'
import ToggleOn from '../icons/ToggleOn'
import SuccessMessage from '@/components/messages/SuccessMessage'
import DeleteMessageFavorites from '@/components/messages/DeleteMessageFavorites'
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
}