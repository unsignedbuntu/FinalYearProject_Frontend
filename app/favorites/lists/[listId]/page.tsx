"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import ListSidebar from '@/app/favorites/ListSidebar'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import { useFavoritesStore, useFavoritesActions, FavoriteProduct, FavoriteList } from '@/app/stores/favoritesStore';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/app/stores/userStore';
// import { useCartActions } from '@/app/stores/cartStore'; // Assuming you have a cart store

// Import GridProduct type
import { type GridProduct } from '@/app/products/ProductGrid';

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();

  const listIdParam = params.listId as string;
  const listId = listIdParam ? parseInt(listIdParam) : null;

  const { lists, products: allFavoriteProducts, isLoading, isLoadingLists, error } = useFavoritesStore();
  const { initializeFavoritesAndLists, removeProductFromList } = useFavoritesActions();
  const { user } = useUserStore();
  // const { addItem: addToCartStore } = useCartActions(); // For cart functionality

  const [currentList, setCurrentList] = useState<FavoriteList | null | undefined>(undefined); // undefined for loading, null for not found
  const [productsInList, setProductsInList] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    // Initialize store if lists and products aren't loaded, e.g., on direct navigation
    if (user?.id && !isLoading && !isLoadingLists && (lists.length === 0 && allFavoriteProducts.length === 0)) {
      initializeFavoritesAndLists(user.id);
    }
  }, [lists, allFavoriteProducts, isLoading, isLoadingLists, initializeFavoritesAndLists, user]);

  useEffect(() => {
    if (listId !== null && lists.length > 0) {
      const foundList = lists.find(l => l.id === listId);
      setCurrentList(foundList || null); // Set to null if not found after lists are loaded
      if (foundList) {
        const productsFromIds = foundList.productIds
          .map(pid => allFavoriteProducts.find(p => p.ProductId === pid))
          .filter(p => p !== undefined) as FavoriteProduct[];
        setProductsInList(productsFromIds);
      } else {
        setProductsInList([]); // Clear products if list not found
      }
    } else if (listId !== null && lists.length === 0 && !isLoadingLists) {
        // Lists are loaded, but this listId was not found
        setCurrentList(null);
        setProductsInList([]);
    }
  }, [listId, lists, allFavoriteProducts, isLoadingLists]);

  useEffect(() => {
    // If list is explicitly not found (null) and not loading, redirect or show message
    if (currentList === null && !isLoading && !isLoadingLists) {
        toast.error("Favorite list not found.");
        router.push('/favorites');
    }
  }, [currentList, isLoading, isLoadingLists, router]);


  const handleRemoveFromThisList = async (productId: number) => {
    if (currentList && currentList.id) {
      await removeProductFromList(productId, currentList.id);
      // productsInList will update via useEffect re-running due to lists/allFavoriteProducts change
    }
  };

  const handleAddToCartFromList = (productId: number) => {
    // addToCartStore({ productId, quantity: 1 }); // Example cart action
    toast.success("Product added to cart (placeholder)!");
  };

  // Map productsInList (FavoriteProduct[]) to GridProduct[]
  const productsForGrid: GridProduct[] = productsInList.map((fp: FavoriteProduct): GridProduct => ({
    productId: fp.ProductId,
    productName: fp.ProductName || 'Unnamed Product',
    price: fp.Price ?? 0, // Provide 0 as a fallback if Price is undefined
    imageUrl: fp.ProductId ? `/api-proxy/product-image/${fp.ProductId}` : (fp.ImageUrl || '/placeholder.png'), // Explicitly construct proxied URL
    inStock: fp.InStock,
    supplierName: fp.SupplierName || undefined,
  }));

  // Initial loading state for the page before list details are known
  if (currentList === undefined && (isLoading || isLoadingLists)) {
    return (
      <div className="min-h-screen pt-[60px] flex">
        <Sidebar />
        <ListSidebar />
        <div className="flex-1 ml-8 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading list details...</span>
        </div>
      </div>
    );
  }

  // List not found state (after attempting to load)
  if (currentList === null) {
    // This case should ideally be handled by the redirect useEffect, 
    // but as a fallback or if redirection is not desired:
    return (
      <div className="min-h-screen pt-[60px] relative">
        <Sidebar />
        <div className="ml-[480px] flex h-[calc(100vh-60px)]">
            <main className="flex-1 p-6 text-center">
                <p className="text-xl text-gray-600">Favorite list not found.</p>
                <button onClick={() => router.push('/favorites')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Back to Favorites
                </button>
            </main>
            <ListSidebar className="h-[calc(100vh-60px)] sticky top-[60px]" />
        </div>
      </div>
    );
  }
  
  if (!currentList) { // Should not be reached if above conditions are met, but as a safe guard
      return null; 
  }

  return (
    // MODIFIED: Reverting to relative root and ml-[480px] content wrapper
    <div className="min-h-screen pt-[60px] relative">
      <Sidebar /> 

      {/* Wrapper for content to the right of Sidebar, including ListSidebar */}
      <div className="ml-[480px] flex h-[calc(100vh-60px)]">
        
        {/* Main content area for list details and products */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header section for list name and product count */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 max-w-[1000px] mx-auto">
            <div>
              <h1 className="font-inter text-3xl sm:text-4xl font-semibold text-gray-800">
                {currentList.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                  {productsInList.length} product{productsInList.length !== 1 ? 's' : ''} in this list
                  {currentList.isPrivate && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Private</span>}
              </p>
            </div>
            {/* Future: Add actions like rename list, delete list, change privacy */}
          </div>

          {/* Product grid container with max-width for consistency and centering */}
          <div className="max-w-[1000px] mx-auto">
            {productsInList.length > 0 ? (
              <ProductGrid
                products={productsForGrid}
                context="favorite-list-detail"
                onDirectDeleteClick={handleRemoveFromThisList}
                onAddToCartClick={handleAddToCartFromList}
              />
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md mt-4">
                <p className="text-gray-500 text-xl mb-4">This list is empty.</p>
                <p className="text-sm text-gray-400 mb-6">Add products from your main favorite page.</p>
                <button 
                    onClick={() => router.push('/favorites')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base font-medium shadow hover:shadow-md"
                >
                    Go to Favorites
                </button>
              </div>
            )}
          </div>
        </main>
        
        <ListSidebar className="h-[calc(100vh-60px)] sticky top-[60px]" />
      </div>
    </div>
  );
} 