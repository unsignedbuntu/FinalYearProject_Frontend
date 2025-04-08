"use client"
import FavoriteIcon from '../../components/icons/FavoriteIcon'
import { useUIStore } from '@/app/stores/uiStore'

export default function EmptyFavorites() {
  const openStoresMegaMenu = useUIStore((state) => state.openStoresMegaMenu)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[835px] h-[300px] flex flex-col items-center justify-center bg-[#D9D9D9]">
        <FavoriteIcon width={64} height={72} className="text-[#FF0000] mb-6" />
        
        <h1 className="font-inter text-[48px] font-normal text-center leading-tight mb-8">
          There are no products in
          <br />
          my favorites list yet.
        </h1>

        <div 
          onClick={openStoresMegaMenu}
          className="relative w-[354px] h-[74px] rounded-[15px] flex items-center justify-center transition-all duration-300 group cursor-pointer"
          style={{ backgroundColor: '#00EEFF' }}
        >
          <span 
            className="relative z-10 font-inter text-[24px] font-normal text-[#FF0000] group-hover:text-[#FFFFFF] transition-colors"
          >
            Start shopping now and add your favorite products!
          </span>

          <div 
            className="absolute inset-0 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: '#2F00FF' }}
          />
        </div>
      </div>
    </div>
  )
}
