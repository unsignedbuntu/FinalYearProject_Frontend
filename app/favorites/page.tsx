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
import { useFavoritesStore, useFavoritesActions, FavoriteProduct } from '@/app/stores/favoritesStore'
import Image from 'next/image'

// Placeholder for actual overlay components - ensure these are correctly imported and implemented
const MoveToListOverlay = ({ isOpen, onClose, onMove, onCreateNewList, productId }: any) => isOpen ? <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"><div className="bg-white p-4 rounded-lg">Move To List (Product ID: {productId}) <button onClick={onCreateNewList}>Create New List</button> <button onClick={onClose}>Close</button></div></div> : null;
const ListSelectionOverlay = ({ isOpen, onClose, onListCreated, productId }: any) => isOpen ? <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"><div className="bg-white p-4 rounded-lg">Create New List (Product ID: {productId}) <button onClick={() => onListCreated('new list name')}>Create & Move</button> <button onClick={onClose}>Close</button></div></div> : null;

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
  } = useFavoritesActions()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)

  // State for product actions
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isProductActionMenuOpen, setIsProductActionMenuOpen] = useState(false)
  const [showMoveToListModal, setShowMoveToListModal] = useState(false)
  const [showCreateListModal, setShowCreateListModal] = useState(false)

  useEffect(() => {
    initializeFavorites();
  }, [initializeFavorites]);

  const handleSort = (type: string) => {
    setSortType(type)
    setIsSortOpen(false)
  }

  const handleProductMenuClick = useCallback((productId: number) => {
    setSelectedProductId(productId)
    setIsProductActionMenuOpen(true)
  }, [])

  const handleCloseProductActionMenu = useCallback(() => {
    setIsProductActionMenuOpen(false)
    setSelectedProductId(null)
  }, [])

  const handleDeleteFavorite = useCallback(() => {
    if (selectedProductId !== null) {
      removeProduct(selectedProductId)
    }
    handleCloseProductActionMenu()
  }, [selectedProductId, removeProduct, handleCloseProductActionMenu])

  const handleInitiateMoveToList = useCallback(() => {
    setShowMoveToListModal(true)
    setIsProductActionMenuOpen(false) // Close the small action menu
  }, [])

  const handleCloseMoveToListModal = useCallback(() => {
    setShowMoveToListModal(false)
    setSelectedProductId(null) // Clear selected product when closing modals
  }, [])

  const handleOpenCreateListModal = useCallback(() => {
    // Assuming MoveToListModal is closed before this is called, or it handles it
    setShowCreateListModal(true)
    setShowMoveToListModal(false) 
  }, [])

  const handleCloseCreateListModal = useCallback(() => {
    setShowCreateListModal(false)
    setSelectedProductId(null) 
  }, [])

  const handleListCreatedAndMove = useCallback((newListName: string) => {
    if (selectedProductId !== null) {
      // Call your action here e.g.:
      // createListAndAddFavorite(selectedProductId, newListName);
      console.log(`Product ${selectedProductId} to be moved to new list: ${newListName}`);
    }
    handleCloseCreateListModal()
  }, [selectedProductId, handleCloseCreateListModal /*, createListAndAddFavorite */])

  const handleMoveToExistingList = useCallback((listId: string | number) => {
    if (selectedProductId !== null) {
      // Call your action here e.g.:
      // addFavoriteToList(selectedProductId, listId);
      console.log(`Product ${selectedProductId} to be moved to list ID: ${listId}`);
    }
    handleCloseMoveToListModal()
  }, [selectedProductId, handleCloseMoveToListModal /*, addFavoriteToList */])
  
  const handleAddToCart = useCallback((productId: number) => {
    console.log(`Add product ${productId} to cart from favorites`);
    // Implement actual add to cart logic here
    // For example, call an action: actions.addToCart(productId);
    setShowCartSuccess(true);
    // Optionally hide after a delay
    setTimeout(() => setShowCartSuccess(false), 3000);
  }, [/* actions.addToCart */]);

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

      {selectedProductId && (
        <ProductActionMenu 
          isOpen={isProductActionMenuOpen}
          onClose={handleCloseProductActionMenu}
          onMoveToList={handleInitiateMoveToList}
          onDelete={handleDeleteFavorite}
        />
      )}

      <MoveToListOverlay 
        isOpen={showMoveToListModal}
        onClose={handleCloseMoveToListModal}
        productId={selectedProductId}
        onMove={handleMoveToExistingList}
        onCreateNewList={handleOpenCreateListModal} 
      />

      <ListSelectionOverlay 
        isOpen={showCreateListModal}
        onClose={handleCloseCreateListModal}
        productId={selectedProductId}
        onListCreated={handleListCreatedAndMove}
      />

      {showCartSuccess && (
        <CartSuccessMessage onClose={() => setShowCartSuccess(false)} />
      )}
    </div>
  )
} 