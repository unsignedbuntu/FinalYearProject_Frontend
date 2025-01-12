"use client"
import { useState } from 'react'
import Add from '../icons/Add'
import CreateNewListOverlay from './CreateNewListOverlay'
import Cancel from '../icons/Cancel'

interface MoveToListOverlayProps {
  onBack: () => void;
}

export default function MoveToListOverlay({ onBack }: MoveToListOverlayProps) {
  const [showCreateList, setShowCreateList] = useState(false)

  const handleCancel = () => {
    onBack();
  }

  return (
    <>
      {showCreateList ? (
        <CreateNewListOverlay onBack={onBack} />
      ) : (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={handleCancel}
          />
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFFFFF] rounded-lg z-50">
            <button 
              onClick={handleCancel}
              className="absolute top-4 left-4 hover:opacity-80 active:scale-95 transition-all"
            >
              <Cancel />
            </button>

            <h2 className="absolute font-raleway font-normal text-[32px] left-4 top-[64px]">
              Move to another list
            </h2>

            <button 
              onClick={() => setShowCreateList(true)}
              className="absolute left-[35px] top-[132px] w-[230px] h-[40px] bg-[#FFE8BD] rounded-lg 
                       flex items-center justify-center gap-2 
                       hover:bg-[#FFD280] active:scale-95 transition-all duration-200"
            >
              <Add />
              <span className="font-raleway font-normal text-[24px] text-[#FF7700]">
                Create new list
              </span>
            </button>
          </div>
        </>
      )}
    </>
  )
}