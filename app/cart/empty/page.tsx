"use client"
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import CartIcon from '@/components/icons/CartIcon'

export default function EmptyCartPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      
      <div className="ml-[580px] mt-[160px]">
        <div className="w-[835px] h-[250px] bg-[#D9D9D9] rounded-lg relative">
          {/* Cart Icon */}
          <div className="absolute left-5 top-6">
            <CartIcon width={64} height={64} />
          </div>

          {/* Empty Cart Message */}
          <h1 
            className="font-raleway text-[48px] font-normal text-left absolute"
            style={{ top: '20px', left: '93px' }}
          >
            There are no products in your cart
          </h1>

          {/* Start Shopping Button */}
          <button
            onClick={() => router.push('/')} // Ana sayfaya yönlendir
            className="absolute w-[320px] h-[54px] bg-[#00EEFF] rounded-[15px] 
                     hover:bg-[#2F00FF] transition-all duration-200"
            style={{ top: '156px', left: '242px' }}
          >
            <span className="font-inter text-[32px] font-normal text-left
                         hover:text-white transition-colors duration-200">
              Start shopping
            </span>
          </button>
        </div>
      </div>
    </div>
  )
} 