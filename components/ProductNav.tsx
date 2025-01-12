"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  "All Products",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Health & Beauty",
  "Automotive"
];

export default function ProductNav() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState(0);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Categories */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <div className="flex gap-2">
            {[4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setRating(stars)}
                className={`px-4 py-2 rounded-full text-sm ${
                  rating === stars
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stars}+ Stars
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 