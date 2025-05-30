"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTopReviewedProducts, ApiTopReviewedProduct } from '@/services/API_Service'; // Updated import

// Interface to be used within this component, aligning with ApiTopReviewedProduct
interface BestSellerProduct {
  productID: number;
  productName: string;
  price: number;
  originalPrice?: number; // Keep if you plan to use it or backend provides it
  imageUrl: string;
  averageRating: number;
  // Derived or optional fields:
  discountText?: string; 
  // isHot can be determined by some logic if needed, e.g., based on sales or newness, not directly from this API
}

export default function BestSeller() {
  const router = useRouter();
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const topProductsData = await getTopReviewedProducts(4); // Fetch top 4
        
        const mappedProducts: BestSellerProduct[] = topProductsData.map(p => {
          let discountText: string | undefined = undefined;
          if (p.originalPrice && p.originalPrice > p.price) {
            const discountPercentage = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
            if (discountPercentage > 0) {
              discountText = `${discountPercentage}% Off`;
            }
          }

          let finalImageUrl: string;
          // p.imageUrl comes from the backend (TopReviewedProductDto.ImageUrl)
          // Example values from Swagger: "/api/imagecache/Image/348", "/images/placeholder.png"

          if (p.imageUrl && p.imageUrl.startsWith('http')) {
            // If it's a full external URL, use it directly
            finalImageUrl = p.imageUrl;
          } else if (p.imageUrl && p.imageUrl === '/images/placeholder.png') {
            // If it's specifically the placeholder path, use it directly (assuming it's in /public/images/)
            finalImageUrl = p.imageUrl;
          } else {
            // For any other case (including /api/imagecache/Image/XXX or if p.imageUrl was null/empty from DB and backend defaulted differently, or just a product ID was intended)
            // rely on the productID to build the proxy URL, similar to favorites/cart.
            // This ensures that if the backend provides an API path like /api/imagecache/Image/348, we don't try to use that as a direct src.
            // Instead, we use our standard frontend proxy that knows how to get product images.
            finalImageUrl = `/api-proxy/product-image/${p.productID}`;
          }

          return {
            productID: p.productID,
            productName: p.productName,
            price: p.price,
            originalPrice: p.originalPrice,
            imageUrl: finalImageUrl, // Use the resolved URL
            averageRating: p.averageRating,
            discountText: discountText,
          };
        });
        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch top reviewed products:", err);
        setError("Could not load best sellers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <span key={`full-${index}`} className="text-yellow-400">★</span>
        ))}
        {halfStar && <span key="half" className="text-yellow-400">★</span>} {/* Or a specific half-star icon */}
        {Array.from({ length: emptyStars }, (_, index) => (
          <span key={`empty-${index}`} className="text-yellow-400">☆</span>
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-center mb-8">BEST SELLER</h2>
        <p>Loading best sellers...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center text-red-500">
        <h2 className="text-3xl font-bold text-center mb-8">BEST SELLER</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-center mb-8">BEST SELLER</h2>
        <p>No best selling products to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">BEST SELLER</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.productID} // Use productID
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/product/${product.productID}`)} // Use productID
          >
            <div className="relative h-48">
              <Image
                src={product.imageUrl} // Use imageUrl
                alt={product.productName} // Use productName
                fill
                className="object-cover"
              />
              {/* 'isHot' removed as it's not part of ApiTopReviewedProduct by default */}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={product.productName}>
                {product.productName}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-blue-600 font-bold mr-2">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discountText && (
                   <span className="text-red-500 text-sm font-medium">
                    {product.discountText}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(product.averageRating)} {/* Use averageRating */}
                </div>
                <span className='text-xs text-gray-600'>({product.averageRating.toFixed(1)})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 