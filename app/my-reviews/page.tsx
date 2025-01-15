"use client"
import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/sidebar/Sidebar'
import Review from '@/components/icons/Review'
import ReviewsMessage from '@/components/messages/ReviewsMessage'
import Close from '@/components/icons/Close.png'

interface Product {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  isReviewed: boolean
  size?: string
  color?: string
  userRating?: number
}

function generateRandomRating(): number {
  // 40% chance for 1-3, 60% chance for 3-5
  if (Math.random() < 0.4) {
    return 1 + Math.random() * 2 // 1-3
  } else {
    return 3 + Math.random() * 2 // 3-5
  }
}

function generateRandomReviewCount(): number {
  // 30% chance for 300-1000, 70% chance for 0-300
  if (Math.random() < 0.3) {
    return Math.floor(300 + Math.random() * 700)
  } else {
    return Math.floor(Math.random() * 30)
  }
}

const ratingTexts: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Normal',
  4: 'Good',
  5: 'Very Good'
}

export default function MyReviewsPage() {
  const [selectedTab, setSelectedTab] = useState('Completed reviews')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showReviewMessage, setShowReviewMessage] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [products, setProducts] = useState<Product[]>(
    Array.from({ length: 100 }, (_, i) => ({
      id: `product-${i}`,
      name: `Product Name ${i + 1} Long Title`,
      image: '/shoe.png',
      rating: parseFloat(generateRandomRating().toFixed(1)),
      reviewCount: generateRandomReviewCount(),
      isReviewed: Math.random() > 0.5,
      size: '44',
      color: 'Black - White',
      userRating: undefined
    }))
  )

  // Filter products based on selected tab
  const filteredProducts = products.filter(product => 
    selectedTab === 'Completed reviews' ? product.isReviewed : !product.isReviewed
  )

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleReviewSubmit = () => {
    if (selectedProduct) {
      setShowReviewMessage(true)
      // Reset states
      setSelectedProduct(null)
      setReviewText('')
    }
  }

  const handleStarHover = (productId: string, rating: number | null) => {
    setHoveredStars(prev => ({
      ...prev,
      [productId]: rating || 0
    }))
  }

  const handleStarClick = (product: Product, rating: number) => {
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, userRating: rating } : p
    ))
    setSelectedProduct({ ...product, userRating: rating })
  }

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="w-[1000px] bg-white rounded-lg p-6">
          {/* Header */}
          <h1 className="font-raleway text-[64px] font-normal text-[#FF8000] text-center mb-8">
            My reviews
          </h1>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 items-center">
            {['Pending reviews', 'Completed reviews'].map((tab) => (
              <div key={tab} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg font-raleway text-[32px] group ${
                    selectedTab === tab 
                      ? 'text-[#40BFFF] border-b-2 border-[#40BFFF]' 
                      : 'text-black hover:text-[#40BFFF] hover:border-b-2 hover:border-[#40BFFF]'
                  }`}
                >
                  {tab}
                  <Review className={selectedTab === tab ? 'text-[#40BFFF]' : 'group-hover:text-[#40BFFF]'} />
                </button>
              </div>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-4">
            {currentProducts.map((product) => (
              <div key={product.id} className="w-[200px] h-[150px]">
                <div className="h-[100px] relative">
                  <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="h-[50px] bg-[#D9D9D9] rounded-b-lg p-2">
                  <div className="font-raleway text-sm mb-1">
                    {product.name.length > 12 
                      ? product.name.slice(0, 12) + '..'
                      : product.name
                    }
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarClick(product, star)}
                          onMouseEnter={() => handleStarHover(product.id, star)}
                          onMouseLeave={() => handleStarHover(product.id, null)}
                          className="text-yellow-400 relative group"
                        >
                          {((hoveredStars[product.id] && star <= hoveredStars[product.id]) || 
                            (product.userRating && star <= product.userRating)) 
                            ? '★' 
                            : '☆'
                          }
                          {hoveredStars[product.id] === star && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                              {ratingTexts[star]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-raleway ${
                    currentPage === page ? 'bg-[#40BFFF] text-white' : 'text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Review Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <Image 
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-raleway text-lg">{selectedProduct.name}</h3>
                  <div className="text-sm text-gray-500">Size: {selectedProduct.size}</div>
                  <div className="text-sm text-gray-500">Color: {selectedProduct.color}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <Image 
                  src={Close}
                  alt="Close"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-raleway text-lg mb-2">Rate the product</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedProduct(prev => prev ? { ...prev, userRating: star } : null)}
                    onMouseEnter={() => setHoveredStars(prev => ({ ...prev, overlay: star }))}
                    onMouseLeave={() => setHoveredStars(prev => ({ ...prev, overlay: 0 }))}
                    className="text-2xl text-yellow-400 relative group"
                  >
                    {((hoveredStars.overlay && star <= hoveredStars.overlay) || 
                      (selectedProduct.userRating && star <= selectedProduct.userRating)) 
                      ? '★' 
                      : '☆'
                    }
                    {hoveredStars.overlay === star && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        {ratingTexts[star]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-raleway text-lg mb-2">Your thoughts about the product (optional)</h4>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg resize-none"
                placeholder="Write your review here..."
              />
            </div>

            <button
              onClick={handleReviewSubmit}
              className="w-full bg-[#FF8000] text-white py-2 rounded-lg hover:bg-[#FF9933]"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Review Success Message */}
      {showReviewMessage && (
        <ReviewsMessage onClose={() => setShowReviewMessage(false)} />
      )}
    </div>
  )
} 