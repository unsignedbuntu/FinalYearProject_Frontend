"use client"
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Information from '@/components/icons/Information'
import Search from '@/components/icons/Search'
import CouponCard from '@/components/CouponCard'

// Örnek veri
const COUPONS = [
  { id: 1, amount: 20, minimumLimit: 200, validUntil: '10 January 2025', supplier: 'Trendyol' },
  { id: 2, amount: 500, minimumLimit: 2700, validUntil: '12 January 2025', supplier: 'Hepsiburada' },
  { id: 3, amount: 250, minimumLimit: 1200, validUntil: '12 January 2025', supplier: 'Amazon' },
  { id: 4, amount: 400, minimumLimit: 2300, validUntil: '12 January 2025', supplier: 'N11' }
]

const ITEMS_PER_PAGE = 4

export default function DiscountCouponsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Arama fonksiyonu
  const filteredCoupons = COUPONS.filter(coupon => 
    coupon.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sayfalama
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE)
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      
      <div className="ml-[480px]">
        <div className="w-[1020px] h-[750px] bg-[#FFFFFF] rounded-lg p-8 relative">
          {/* All Coupons Title */}
          <h1 
            className="font-inter text-[64px] font-normal text-[#FF9D00] absolute"
            style={{ top: '-44px', left: '135px' }}
          >
            All coupons
          </h1>

          {/* Information Text with Icon */}
          <div className="absolute" style={{ top: '-51px', left: '617px' }}>
            <Information className="absolute" style={{ top: '14px' }} />
            <div className="ml-[70px]">
             <p
                className="font-inter text-[48px] font-normal text-[#5365BF] leading-[56px]"
                style={{ whiteSpace: 'normal', lineHeight: '1.2' }}
             >
                 You can use your coupons in your cart
             </p>
            </div>
        
        </div>

          {/* My Coupons with Count */}
          <div 
            className="absolute flex items-center gap-2"
            style={{ top: '84px', left: '135px' }}
          >
            <span className="font-inter text-[40px] font-normal">My coupons</span>
            <span className="font-inter text-[40px] font-normal text-black opacity-30">
              ({filteredCoupons.length})
            </span>
          </div>

          {/* Discover Text */}
          <p 
            className="font-inter text-[40px] font-normal absolute"
            style={{ top: '153px', left: '135px' }}
          >
            All coupons you can discover
          </p>

          {/* Search Input */}
          <div 
            className="absolute"
            style={{ top: '227px', left: '134px' }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for the coupon provider"
                className="w-[800px] h-[60px] bg-[#D9D9D9] rounded-[20px] pl-12 pr-4
                         font-['Red_Hat_Display'] text-[24px] font-normal
                         placeholder-[#22262A] placeholder-opacity-30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#22262A] opacity-30" 
              />
            </div>
          </div>

          {/* Coupons Grid */}
          {currentCoupons.length > 0 ? (
            <div className="absolute grid grid-cols-2 gap-6" style={{ top: '317px', left: '134px' }}>
              {currentCoupons.map(coupon => (
                <CouponCard key={coupon.id} {...coupon} />
              ))}
            </div>
          ) : (
            <p className="absolute font-inter text-[24px] text-red-500" style={{ top: '317px', left: '134px' }}>
              No coupons found for the specified provider
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === page 
                      ? 'bg-[#FF9D00] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 