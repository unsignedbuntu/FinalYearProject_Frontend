"use client"
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EmptyFavorites from '@/app/favorites/EmptyFavorites'
import FavoritesHeader from '@/components/messages/FavoritesHeader'
import Arrowdown from '@/components/icons/Arrowdown'
import SortOverlay from '@/components/overlay/SortOverlay'
import ProductGrid from '@/app/products/ProductGrid'
import MoveToListOverlay from '@/components/overlay/MoveToListOverlay'
import { useRouter } from 'next/navigation'
import CartSuccessMessage from '@/components/messages/CartSuccessMessage'
import ListSelectionOverlay from '@/components/overlay/ListSelectionOverlay'
import FavoriteLists from '@/components/messages/FavoriteLists'
import { useFavoritesStore } from '@/app/stores/favoritesStore'

export default function FavoritesPage() {
  const router = useRouter()
  const {
    products: favoriteProducts,
    sortType,
    showInStock,
    setSortType,
    setShowInStock,
    sortProducts,
  } = useFavoritesStore()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showMoveToList, setShowMoveToList] = useState(false)
  const [showListSelection, setShowListSelection] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)

  const handleSort = (type: string) => {
    sortProducts(type)
    setSortType(type)
  }

  const handleCartSuccess = () => {
    setShowCartSuccess(true)
    setTimeout(() => {
      setShowCartSuccess(false)
      setShowListSelection(true)
    }, 2000)
  }

  const handleMoveToList = (productId: number, listId: number) => {
    // Ürünü eski listeden kaldır
    useFavoritesStore.getState().removeProduct(productId)
    
    // Ürünü yeni listeye ekle
    // Bu işlem FavoriteLists komponenti içinde yapılacak
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      {favoriteProducts.length > 0 ? (
        <div className="ml-[480px]">
          <div className="mt-[30px]">
            <div className="flex justify-between items-center">
              <FavoritesHeader productCount={favoriteProducts.length} />
              
              <div className="flex items-center gap-8 mr-[470px]">
                <span className="font-inter text-[36px] font-normal">
                  Sort
                </span>
                
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center bg-[#D9D9D9] w-[200px] h-[75px] rounded-lg px-4 justify-between"
                  >
                    <span className="font-inter text-[32px] font-normal text-[#FF8800]">
                      {sortType}
                    </span>
                    <div className="w-[13px] h-[8px]">
                      <Arrowdown className="text-[#FF8800]" />
                    </div>
                  </button>

                  <SortOverlay 
                    isOpen={isSortOpen}
                    onClose={() => setIsSortOpen(false)}
                    onSort={handleSort}
                  />
                </div>
              </div>
            </div>
            
            {/* Ana içerik alanı */}
            <div className="w-[1000px] h-[750px] bg-[#FFFFFF] mt-4 p-6 rounded-lg">
              {/* Filtre butonları */}
              <div className="flex items-center gap-4">
                <button 
                  className={`w-[140px] h-[50px] border border-gray-300 rounded-lg font-inter text-[16px] 
                            transition-colors ${showInStock ? 'text-[#FF8800] border-[#FF8800]' : 'hover:text-[#FF8800]'}`}
                  onClick={() => setShowInStock(true)}
                >
                  In stock
                </button>
                
                <button 
                  className={`w-[160px] h-[50px] border border-gray-300 rounded-lg font-inter text-[16px] 
                            transition-colors ${!showInStock ? 'text-[#FF8800] border-[#FF8800]' : 'hover:text-[#FF8800]'} ml-4`}
                  onClick={() => setShowInStock(false)}
                >
                  Out of stock
                </button>

                <button 
                  className="w-[200px] h-[75px] bg-[#00EEFF] rounded-lg font-inter text-[32px] 
                            text-black ml-[110px] transition-colors hover:text-[#8CFF75]"
                  onClick={() => router.push('/favorites/edit')}
                >
                  Edit
                </button>
              </div>

              <ProductGrid 
                products={favoriteProducts}
                showInStock={showInStock}
              />
            </div>
          </div>
          
          <FavoriteLists />
        </div>
      ) : (
        <EmptyFavorites />
      )}

      {showMoveToList && (
        <MoveToListOverlay onBack={() => setShowMoveToList(false)} />
      )}

      {showCartSuccess && (
        <CartSuccessMessage onClose={() => setShowCartSuccess(false)} />
      )}

      {showListSelection && (
        <ListSelectionOverlay onBack={() => setShowListSelection(false)} />
      )}
    </div>
  )
} 