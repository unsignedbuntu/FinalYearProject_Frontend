"use client"
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import Address from '@/components/icons/Address'

export default function EmptyAddressPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen pr-[160px] pt-[320px] relative">
        <Sidebar />
      
      <div className="ml-[480px]">
        <div className="w-[835px] h-[250px] bg-[#D9D9D9] mx-auto relative rounded-lg">
          {/* Address icon */}
          <div className="absolute left-[10px] top-[48px]">
            <Address width={64} height={64} color="#FF0000" />
          </div>

        {/* Error message */}
        <p className="absolute left-[80px] top-[36px] 
                     font-inter text-[64px] text-[#FF0000]">
          Saved address not found
        </p>

          {/* Add new address button */}
          <button
            onClick={() => router.push('/address/new')}
            className="absolute left-[262px] top-[153px]
                      w-[320px] h-[55px] bg-[#00EEFF] rounded-[15px]
                      font-inter text-[32px] text-black
                      transition-all duration-200
                      hover:bg-[#2F00FF] hover:text-white"
          >
            Add new address
          </button>
        </div>
      </div>
    </div>
  )
} 