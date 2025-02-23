"use client"
import { useState } from 'react'
import Back from '../icons/Back'
import CreateNewListOverlay from './CreateNewListOverlay'

interface List {
  id: number;
  name: string;
  productCount: number;
}

interface ListSelectionOverlayProps {
  onBack: () => void;
  onCreateList?: (listId: number) => void;
}

export default function ListSelectionOverlay({ onBack, onCreateList }: ListSelectionOverlayProps) {
  const [selectedList, setSelectedList] = useState<number | null>(null)
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [lists, setLists] = useState<List[]>([
    { id: 1, name: "Elektronik", productCount: 0 },
    { id: 2, name: "Giyim", productCount: 0 },
    { id: 3, name: "Ev Eşyaları", productCount: 0 }
  ])

  const handleCreateList = (listName: string) => {
    const newList = {
      id: lists.length + 1,
      name: listName,
      productCount: 0
    }
    
    setLists(prev => [...prev, newList])
    onCreateList?.(newList.id)
    setShowCreateNew(false)
  }

  if (showCreateNew) {
    return (
      <CreateNewListOverlay 
        onBack={() => setShowCreateNew(false)} 
        onCreateList={handleCreateList}
        existingLists={lists.map(list => list.name)}
      />
    )
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onBack}
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[300px] bg-[#FFFFFF] rounded-lg z-50 p-4">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 hover:opacity-80 active:scale-95 transition-all"
        >
          <Back />
        </button>

        <h2 className="font-raleway text-[32px] mt-12 mb-4 ml-4">
          Listelerim
        </h2>

        <div className="space-y-2 mb-4">
          {lists.map(list => (
            <button
              key={list.id}
              className={`w-full p-3 text-left font-inter text-[16px] transition-colors
                        ${selectedList === list.id 
                          ? 'bg-[#FFE8BD] text-[#FF8800]' 
                          : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedList(list.id)}
            >
              {list.name}
            </button>
          ))}
        </div>

        <button 
          className="w-full p-3 text-left font-inter text-[16px] text-[#FF8800] 
                    hover:bg-[#FFE8BD] transition-colors"
          onClick={() => setShowCreateNew(true)}
        >
          + Yeni Liste Oluştur
        </button>

        {selectedList && (
          <button 
            className="w-[200px] h-[50px] bg-[#FF8800] rounded-lg text-white font-inter
                      hover:bg-[#FF7700] active:scale-95 transition-all mx-auto mt-4 block"
            onClick={onBack}
          >
            Listeye Taşı
          </button>
        )}
      </div>
    </>
  )
}