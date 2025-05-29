"use client"
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Cart from '../icons/Cart'
import MyReviews from '../icons/MyReviews'
import Coupon from '../icons/Coupon'
import Stores from '../icons/Stores'
import UserInfSidebar from '../icons/UserInfSidebar'
import FavoriteSidebar from '../icons/FavoriteSidebar'
import KtunGPT from '../icons/KtunGPT'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <div 
      className="w-[300px] h-[880px] bg-[#f8f8f8] p-[15px_16px_47px_24px] m-[32px_34px_0_23px]"
      style={{ position: 'absolute', left: '47px', top: '55px' }}
    >
      {/* My Orders Section */}
      <div className="mb-[36px]">
        <div className="w-[250px] h-[240px] bg-white m-[0_7px_36px_3px] p-4">
          <h2 className="w-[115px] h-[28px] font-raleway text-[24px] text-black mb-4">
            My Orders
          </h2>
          <div className="w-[250px] h-[1px] bg-red-500 mb-1 ml-[-16px]" />
          
          <Link href="/my-orders">
            <div className={`flex items-center gap-2 mb-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 ${pathname === '/my-orders' ? 'bg-[#00EEFF]' : ''}`}>
              <div className="w-[40px] flex justify-start">
                <Stores width={37} height={37} />
              </div>
              <span className="font-raleway text-[20px] text-black whitespace-nowrap">
                All My Orders
              </span>
            </div>
          </Link>

          <div 
            className={`flex items-center gap-2 mb-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 cursor-pointer ${pathname === '/cart' ? 'bg-[#00EEFF]' : ''}`}
            onClick={handleCartClick}
          >
            <div className="w-[40px] flex justify-start">
              <Cart width={48} height={34} />
            </div>
            <span className="font-raleway text-[20px] text-black whitespace-nowrap">
              My cart
            </span>
          </div>

          <Link href="/my-reviews">
            <div className={`flex items-center gap-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 -mt-3 ${pathname === '/my-reviews' ? 'bg-[#00EEFF]' : ''}`}>
              <div className="w-[40px] flex justify-start">
                <MyReviews width={50} height={38} />
              </div>
              <span className="font-raleway text-[20px] text-black whitespace-nowrap">
                My reviews
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Special for you Section */}
      <div className="mb-[36px]">
        <div className="w-[250px] h-[180px] bg-white m-[0_7px_36px_3px] p-4">
          <h2 className="w-[164px] h-[21.6px] font-raleway text-[24px] text-black mb-4">
            Special for you
          </h2>
          <div className="w-[250px] h-[1px] bg-red-500 mb-1 ml-[-16px]" />
          
          <div 
            className={`flex items-center gap-2 mb-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 cursor-pointer ${pathname === '/discount-coupons' ? 'bg-[#00EEFF]' : ''}`}
            onClick={() => router.push('/discount-coupons')}
          >
            <div className="w-[40px] flex justify-start">
              <Coupon width={37} height={37} />
            </div>
            <span className="font-raleway text-[20px] text-black whitespace-nowrap">
              My discount coupons
            </span>
          </div>

          <Link href="/my-followed-stores">
            <div className={`flex items-center gap-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 ${pathname === '/my-followed-stores' ? 'bg-[#00EEFF]' : ''}`}>
              <div className="w-[40px] flex justify-start">
                <Stores width={37} height={37} />
              </div>
              <span className="font-raleway text-[20px] text-black whitespace-nowrap">
                My followed stores
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* My Account Section */}
      <div className="mb-[36px]">
        <div className="w-[250px] h-[190px] bg-white m-[0_7px_36px_3px] p-4">
          <h2 className="w-[164px] h-[21.6px] font-raleway text-[24px] text-black mb-4">
            My Account
          </h2>
          <div className="w-[250px] h-[1px] bg-red-500 mb-1 ml-[-16px]" />
          
          <Link href="/user-info">
            <div className={`flex items-center gap-2 mb-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 ${pathname === '/user-info' ? 'bg-[#00EEFF]' : ''}`}>
              <div className="w-[40px] flex justify-start">
                <UserInfSidebar width={37} height={37} />
              </div>
              <span className="font-raleway text-[20px] text-black whitespace-nowrap">
                My user information
              </span>
            </div>
          </Link>

          <Link href="/favorites">
            <div className={`flex items-center gap-2 mb-2 p-2 hover:bg-[#FFE8D6] rounded-md transition-colors -mx-4 pl-2 ${pathname === '/favorites' ? 'bg-[#00EEFF]' : ''}`}>
              <div className="w-[40px] flex justify-start">
                <FavoriteSidebar width={37} height={37} />
              </div>
              <span className="font-raleway text-[20px] text-black whitespace-nowrap">
                My favorites
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* KTUNGpt Section */}
      <div 
        className="w-[260px] h-[150px] mx-auto mt-[20px] p-[5px_2px_35px_6px] rounded-lg"
        style={{ backgroundColor: 'rgba(225, 255, 0, 0.5)' }}
      >
        <div className="flex items-start gap-2 mb-2">
          <KtunGPT width={50} height={50} className="text-[#4000FF]" />
          <span className="font-raleway text-[26px] text-[#4000FF]">
            Ask to KTUNGpt
          </span>
        </div>
        
        <div className="font-raleway text-[16px] leading-tight mt-6">
          I'm always Here! I answer your questions immediately!
        </div>
      </div>
    </div>
  )
} 