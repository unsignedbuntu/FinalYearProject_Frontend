"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FavoriteIcon from '@/components/icons/FavoriteIcon';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  category: string;
}

const SAMPLE_PRODUCT: Product = {
  id: "1",
  name: "Nike Air Max 270 React",
  price: 299.99,
  description: "The Nike Air Max 270 React combines two of Nike's biggest innovations: Air Max and React foam. The result is a shoe that's both incredibly comfortable and distinctively stylish.",
  images: [
    "/products/shoe-1.png",
    "/products/shoe-2.png",
    "/products/shoe-3.png",
    "/products/shoe-4.png"
  ],
  colors: ["#000000", "#FF0000", "#0000FF", "#FFFFFF"],
  sizes: ["38", "39", "40", "41", "42", "43", "44"],
  rating: 4.5,
  reviewCount: 123,
  category: "Sports"
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Yıldız derecelendirme fonksiyonu
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-400">
        {index + 1 <= rating ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Sol taraf - Ürün resimleri */}
            <div>
              <div className="relative h-96 mb-4">
                <Image
                  src={SAMPLE_PRODUCT.images[selectedImage]}
                  alt={SAMPLE_PRODUCT.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {SAMPLE_PRODUCT.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${SAMPLE_PRODUCT.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sağ taraf - Ürün detayları */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {SAMPLE_PRODUCT.name}
                </h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FavoriteIcon width={24} height={24} />
                </button>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(SAMPLE_PRODUCT.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({SAMPLE_PRODUCT.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6">
                {SAMPLE_PRODUCT.description}
              </p>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Colors</h2>
                <div className="flex space-x-2">
                  {SAMPLE_PRODUCT.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Size</h2>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PRODUCT.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-sm font-medium rounded-md ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${SAMPLE_PRODUCT.price}
                </span>
                <button
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    // Add to cart logic
                  }}
                >
                  Add to Cart
                </button>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>Category: {SAMPLE_PRODUCT.category}</li>
                  <li>Available Colors: {SAMPLE_PRODUCT.colors.length}</li>
                  <li>Available Sizes: {SAMPLE_PRODUCT.sizes.join(", ")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 