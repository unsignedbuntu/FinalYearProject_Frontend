"use client"
import { useState } from 'react'
import Cancel from '../icons/Cancel'
import ArrowRight from '../icons/ArrowRight'
import Trash from '../icons/Trash'
import MoveToListOverlay from './MoveToListOverlay'
import DeleteSuccessMessage from '../messages/DeleteSuccessMessage'

interface MenuOverlayProps {
  onClose: () => void;
}

export default function MenuOverlay({ onClose }: MenuOverlayProps) {
  const [showMoveToList, setShowMoveToList] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  const handleDelete = () => {
    setShowDeleteSuccess(true)
  }

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccess(false)
    onClose()
  }

  return (
    <>
      {showDeleteSuccess ? (
        <DeleteSuccessMessage onClose={handleDeleteSuccessClose} />
      ) : showMoveToList ? (
        <MoveToListOverlay onBack={() => setShowMoveToList(false)} />
      ) : (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-[#FFFFFF] rounded-lg z-50 p-4">
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 hover:opacity-80"
            >
              <Cancel />
            </button>

            <div className="mt-8 space-y-4">
              <button 
                className="flex items-center px-4 w-full hover:bg-gray-50 py-2 rounded-lg"
                onClick={() => setShowMoveToList(true)}
              >
                <ArrowRight />
                <span className="ml-[15px] font-raleway text-[16px]">
                  Move to another list
                </span>
              </button>

              <button 
                className="flex items-center px-4 w-full hover:bg-gray-50 py-2 rounded-lg"
                onClick={handleDelete}
              >
                <Trash />
                <span className="ml-[15px] font-raleway text-[16px]">
                  Delete from list
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
} 