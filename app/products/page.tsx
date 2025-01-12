"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductNav from '@/components/ProductNav';
import FavoriteIcon from '@/components/icons/FavoriteIcon';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Nike Air Max 270 React",
    price: 299.99,
    image: "/products/shoe-1.png",
    rating: 4.5,
    reviewCount: 123,
    category: "Sports"
  },
  {
    id: "2",
    name: "Adidas Ultraboost",
    price: 249.99,
    image: "/products/shoe-2.png",
    rating: 4.8,
    reviewCount: 89,
    category: "Sports"
  },
  {
    id: "3",
    name: "Puma RS-X",
    price: 199.99,
    image: "/products/shoe-3.png",
    rating: 4.3,
    reviewCount: 67,
    category: "Sports"
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Yıldız derecelendirme fonksiyonu
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-400">
        {index + 1 <= rating ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ProductNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SAMPLE_PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    favorites.includes(product.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FavoriteIcon width={20} height={20} />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-bold">
                    ${product.price}
                  </span>
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 