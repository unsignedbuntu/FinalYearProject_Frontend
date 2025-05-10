"use client"
import { useState } from 'react'
import Back from '../icons/Back'
import ToggleOff from '../icons/ToggleOff'
import ToggleOn from '../icons/ToggleOn'
import Cancel from '../icons/Cancel'
import { FavoriteList } from '@/app/stores/favoritesStore'

export interface CreateNewListOverlayProps {
  productId: number | null;
  isOpen?: boolean;
  onBack: () => void;
  onListCreateAndMove: (productId: number, listName: string, notify: boolean) => void;
  existingLists: FavoriteList[];
}

export default function CreateNewListOverlay({
  productId,
  onBack,
  onListCreateAndMove,
  existingLists 
}: CreateNewListOverlayProps) {
  const [listName, setListName] = useState('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

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
    onListCreateAndMove(productId, listName.trim(), isNotificationEnabled);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onBack}
      />
      
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[300px] ${isNotificationEnabled ? 'h-[350px]' : 'h-[300px]'}
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
            <button 
              onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
              className="hover:opacity-90 active:scale-95 transition-all"
            >
              {isNotificationEnabled ? <ToggleOn /> : <ToggleOff />}
            </button>
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
}