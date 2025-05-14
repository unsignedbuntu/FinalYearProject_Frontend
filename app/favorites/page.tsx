"use client"
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import ListSidebar from '@/app/favorites/ListSidebar'
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
import { useUserStore } from '@/app/stores/userStore'

// Import actual overlay components
import MenuOverlay from '@/components/overlay/MenuOverlay'
import MoveToListRealOverlay, { MoveToListOverlayProps } from '@/components/overlay/MoveToListOverlay'
import CreateNewListOverlay, { CreateNewListOverlayProps } from '@/components/overlay/CreateNewListOverlay'

// Import GridProduct type
import { type GridProduct } from '@/app/products/ProductGrid'

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
  
  const actions = useFavoritesActions()
  const { user } = useUserStore()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState(false)

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [currentOverlay, setCurrentOverlay] = useState<'menu' | 'moveTo' | 'createList' | null>(null)

  useEffect(() => {
    if (user?.id) {
      actions.initializeFavoritesAndLists(user.id);
    }
  }, [actions, user]);

  const handleSort = (type: string) => {
    actions.setSortType(type)
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
        await actions.removeProductFromMainFavorites(selectedProductId);
        toast.success("Product removed from main favorites.")
      } catch (error) {
        toast.error("Failed to remove product.")
        console.error("Delete error:", error)
      }
    }
    closeAllOverlays()
    setSelectedProductId(null);
  }, [selectedProductId, actions, closeAllOverlays])

  const handleOpenMoveToList = useCallback(() => {
    setCurrentOverlay('moveTo')
  }, [])

  const handleOpenCreateNewListFromMoveTo = useCallback(() => {
    if (selectedProductId === null) {
        toast.error("No product selected to create a list for.");
        return;
    }
    setCurrentOverlay('createList')
  }, [selectedProductId])

  const handleCreateListAndMoveAction = useCallback(async (productId: number, listName: string, isPrivate: boolean) => {
    if (!user?.id) {
      toast.error("User information is missing. Cannot create list.");
      return;
    }
    try {
      const newList = await actions.createFavoriteList(user.id, listName, isPrivate);
      if (newList && newList.id) {
        await actions.addProductToExistingList(productId, newList.id);
        toast.success(`Product added to new list: ${listName}`)
      } else {
        throw new Error("Failed to create list or list ID not returned.");
      }
    } catch (error) {
      toast.error("Failed to create list and add product.")
      console.error("Create list and add product error:", error)
    }
    closeAllOverlays()
    setSelectedProductId(null);
  }, [actions, closeAllOverlays, user]);

  const handleMoveToExistingListAction = useCallback(async (productId: number, listId: number) => {
    if (productId !== null) {
      try {
        await actions.addProductToExistingList(productId, listId);
        const list = favoriteLists.find(l => l.id === listId);
        toast.success(`Product added to list: ${list?.name || 'selected list'}`);
      } catch (error) {
        toast.error("Failed to add product to list.");
        console.error("Move to existing list error:", error);
      }
    }
    closeAllOverlays();
    setSelectedProductId(null);
  }, [actions, favoriteLists, closeAllOverlays]);
  
  const handleAddToCart = useCallback((productId: number) => {
    toast.success("Product added to cart (placeholder)!"); 
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 3000);
  }, []);

  const mainFavoriteProducts = favoriteProducts.filter(product => product.listId === undefined);

  const filteredProducts = mainFavoriteProducts.filter(product => {
    if (showInStock) {
        return product.inStock !== false;
    } else {
        return product.inStock === false;
    }
  });

  // Map FavoriteProduct[] to GridProduct[]
  const productsForGrid = filteredProducts.map((fp: FavoriteProduct): GridProduct => ({
    productId: fp.ProductId,    // FavoriteProduct.ProductId is number
    productName: fp.name,       // FavoriteProduct.name is string (derived from ProductName)
    price: fp.Price,            // FavoriteProduct.Price is number
    imageUrl: fp.ImageUrl,      // FavoriteProduct.ImageUrl is string | undefined
    inStock: fp.inStock,        // FavoriteProduct.inStock is boolean | undefined
    supplierName: fp.supplierName, // FavoriteProduct.supplierName is string | undefined
    // id: fp.id, // GridProduct also has an optional 'id', could map fp.id if it's distinct from ProductId and useful
    // name: fp.name, // GridProduct has 'name?: string', already covered by productName.
  }));

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
         <button 
           onClick={() => {
             if (user?.id) {
               actions.initializeFavoritesAndLists(user.id);
             } else {
               toast.error("User information not available to retry.");
             }
           }} 
           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
         >
           Retry
         </button>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-[60px] flex">
      <Sidebar />
      <ListSidebar />
      
      <div className="flex-1 ml-8 p-6">
        {productsForGrid.length === 0 && !isLoading ? (
          <EmptyFavorites />
        ) : (
          <div>
            <div className="mt-[30px]">
              <div className="flex justify-between items-center mb-6">
                <FavoritesHeader productCount={productsForGrid.length} />
                
                <div className="flex items-center gap-4">
                  <span className="font-inter text-xl font-normal">
                    Sort
                  </span>
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center bg-gray-200 w-auto h-10 rounded-md px-3 justify-between text-sm"
                    >
                      <span className="font-inter text-sm text-gray-700">
                        { sortType === 'price-desc' ? 'Price (High-Low)' : 
                          sortType === 'price-asc' ? 'Price (Low-High)' : 
                          sortType === 'name-asc' ? 'Name (A-Z)' : 
                          sortType === 'name-desc' ? 'Name (Z-A)' : 
                          sortType === 'date-desc' ? 'Date (Newest)' : 
                          sortType === 'date-asc' ? 'Date (Oldest)' : 
                          'Relevance'
                        }
                      </span>
                      <Arrowdown className="text-gray-600 w-3 h-3 ml-2" />
                    </button>

                    <SortOverlay 
                      isOpen={isSortOpen}
                      onClose={() => setIsSortOpen(false)}
                      onSort={handleSort}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white mt-4 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    className={`px-4 py-2 border rounded-md font-inter text-sm 
                              transition-colors ${showInStock ? 'text-blue-600 border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:text-blue-500'}`}
                    onClick={() => actions.setShowInStock(true)}
                  >
                    In Stock
                  </button>
                  
                  <button 
                    className={`px-4 py-2 border rounded-md font-inter text-sm 
                              transition-colors ${!showInStock ? 'text-blue-600 border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:text-blue-500'}`}
                    onClick={() => actions.setShowInStock(false)}
                  >
                    Out of Stock
                  </button>

                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md font-inter text-sm transition-colors hover:bg-blue-600 ml-auto"
                    onClick={() => router.push('/favorites/edit')}
                  >
                    Edit Favorites
                  </button>
                </div>

                <ProductGrid 
                  products={productsForGrid}
                  context="favorites"
                  onProductMenuClick={handleProductMenuClick}
                  onAddToCartClick={handleAddToCart}
                />
              </div>
            </div>
          </div>
        )}
      </div>

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
          onOpenCreateNewList={() => handleOpenCreateNewListFromMoveTo()}
          onMoveToExistingList={handleMoveToExistingListAction}
          existingLists={favoriteLists || []}
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