"use client"
import { useState } from 'react'
import Image from 'next/image'
import Cancel from '../icons/Cancel'
import DeleteMessageFavorites from '@/components/messages/DeleteMessageFavorites'

interface DeleteOverlayProps {
  productCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOverlay({ productCount, onClose, onConfirm }: DeleteOverlayProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setShowSuccess(true)
  }

  return (
    <>
      {showSuccess ? (
        <DeleteMessageFavorites onClose={onClose} />
      ) : (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-[400px] h-[330px] bg-white rounded-lg z-50">
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute left-[17px] top-[33px] hover:opacity-80 transition-opacity"
            >
              <Cancel />
            </button>

            {/* Delete message */}
            <div className="absolute left-[85px] top-[69px]">
              <div className="font-inter text-[32px] text-center">
                Are you sure you want to
                <br />
                delete {productCount} products?
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute left-[33px] top-[254px] flex gap-7">
              {/* Cancel button */}
              <button
                onClick={onClose}
                className="w-[150px] h-[60px] bg-[#FFEFE5] rounded-lg
                         font-inter text-[#FF8800] text-[16px]
                         hover:bg-[#FFE8BD] transition-colors"
              >
                Cancel
              </button>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                className="w-[150px] h-[60px] bg-[#FF8800] rounded-lg
                         font-inter text-white text-[16px]
                         hover:bg-[#FF7700] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
