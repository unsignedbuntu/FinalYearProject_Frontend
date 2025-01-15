"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import UserIcon from '../icons/UserIcon'
import FavoriteIcon from '../icons/FavoriteIcon'
import CartIcon from '../icons/CartIcon'
import Arrowdown from '../icons/Arrowdown'
import ArrowdownHover from '../icons/ArrowdownHover'
import GroupTeamHover from '../icons/GroupTeamHover'
import Image from 'next/image'
import FavoriteHover from '../icons/FavoritesPageHover'
import CartHover from '../icons/CartHover'
import SignInOverlay from '../overlay/SignInOverlay'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const router = useRouter()

  const toggleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignInOpen(!isSignInOpen);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Burada sepet kontrolü yapılacak, şimdilik cart sayfasına yönlendir
    router.push('/cart');
  };

  return (
    <header className="relative p-4">
      <Link href="/" className="absolute left-6 top-6">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </Link>

      <div className="absolute" style={{ left: '152px', top: '105px' }}>
        <h1 className="text-[18px] font-semibold font-raleway w-[331px] h-[30px]">
          Atalay's store management platform
        </h1>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
       

        <div className="flex-grow max-w-2xl" style={{ marginLeft: '-150px', marginTop: '10px' }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for product, category or brand"
              className="w-full px-4 py-2 rounded-lg bg-[#D9D9D9] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        
        <div className="flex items-center gap-7">
        
          <Link 
            href="/sign-up"
            onClick={toggleSignIn}
            className="relative w-[182px] h-[58px] bg-[#8CFF75] hover:bg-[#7ee569] rounded-lg transition-colors flex items-center group cursor-pointer"
          >
            <div className="pl-4 flex items-center">
              <div className="group-hover:hidden">
                <UserIcon />
              </div>
              <div className="hidden group-hover:block">
                <GroupTeamHover />
              </div>
            </div>
            <div className="flex flex-col ml-2" style={{ marginRight: '24px' }}>
              <span className="text-[20px] group-hover:text-[25px] text-black group-hover:text-[#792AE8] transition-all whitespace-nowrap">Sign in</span>
              <span className="text-[20px] group-hover:text-[25px] text-black group-hover:text-[#792AE8] transition-all whitespace-nowrap">or sign up</span>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="group-hover:hidden">
                <Arrowdown />
              </div>
              <div className="hidden group-hover:block">
                <ArrowdownHover />
              </div>
            </div>
          </Link>

         
          <Link 
            href="/favorites" 
            className="w-[162px] h-[58px] bg-[#ED7375] hover:bg-[#ED7375] rounded-lg transition-colors flex items-center justify-center gap-2 group"
          >
            <div className="group-hover:hidden">
                <FavoriteIcon width={24} height={24} />
            </div>
            <div className="hidden group-hover:block">
              <FavoriteHover />
            </div>
            <span className="text-[20px] group-hover:text-[26px] text-white group-hover:text-[#FFAE00] transition-all">
              Favorites
            </span>
          </Link>

          <Link 
            href="/cart" 
            onClick={handleCartClick}
            className="w-[162px] h-[58px] bg-[#D9D9D9] hover:bg-[#c2c2c2] rounded-lg transition-colors flex items-center justify-center gap-2 group"
          >
            <div className="group-hover:hidden">
              <CartIcon width={28} height={25} />   
            </div>
            <div className="hidden group-hover:block">
              <CartHover />
            </div>
            <span className="text-[20px] group-hover:text-[26px] text-black group-hover:text-[#FFFFFF] transition-all">
              My Cart
            </span>
          </Link>
        </div>
      </div>

      <SignInOverlay 
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </header>
  )
}
