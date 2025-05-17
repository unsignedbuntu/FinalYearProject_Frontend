import { useState } from 'react'
import Image from 'next/image'
import MenuIcon from '@/components/icons/Menu'
import MenuOverlay from '@/components/overlay/MenuOverlay'
import CartSuccessMessage from '@/components/messages/CartSuccessMessage'
import { useCartStore } from '@/app/stores/cartStore'
import Link from 'next/link'
import { useCartActions } from '@/app/stores/cartStore'
import { toast } from 'react-hot-toast'
import FavoriteIcon from '@/components/icons/FavoriteIcon'
import CartIcon from '@/components/icons/CartIcon'
import CartFavoritesIcon from '@/components/icons/CartFavorites'
import TrashIcon from '@/components/icons/Trash'
import { useUserStore } from '@/app/stores/userStore'
import { useFavoritesStore, useFavoritesActions } from '@/app/stores/favoritesStore'

export interface GridProduct {
  productId: number;
  productName: string;
  name?: string;
  price: number;
  imageUrl?: string;
  inStock?: boolean;
  supplierName?: string;
  id?: number;
  storeId?: number;
  categoryId?: number;
  stockQuantity?: number;
  barcode?: string;
  status?: boolean;
}

interface ProductGridProps {
  products: GridProduct[];
  isLoading?: boolean;
  context?: 'products' | 'favorites' | 'search' | 'favorite-list-detail';
  onProductMenuClick?: (productId: number) => void;
  onAddToCartClick?: (productId: number) => void;
  onDirectDeleteClick?: (productId: number) => void;
}

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5 my-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductGrid({ products, isLoading, context = 'products', onProductMenuClick, onAddToCartClick, onDirectDeleteClick }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const productsPerPage = 8

  const { addItem: addToCartStore } = useCartActions()
  const { addProductToMainFavorites: addToFavorites, removeProductFromMainFavorites: removeFromFavorites } = useFavoritesActions()
  const { isFavorite } = useFavoritesStore()
  const { user } = useUserStore()

  const handleGenericAddToCart = (product: GridProduct) => {
    if (!user) {
      toast.error("You must be logged in to add items to the cart.")
      return
    }
    addToCartStore({
      productId: product.productId,
      quantity: 1
    })
    toast.success(`${product.name || product.productName} added to cart.`)
  }

  const handleToggleFavorite = (product: GridProduct) => {
    if (!user) {
      toast.error("You must be logged in to manage favorites.")
      return
    }
    const currentIsFavorite = isFavorite(product.productId)
    if (currentIsFavorite) {
      removeFromFavorites(product.productId)
      toast.success(`${product.name || product.productName} removed from favorites.`)
    } else {
      addToFavorites(product.productId)
      toast.success(`${product.name || product.productName} added to favorites.`)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found.
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${context === 'favorites' ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
      {products.map((product) => {
        const effectiveId = product.productId
        const productName = product.name || product.productName
        // const productIsFavorite = context !== 'favorites' && isFavorite(effectiveId) // Not strictly needed for styling based on context

        const isFavoritesContext = context === 'favorites';
        const isFavoriteListDetailContext = context === 'favorite-list-detail';

        return (
          <div 
            key={effectiveId} 
            className={`border rounded-lg overflow-hidden group relative bg-white flex flex-col 
                        ${isFavoritesContext 
                          ? 'p-4 shadow-md hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 hover:ring-2 hover:ring-blue-300 transition-all duration-200' 
                          : 'shadow-sm hover:shadow-md transition-shadow'}`}
          >
            <Link href={`/product/${effectiveId}`} className="block flex flex-col flex-grow">
              {/* Favorites context: Image styling to match edit page */}
              <div className={`relative w-full overflow-hidden bg-gray-100 rounded-md ${isFavoritesContext ? 'aspect-square mb-3' : 'aspect-square'}`}>
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={productName}
                    fill
                    className={`object-cover ${!isFavoritesContext ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
                    sizes={isFavoritesContext 
                            ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" 
                            : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
                    priority={false}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {product.inStock === false && !isFavoritesContext && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    Out of Stock
                  </span>
                )}
              </div>
              {/* Favorites context: Text styling to match edit page */}
              <div className={`flex flex-col flex-grow ${isFavoritesContext ? 'mt-1' : 'p-3'}`}>
                <h3 
                  className={`line-clamp-2 ${isFavoritesContext 
                                ? 'font-semibold text-sm sm:text-base leading-tight mb-1' 
                                : 'text-sm font-semibold text-gray-800 h-10 mb-1'}`}
                  title={productName}
                >
                  {productName}
                </h3>
                <div className={`${isFavoritesContext ? 'mt-0' : 'mt-auto'}`}>
                  <div className={`flex justify-between items-center ${isFavoritesContext ? 'mt-0' : 'mt-1'}`}>
                    <p className={`font-bold text-blue-600 ${isFavoritesContext ? 'text-sm sm:text-base' : 'text-base'}`}>
                      {product.price ? `${product.price.toFixed(2)} TL` : 'Price not available'}
                    </p>
                    { !isFavoritesContext && product.supplierName && (
                       <span className="text-xs text-gray-500 truncate" title={product.supplierName}>
                         {product.supplierName}
                       </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            {/* Action buttons: Keep original logic for favorites context, but adjust positioning/size if needed */}
            {(isFavoritesContext || isFavoriteListDetailContext) && (
              <>
                {isFavoritesContext && onProductMenuClick && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onProductMenuClick(effectiveId); }}
                      className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 transition-colors shadow z-20`}
                      title="Product actions"
                      aria-label="Product actions"
                    >
                      <MenuIcon className="w-5 h-5" />
                    </button>
                )}
                {isFavoriteListDetailContext && onDirectDeleteClick && (
                    <button
                        onClick={(e) => { e.stopPropagation(); 
                            if (window.confirm("Are you sure you want to remove this product from the list?")) {
                                onDirectDeleteClick(effectiveId); 
                            }
                        }}
                        className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white text-red-500 hover:bg-red-100 transition-colors shadow z-20`}
                        title="Remove from list"
                        aria-label="Remove from list"
                    >
                        <TrashIcon className="w-5 h-5" /> 
                    </button>
                )}
                
                {/* Common AddToCart for both favorites and favorite-list-detail contexts if onAddToCartClick is provided */}
                {(isFavoritesContext || isFavoriteListDetailContext) && onAddToCartClick && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCartClick(effectiveId); }}
                      className="absolute bottom-2 right-2 p-1.5 sm:p-2 rounded-full bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-500 transition-colors shadow z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add to Cart"
                      disabled={product.inStock === false || isLoading}
                      aria-label="Add to cart"
                    >
                      <CartFavoritesIcon className="w-5 h-5" />
                    </button>
                )}
              </>
            )}
            {/* Original buttons for non-favorites context (e.g., general products page) */}
            {!isFavoritesContext && (
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleGenericAddToCart(product); }}
                        className="p-2 rounded-full bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-500 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add to Cart"
                        disabled={product.inStock === false || isLoading}
                        aria-label="Add to cart"
                    >
                        <CartIcon width={20} height={20} />
                    </button>
                </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 