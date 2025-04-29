import { useState } from 'react'
import Image from 'next/image'
import Menu from '@/components/icons/Menu'
import CartFavorites from '@/components/icons/CartFavorites'
import MenuOverlay from '@/components/overlay/MenuOverlay'
import CartSuccessMessage from '@/components/messages/CartSuccessMessage'
import { useCartStore } from '@/app/stores/cartStore'
import { useFavoritesStore } from '@/app/stores/favoritesStore'

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  supplier?: string;
}

interface ProductGridProps {
  products: Product[];
  showInStock: boolean;
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

export default function ProductGrid({ products, showInStock }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const productsPerPage = 8

  const { addItem: addToCart } = useCartStore()
  const { removeProduct: removeFromFavorites } = useFavoritesStore()

  // Prop olarak gelen products dizisini doğrudan filtrele
  const filteredProducts = products.filter(p => 
    showInStock ? p.inStock : !p.inStock
  );

  // Sayfalama için ürünleri böl
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  
  // Sepete Ekleme Fonksiyonu
  const handleAddToCart = (product: Product) => {
    console.log("Adding product to cart (grid - product object):", JSON.stringify(product, null, 2));
    addToCart({
      productId: product.id,
      name: product.name,
      supplier: product.supplier || 'Unknown',
      price: product.price,
      image: '/placeholder.png',
    });
    setShowCartSuccess(true);

    // Favorilerden de kaldır
    console.log("ProductGrid: Removing from favorites:", product.name);
    removeFromFavorites(product.id);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-6 mt-8">
        {currentProducts.map((product) => (
          <div 
            key={product.id} 
            className="w-[200px] h-[200px] rounded-lg relative"
          >
            <div className="h-[140px] relative overflow-hidden rounded-t-lg bg-[#D9D9D9]">
              {product.image === '/placeholder.jpg' ? (
                <div className="w-full h-full" />
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              <button 
                className="absolute top-2 right-2 z-10"
                onClick={() => setSelectedProduct(product.id)}
              >
                <Menu />
              </button>
            </div>
            <div className="p-2 flex flex-col items-start bg-white rounded-b-lg">
              <h3 className="font-poppins text-[14px] font-bold text-[#223263] truncate w-full">
                {product.name}
              </h3>
              <div className="absolute bottom-1 right-1">
                <button onClick={() => handleAddToCart(product)}>
                  <CartFavorites />
                </button>
              </div>
              <div className="font-poppins text-[14px] font-bold text-[#40BFFF] mt-1">
                {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <MenuOverlay onClose={() => setSelectedProduct(null)} />
      )}

      {showCartSuccess && (
        <CartSuccessMessage onClose={() => setShowCartSuccess(false)} />
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1 ? 'bg-[#40BFFF] text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
} 