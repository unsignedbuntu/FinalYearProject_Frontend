"use client"
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import TicIcon from '../icons/TicIcon'
import TicHover from '../icons/Tic_Hover'

const stores = {
  electronics: {
    name: "Electronics",
    categories: [
      {
        title: "Computers/Tablet",
        items: ["Regular Savings Accounts", "Deluxe Savings Accounts", "Super Savings Accounts", "Family Savings Accounts"]
      },
      {
        title: "Printers & Projectors",
        items: ["Savings Accounts", "Deposits"]
      },
      {
        title: "Telephone",
        items: ["Savings Accounts", "Deposits", "Current Accounts"]
      },
      {
        title: "TV, Visual and Audio Systems",
        items: ["Savings Accounts", "Deposits", "Current Accounts"]
      },
      {
        title: "White Goods",
        items: ["Regular Savings Accounts", "Deluxe Savings Accounts", "Super Savings Accounts"]
      },
      {
        title: "Air Conditioners and Heaters",
        items: ["Regular Savings Accounts", "Deluxe Savings Accounts", "Super Savings Accounts"]
      }
    ]
  },
  fashion: {
    name: "Fashion",
    categories: [
      {
        title: "Women's Clothing",
        items: ["Millionaire Investment Plan", "Another Plan", "Cool plan"]
      },
      {
        title: "Women's Accessories and Jewelry",
        items: ["Savings Accounts", "Deposits", "Fixed"]
      },
      {
        title: "Men's Clothing",
        items: ["Savings Accounts", "Deposits", "Current Accounts", "New Account"]
      },
      {
        title: "Men's Accessories and Jewelry",
        items: ["Savings Accounts", "Deposits", "Current Accounts", "New Account"]
      }
    ]
  },
  supermarket: {
    name: "Supermarket and Petshop",
    categories: [
      {
        title: "Cleaning Products",
        items: ["Regular Savings Accounts", "Deluxe Savings Accounts", "Super Savings Accounts"]
      },
      {
        title: "Diaper and Wet Wipes",
        items: ["Savings Accounts", "Deposits"]
      },
      {
        title: "Paper Products",
        items: ["Savings Accounts", "Deposits", "Current Accounts"]
      },
      {
        title: "Drinks",
        items: ["Savings Accounts", "Deposits", "Current Accounts"]
      },
      {
        title: "Food Products",
        items: ["Savings Accounts", "Deposits", "Current Accounts"]
      }
    ]
  }
}

export default function StoresMegaMenu() {
  const [activeStore, setActiveStore] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false)
      setActiveStore(null)
    }, 100) // Küçük bir gecikme ekleyerek geçişleri yumuşatıyoruz
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      {/* Default Stores Button */}
      <Link 
        href="/stores" 
        className="h-[47px] w-[200px] flex items-center justify-center rounded-lg text-black hover:bg-opacity-40 transition-all group relative"
        style={{ backgroundColor: 'rgba(255, 255, 0, 0.35)' }}
      >
        <span className="font-satisfy text-2xl group-hover:text-[#FF0303] group-hover:text-[28px] transition-all">Stores</span>
        <span className="absolute right-2 group-hover:hidden"><TicIcon /></span>
        <span className="absolute right-2 hidden group-hover:block"><TicHover /></span>
      </Link>

      {/* Triangle Indicator */}
      {isMenuOpen && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
          <div className="w-4 h-4 bg-white rotate-45 transform origin-center shadow-lg"></div>
        </div>
      )}

      {/* Mega Menu */}
      {isMenuOpen && (
        <div 
          className="absolute top-[52px] left-0 w-[1200px] bg-white shadow-lg rounded-lg p-6 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex">
            {/* Stores List */}
            <div className="w-[200px] border-r border-gray-200 pr-4">
              {Object.entries(stores).map(([key, store]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 cursor-pointer rounded transition-colors ${
                    activeStore === key ? 'text-[#1D4ED8]' : 'text-gray-700 hover:text-[#1D4ED8]'
                  }`}
                  onMouseEnter={() => setActiveStore(key)}
                >
                  {store.name}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>

            {/* Categories */}
            {activeStore && (
              <div className="flex-1 pl-8">
                <div className="grid grid-cols-2 gap-8">
                  {stores[activeStore as keyof typeof stores].categories.map((category, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                      <h3 className="text-lg font-medium text-[#1D4ED8] mb-3 hover:text-blue-700 cursor-pointer flex items-center justify-between">
                        {category.title}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link href="#" className="text-gray-600 hover:text-[#1D4ED8]">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 