"use client"
import { useState, useEffect } from 'react'
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
import { useFavoritesStore, useFavoritesActions } from '@/app/stores/favoritesStore'
import Image from 'next/image'

export default function FavoritesPage() {
  const router = useRouter()
  const {
    products: favoriteProducts,
    sortType,
    showInStock,
    isLoading,
    error: favoritesError
  } = useFavoritesStore()
  
  const {
    initializeFavorites,
    setSortType,
    setShowInStock,
  } = useFavoritesActions()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)

  useEffect(() => {
    initializeFavorites();
  }, [initializeFavorites]);

  const handleSort = (type: string) => {
    setSortType(type)
    setIsSortOpen(false)
  }

  const filteredProducts = favoriteProducts.filter(product => {
    if (showInStock && !(product.inStock ?? true)) {
         return false;
    }
     if (!showInStock && (product.inStock ?? false)) {
         return false;
     }
    return true;
  });

  if (isLoading && favoriteProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading your favorites...</span>
      </div>
    );
  }

  if (favoritesError) {
     return (
       <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
         <p>Error: {favoritesError}</p>
         <button onClick={() => initializeFavorites()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
           Retry
         </button>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      {filteredProducts.length === 0 && !isLoading ? (
        <EmptyFavorites />
      ) : (
        <div className="ml-[480px]">
          <div className="mt-[30px]">
            <div className="flex justify-between items-center">
              <FavoritesHeader productCount={filteredProducts.length} />
              
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
                      { sortType === 'price-desc' ? 'Price (High-Low)' : 
                        sortType === 'price-asc' ? 'Price (Low-High)' : 
                        sortType === 'name-asc' ? 'Name (A-Z)' : 
                        sortType === 'name-desc' ? 'Name (Z-A)' : 
                        'Date Added'
                      }
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
            
            <div className="w-[1000px] h-auto bg-[#FFFFFF] mt-4 p-6 rounded-lg min-h-[750px]">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  className={`w-[140px] h-[50px] border rounded-lg font-inter text-[16px] 
                            transition-colors ${showInStock ? 'text-[#FF8800] border-[#FF8800]' : 'border-gray-300 hover:text-[#FF8800]'}`}
                  onClick={() => setShowInStock(true)}
                >
                  In Stock
                </button>
                
                <button 
                  className={`w-[160px] h-[50px] border rounded-lg font-inter text-[16px] 
                            transition-colors ${!showInStock ? 'text-[#FF8800] border-[#FF8800]' : 'border-gray-300 hover:text-[#FF8800]'} ml-4`}
                  onClick={() => setShowInStock(false)}
                >
                  Out of Stock
                </button>

                <button 
                  className="w-[120px] h-[50px] bg-blue-500 text-white rounded-lg font-inter text-[16px] 
                            transition-colors hover:bg-blue-600 active:bg-blue-700 ml-auto"
                  onClick={() => router.push('/favorites/edit')}
                >
                  Edit
                </button>
              </div>

              <ProductGrid 
                products={filteredProducts}
                context="favorites"
              />
            </div>
          </div>
        </div>
      )}

      {showCartSuccess && (
        <CartSuccessMessage onClose={() => setShowCartSuccess(false)} />
      )}
    </div>
  )
} 