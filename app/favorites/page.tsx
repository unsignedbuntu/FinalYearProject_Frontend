"use client"
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EmptyFavorites from '@/app/favorites/EmptyFavorites'
import FavoritesHeader from '@/components/messages/FavoritesHeader'
import Arrowdown from '@/components/icons/Arrowdown'
import SortOverlay from '@/components/overlay/SortOverlay'
import ProductGrid from '@/app/products/ProductGrid'
import { useRouter } from 'next/navigation'
import CartSuccessMessage from '@/components/messages/CartSuccessMessage'
import { useFavoritesStore, useFavoritesActions, FavoriteProduct, FavoriteList } from '@/app/stores/favoritesStore'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

// Import actual overlay components
import MenuOverlay from '@/components/overlay/MenuOverlay'
import MoveToListRealOverlay from '@/components/overlay/MoveToListOverlay'
import CreateNewListOverlay, { CreateNewListOverlayProps } from '@/components/overlay/CreateNewListOverlay'

// Placeholder for ProductActionMenu - in a real scenario, use Radix Dropdown or similar
const ProductActionMenu = ({ isOpen, onClose, onMoveToList, onDelete }: { isOpen: boolean, onClose: () => void, onMoveToList: () => void, onDelete: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-0 right-0 mt-8 mr-2 bg-white shadow-lg rounded-md p-2 z-10">
      <button onClick={onMoveToList} className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100">Move to another list</button>
      <button onClick={onDelete} className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100">Delete from list</button>
      <button onClick={onClose} className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 mt-1 border-t pt-1">Cancel</button>
    </div>
  );
};

export default function FavoritesPage() {
  const router = useRouter()
  const {
    products: favoriteProducts,
    lists: favoriteLists,
    sortType,
    showInStock,
    isLoading,
    error: favoritesError
  } = useFavoritesStore()
  
  const {
    initializeFavorites,
    setSortType,
    setShowInStock,
    removeProduct,
    createListAndAddProduct,
  } = useFavoritesActions()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [currentOverlay, setCurrentOverlay] = useState<'menu' | 'moveTo' | 'createList' | null>(null)

  useEffect(() => {
    initializeFavorites();
  }, [initializeFavorites]);

  const handleSort = (type: string) => {
    setSortType(type)
    setIsSortOpen(false)
  }

  const handleProductMenuClick = useCallback((productId: number) => {
    setSelectedProductId(productId)
    setCurrentOverlay('menu')
  }, [])

  const closeAllOverlays = useCallback(() => {
    setCurrentOverlay(null)
  }, [])

  const handleDeleteAction = useCallback(async () => {
    if (selectedProductId !== null) {
      try {
        await removeProduct(selectedProductId);
        toast.success("Product removed from favorites.")
      } catch (error) {
        toast.error("Failed to remove product.")
        console.error("Delete error:", error)
      }
    }
    closeAllOverlays()
    setSelectedProductId(null);
  }, [selectedProductId, removeProduct, closeAllOverlays])

  const handleOpenMoveToList = useCallback(() => {
    setCurrentOverlay('moveTo')
  }, [])

  const handleOpenCreateNewList = useCallback(() => {
    setCurrentOverlay('createList')
  }, [])

  const handleCreateListAndMoveAction = useCallback(async (productId: number, listName: string, notify: boolean) => {
    if (createListAndAddProduct) {
      try {
        await createListAndAddProduct(productId, listName, notify);
        toast.success(`Product moved to new list: ${listName}`)
      } catch (error) {
        toast.error("Failed to create list and move product.")
        console.error("Create list error:", error)
      }
    }
    closeAllOverlays()
    setSelectedProductId(null);
  }, [closeAllOverlays, createListAndAddProduct])

  const handleMoveToExistingListAction = useCallback(async (listId: number) => {
    if (selectedProductId !== null) {
      console.log(`Placeholder: Move product ${selectedProductId} to list ${listId}`);
    }
    closeAllOverlays()
    setSelectedProductId(null);
  }, [selectedProductId, closeAllOverlays])
  
  const handleAddToCart = useCallback((productId: number) => {
    toast.success("Product added to cart (placeholder)!"); 
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 3000);
  }, []);

  const filteredProducts = favoriteProducts.filter(product => {
    if (showInStock && !(product.inStock ?? true)) {
         return false;
    }
     if (!showInStock && (product.inStock === true)) {
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
                  className={`w-[140px] h-[50px] border rounded-lg font-inter text-[16px] 
                            transition-colors ${!showInStock ? 'text-[#FF8800] border-[#FF8800]' : 'border-gray-300 hover:text-[#FF8800]'} ml-4`} 
                  onClick={() => setShowInStock(false)}
                >
                  Out of Stock
                </button>

                <button 
                  className="w-[200px] h-[75px] bg-[#00EEFF] text-black rounded-lg font-inter text-[32px] transition-colors hover:text-[#8CFF75] ml-auto"
                  onClick={() => router.push('/favorites/edit')}
                >
                  Edit
                </button>
              </div>

              <ProductGrid 
                products={filteredProducts}
                context="favorites"
                onProductMenuClick={handleProductMenuClick}
                onAddToCartClick={handleAddToCart}
              />
            </div>
          </div>
        </div>
      )}

      {currentOverlay === 'menu' && selectedProductId !== null && (
        <MenuOverlay
          productId={selectedProductId}
          onClose={closeAllOverlays}
          onDeleteClick={handleDeleteAction}
          onMoveToListClick={handleOpenMoveToList}
        />
      )}

      {currentOverlay === 'moveTo' && selectedProductId !== null && (
        <MoveToListRealOverlay
          productId={selectedProductId}
          onBack={closeAllOverlays}
          onOpenCreateNewList={handleOpenCreateNewList}
        />
      )}

      {currentOverlay === 'createList' && selectedProductId !== null && (
        <CreateNewListOverlay
          productId={selectedProductId}
          onBack={() => setCurrentOverlay('moveTo')}
          onListCreateAndMove={handleCreateListAndMoveAction}
          existingLists={favoriteLists || []}
        />
      )}

      {showCartSuccess && (
        <CartSuccessMessage onClose={() => setShowCartSuccess(false)} />
      )}
    </div>
  )
} 