"use client"
import Link from 'next/link'
import React from 'react'
import TicIcon from '../icons/TicIcon'
import TicHover from '../icons/Tic_Hover'
import StoresMegaMenu from '../megamenu/StoresMegaMenu'

export default function NavigationBar() {
  return (
    <nav 
      className="absolute z-50"
      style={{ left: '777px', top: '96px', width: '810px', height: '49px' }}
    >
      <div className="flex items-center gap-[25px]">
        <StoresMegaMenu />
        <Link 
          href="/loyalty-program" 
          className="h-[47px] w-[220px] flex items-center  group-hover:justify-start pl-4 rounded-lg text-black hover:bg-opacity-40 transition-all group relative"
          style={{ backgroundColor: 'rgba(255, 255, 0, 0.35)' }}
        >
          <div className="flex flex-col items-center group-hover:items-start">
            <span className="font-satisfy text-2xl group-hover:text-[#FF0303] group-hover:text-[28px] transition-all leading-6">Loyalty Program</span>
          </div>
          <span className="absolute right-2 group-hover:hidden"><TicIcon /></span>
          <span className="absolute right-2 hidden group-hover:block"><TicHover /></span>
        </Link>
        
        <Link 
          href="/ktungpt" 
          className="h-[47px] w-[180px] flex items-center group-hover:justify-start pl-4 rounded-lg text-black hover:bg-opacity-40 transition-all group relative"
          style={{ backgroundColor: 'rgba(255, 255, 0, 0.35)' }}
        >
          <span className="font-satisfy text-2xl group-hover:text-[#FF0303] group-hover:text-[28px] transition-all">KtunGPT</span>
          <span className="absolute right-2 group-hover:hidden"><TicIcon /></span>
          <span className="absolute right-2 hidden group-hover:block"><TicHover /></span>
        </Link>
        
        <Link 
          href="/support" 
          className="h-[47px] w-[160px] flex items-center  group-hover:justify-start pl-4 rounded-lg text-black hover:bg-opacity-40 transition-all group relative"
          style={{ backgroundColor: 'rgba(255, 255, 0, 0.35)' }}
        >
          <span className="font-satisfy text-2xl group-hover:text-[#FF0303] group-hover:text-[28px] transition-all">Support</span>
          <span className="absolute right-2 group-hover:hidden"><TicIcon /></span>
          <span className="absolute right-2 hidden group-hover:block"><TicHover /></span>
        </Link>
      </div>
    </nav>
  )
} 