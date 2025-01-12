"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  discount: string;
  isHot?: boolean;
}

const BEST_SELLERS: Product[] = [
  {
    id: "1",
    name: "Nike Air Max 270 React",
    price: 299.43,
    originalPrice: 394.33,
    image: "/products/shoe-1.png",
    rating: 3,
    discount: "24% Off",
    isHot: true
  },
  {
    id: "2",
    name: "FS - QUILTED MAXI CROSS BAG",
    price: 299.43,
    originalPrice: 534.33,
    image: "/products/shoe-2.png",
    rating: 4.5,
    discount: "24% Off",
    isHot: true
  },
  {
    id: "3",
    name: "Nike Air Max 270 React",
    price: 299.43,
    originalPrice: 534.33,
    image: "/products/shoe-3.png",
    rating: 4,
    discount: "24% Off",
    isHot: true
  },
  {
    id: "4",
    name: "Nike Air Max 270 React",
    price: 299.43,
    originalPrice: 534.33,
    image: "/products/shoe-4.png",
    rating: 4,
    discount: "24% Off",
    isHot: true
  }
];

export default function BestSeller() {
  const router = useRouter();

  // Yıldız derecelendirme fonksiyonu
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-400">
        {index + 1 <= rating ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">BEST SELLER</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {BEST_SELLERS.map((product) => (
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
              {product.isHot && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  HOT
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-blue-600 font-bold mr-2">
                    ${product.price}
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    ${product.originalPrice}
                  </span>
                </div>
                <span className="text-red-500 text-sm font-medium">
                  {product.discount}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 