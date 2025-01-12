"use client"
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EmptyFavorites from '@/components/empty-states/EmptyFavorites'
import FavoritesHeader from '@/components/favorites/FavoritesHeader'
import Arrowdown from '@/components/icons/Arrowdown'
import SortOverlay from '@/components/favorites/SortOverlay'
import ProductGrid from '@/components/favorites/ProductGrid'
import MoveToListOverlay from '@/components/favorites/MoveToListOverlay'
import { useRouter } from 'next/navigation'
import CartSuccessMessage from '@/components/favorites/CartSuccessMessage'
import ListSelectionOverlay from '@/components/favorites/ListSelectionOverlay'
import FavoriteLists from '@/components/favorites/FavoriteLists'

export default function FavoritesPage() {
 
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortType, setSortType] = useState('default')
  const [showInStock, setShowInStock] = useState(true)
  const [showMoveToList, setShowMoveToList] = useState(false)
  const [showListSelection, setShowListSelection] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const router = useRouter()
  
  // Örnek veri
  const [favoriteProducts, setFavoriteProducts] = useState([
    { id: 1, name: "Nike Red Shoes", price: 299.99, date: new Date('2024-01-01'), image: "/slider/1000_F_46594969_DDZUkjGFtkv0jDMG7676blspQlgOkf1n.jpg", inStock: true },
    { id: 2, name: "Space View", price: 199.99, date: new Date('2024-01-02'), image: "/slider/1000_F_139838537_ahJnL2GCKQviBW9JWjpUq4q8GlgRcwU3.jpg", inStock: true }
  ])

  const handleSort = (type: string) => {
    const sorted = [...favoriteProducts]
    
    switch(type) {
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'oldest':
        sorted.sort((a, b) => a.date.getTime() - b.date.getTime())
        break
      case 'newest':
        sorted.sort((a, b) => b.date.getTime() - a.date.getTime())
        break
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
    
    setFavoriteProducts(sorted)
    setSortType(type)
  }

  const handleCartSuccess = () => {
    setShowCartSuccess(true)
    // 2 saniye sonra ListSelectionOverlay'i göster
    setTimeout(() => {
      setShowCartSuccess(false)
      setShowListSelection(true)
    }, 2000)
  }

  const handleMoveToList = (productId: number, listId: number) => {
    // Ürünü eski listeden kaldır
    setFavoriteProducts(prev => prev.filter(p => p.id !== productId))
    
    // Ürünü yeni listeye ekle
    // Bu işlem FavoriteLists komponenti içinde yapılacak
    // Context veya global state management kullanılabilir
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
                      Default
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