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
import { getProxiedProductImageUrl } from '@/services/API_Service'

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
      const productToRemove = favoriteProducts.find(p => p.ProductId === selectedProductId);
      const productName = productToRemove?.ProductName || "Product";
      let removedFromAnyList = false;
      const removedFromListsNames: string[] = [];

      for (const list of favoriteLists) {
        if (list.productIds.includes(selectedProductId)) {
          try {
            await actions.removeProductFromList(selectedProductId, list.id);
            removedFromListsNames.push(list.name);
            removedFromAnyList = true;
          } catch (error) {
            // removeProductFromList already shows a toast on error
            console.error(`Failed to remove product from list ${list.name}:`, error);
          }
        }
      }

      if (removedFromAnyList) {
        toast.success(`${productName} removed from list(s): ${removedFromListsNames.join(', ')}.`);
      } else {
        // If the product was a main favorite but not in any specific list,
        // and the "Delete from list" was clicked, it implies the user might still want to remove it from main favorites.
        // However, per user's request "favoriteste yapmak ıstedıgım favorılerden sılmesı degıl",
        // we will NOT remove from main favorites here.
        // We can inform the user if no action was taken regarding lists.
        toast(`${productName} was not found in any of your specific lists.`);
      }
    }
    closeAllOverlays();
    setSelectedProductId(null);
  }, [selectedProductId, actions, favoriteLists, favoriteProducts, closeAllOverlays]);

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
    if (!listName || listName.trim() === "") {
      toast.error("Please enter a valid list name.");
      closeAllOverlays();
      setSelectedProductId(null);
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

  const mainFavoriteProducts = favoriteProducts.filter(product => product.ListId === undefined);

  const filteredProducts = mainFavoriteProducts.filter(product => {
    if (showInStock) {
        return product.InStock !== false;
    } else {
        return product.InStock === false;
    }
  });
  // Map FavoriteProduct[] to GridProduct[]
  const productsForGrid = filteredProducts.map((fp: FavoriteProduct): GridProduct => ({
    productId: fp.ProductId,    
    productName: fp.ProductName || 'Unnamed Product',
    price: fp.Price,            
    imageUrl: `/api-proxy/product-image/${fp.ProductId}`,
    inStock: fp.InStock,        // Use PascalCase InStock
    supplierName: fp.SupplierName, // Use PascalCase SupplierName if available on FavoriteProduct
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
    // MODIFIED: Root div for layout similar to edit page
    <div className="min-h-screen pt-[60px] relative">
      <Sidebar /> {/* Sidebar uses its own absolute positioning */}

      {/* Wrapper for content to the right of Sidebar, including ListSidebar */}
      {/* Using ml-[480px] for consistency with edit page's content start */}
      <div className="ml-[480px] flex h-[calc(100vh-60px)]"> {/* Adjusted height for viewport fitting */}
        
        {/* Main content area (products, header, sort) */}
        {/* p-6 for padding around the content column */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Container for header and sort, pushed down with mt-[30px] */}
          <div className="flex justify-between items-center mb-6 mt-[30px]">
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
                  {/* Sort type display logic */}
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
          
          {/* Content panel with max-width, p-6, and shadow-lg like edit page */}
          <div className="bg-white mt-4 p-6 rounded-lg shadow-lg max-w-[1000px]">
            {productsForGrid.length === 0 && !isLoading ? (
              <EmptyFavorites />
            ) : (
              <>
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
                    className="w-[200px] h-[75px] bg-[#00EEFF] text-black rounded-lg font-inter text-[32px] transition-colors hover:text-[#8CFF75] ml-auto"
                    onClick={() => router.push('/favorites/edit')}
                  >
                    Edit
                  </button>
                </div>
                <ProductGrid 
                  products={productsForGrid}
                  context="favorites"
                  onProductMenuClick={handleProductMenuClick}
                  onAddToCartClick={handleAddToCart}
                />
              </>
            )}
          </div>
        </div>
        
        <ListSidebar /> {/* ListSidebar takes its own defined width */}
      </div>

      {/* Overlays will use favoriteLists from store state for existingLists prop */}
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