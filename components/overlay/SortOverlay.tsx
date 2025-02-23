"use client"
import { useState } from 'react'

interface SortOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (sortType: string) => void;
}

export default function SortOverlay({ isOpen, onClose, onSort }: SortOverlayProps) {
  if (!isOpen) return null;

  const sortOptions = [
    { id: 'price-high', label: 'Sort by Price(High to Low)' },
    { id: 'price-low', label: 'Sort by Price(Low to High)' },
    { id: 'oldest', label: 'Sort by Oldest' },
    { id: 'newest', label: 'Sort by Newest' },
    { id: 'name-asc', label: 'Sort by Name(A-Z)' },
    { id: 'name-desc', label: 'Sort by Name(Z-A)' }
  ]

  return (
    <>
      {/* Overlay arka planı - tıklanabilir alan */}
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      
      {/* Sort menüsü */}
      <div 
        className="absolute z-50 w-[220px] h-[260px] bg-[#FFFFFF] shadow-lg rounded-lg"
        style={{ top: '75px' }}
      >
        <div className="py-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className="w-full px-4 py-2 text-left font-inter text-[16px] hover:text-[#FF8800] transition-colors"
              onClick={() => {
                onSort(option.id)
                onClose()
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
} 