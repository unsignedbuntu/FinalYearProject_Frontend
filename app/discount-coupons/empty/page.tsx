"use client"
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import Coupon from '@/components/icons/Coupon'

export default function EmptyDiscountCouponsPage() {

    const router = useRouter()

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      
      <div className="ml-[480px] relative">
        <div className="w-[835px] h-[250px] bg-[#D9D9D9] rounded-lg">
          {/* Coupon icon */}
          <div className="absolute left-[5px] top-[24px]">
            <Coupon width={64} height={64} color="#FF9D00" />
          </div>

          <h1 
            className="text-[64px] font-inter font-normal absolute text-[#FF9D00]"
            style={{ top: '7px', left: '76px' }}
          >
            You don't have a coupon
          </h1>
          <p 
            className="text-[36px] font-inter font-normal absolute"
            style={{ top: '163px', left: '147px' }}
          >
            No coupon found for your account
          </p>
        </div>
      </div>
    </div>
  )
} 