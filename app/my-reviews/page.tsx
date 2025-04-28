"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/components/sidebar/Sidebar'
import Review from '@/components/icons/Review'
import ReviewsMessage from '@/components/messages/ReviewsMessage'
import { useReviewsStore, ReviewableProduct } from '@/app/stores/reviewsStore'
import { useUserStore } from '@/app/stores/userStore'

type SelectedTab = 'Pending reviews' | 'Completed reviews';

const ratingTexts: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Normal',
  4: 'Good',
  5: 'Very Good'
}

export default function MyReviewsPage() {
  const router = useRouter()
  const [redirectCheckComplete, setRedirectCheckComplete] = useState(false)

  const {
    productsToReview,
    isLoading,
    error,
    selectedTab,
    currentPage,
    productsPerPage,
    overlayState,
    fetchReviewsAndOrders,
    setSelectedTab,
    setCurrentPage,
    openReviewOverlay,
    closeReviewOverlay,
    setOverlayRating,
    setOverlayText,
    setOverlayHoveredStars,
    submitReview
  } = useReviewsStore()

  const { user } = useUserStore()
  const userId = user?.id

  useEffect(() => {
    // Redirect check should only run ONCE per component mount/userId change IF user exists
    if (userId !== null && userId !== undefined && !redirectCheckComplete) {
      console.log("MyReviewsPage: useEffect running, check complete?", redirectCheckComplete);
      
      // Set check in progress immediately to prevent re-entry before async finishes
      setRedirectCheckComplete(true); 
      
      console.log("MyReviewsPage: Fetching reviews...");
      fetchReviewsAndOrders(userId)
        .then(isEmpty => {
          // Re-fetch the latest state directly from the store *after* the fetch logic is done
          const latestState = useReviewsStore.getState();
          console.log(`DEBUG: Redirect check post-fetch: isEmpty=${isEmpty}, isLoading=${latestState.isLoading}, error=${latestState.error}`);
          
          // Perform the check using the *latest* state
          if (isEmpty && !latestState.isLoading && !latestState.error) {
            console.log("No reviewable products found, redirecting to /my-orders");
            // Use replace instead of push to prevent back button going back to the brief reviews page view
            router.replace('/my-orders?showReviewPrompt=true'); 
          } else {
            console.log("Redirection skipped or not needed.", { isEmpty, isLoading: latestState.isLoading, error: latestState.error });
          }
        })
        .catch(err => {
           console.error("Error during fetchReviewsAndOrders in useEffect:", err);
           // Keep redirectCheckComplete as true even on error
        });
    } else if (!userId) {
      console.warn("User ID not found, cannot fetch reviews or check redirect.");
      // Prevent check if user logs out and then back in without full remount
      if (!redirectCheckComplete) {
         setRedirectCheckComplete(true);
      }
    }
    // Add fetchReviewsAndOrders to dependency array if it's not stable (though it should be from Zustand)
  }, [userId, fetchReviewsAndOrders, router, redirectCheckComplete]);

  const filteredProducts = productsToReview.filter(product => 
    selectedTab === 'Completed reviews' ? product.isReviewed : !product.isReviewed
  )

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[40px] relative flex items-center justify-center">
        <Sidebar />
        <div className="ml-[391px] mt-[87px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }
  
  if (error && !isLoading) {
    return (
      <div className="min-h-screen pt-[40px] relative flex items-center justify-center">
        <Sidebar />
        <div className="ml-[391px] mt-[87px] text-red-500">
          Error loading reviews: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="w-[1000px] bg-white rounded-lg p-6">
          <h1 className="font-raleway text-[64px] font-normal text-[#FF8000] text-center mb-8">
            My reviews
          </h1>

          <div className="flex gap-6 mb-6 items-center">
            {([
              'Pending reviews',
              'Completed reviews'
            ] as SelectedTab[]).map((tab) => (
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
                  <Review className={selectedTab === tab ? 'text-[#40BFFF]' : 'text-gray-500 group-hover:text-[#40BFFF]'} />
                </button>
              </div>
            ))}
          </div>

          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <div key={product.orderItemId} className="w-[200px] h-[150px]">
                  <div className="h-[100px] relative">
                    <Image 
                      src={product.productImage || '/placeholder.png'}
                      alt={product.productName}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="h-[50px] bg-[#D9D9D9] rounded-b-lg p-2">
                    <div className="font-raleway text-sm mb-1 truncate">
                      {product.productName}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => !product.isReviewed && openReviewOverlay({...product, userRating: star})}
                            onMouseEnter={() => !product.isReviewed && setOverlayHoveredStars(star)}
                            onMouseLeave={() => !product.isReviewed && setOverlayHoveredStars(0)}
                            className={`text-yellow-400 relative group ${!product.isReviewed ? 'cursor-pointer' : 'cursor-default'}`}
                            disabled={product.isReviewed}
                          >
                            {(product.isReviewed ? 
                              (product.existingReview && star <= product.existingReview.rating) : 
                              (overlayState.selectedProduct?.orderItemId === product.orderItemId ? 
                                (overlayState.hoveredStars > 0 ? star <= overlayState.hoveredStars : star <= overlayState.rating) :
                                star <= (product.userRating || 0)
                              )
                            )
                              ? '★' 
                              : '☆'
                            }
                            {!product.isReviewed && overlayState.hoveredStars === star && overlayState.selectedProduct?.orderItemId !== product.orderItemId && (
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                                {ratingTexts[star]}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      {product.isReviewed && product.existingReview ? (
                         <span className="text-xs text-gray-500">{new Date(product.existingReview.reviewDate).toLocaleDateString()}</span>
                      ) : (
                         <button 
                           className="text-xs text-blue-500 hover:underline"
                           onClick={() => openReviewOverlay(product)} >
                           Review
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
           ) : (
             <div className="text-center py-10 text-gray-500">
               {selectedTab === 'Pending reviews' ? 'No pending reviews.' : 'No completed reviews.'}
             </div>
           )} 

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {overlayState.isOpen && overlayState.selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <Image 
                  src={overlayState.selectedProduct.productImage || '/placeholder.png'}
                  alt={overlayState.selectedProduct.productName}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-raleway text-lg">{overlayState.selectedProduct.productName}</h3>
                  <div className="text-sm text-gray-500">Size: {overlayState.selectedProduct.size || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Color: {overlayState.selectedProduct.color || 'N/A'}</div>
                </div>
              </div>
              <button 
                onClick={closeReviewOverlay}
                className="w-6 h-6 flex items-center justify-center"
                disabled={overlayState.isSubmitting}
              >
                <Image 
                  src="/icons/Close.png"
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
                    onClick={() => setOverlayRating(star)}
                    onMouseEnter={() => setOverlayHoveredStars(star)}
                    onMouseLeave={() => setOverlayHoveredStars(0)}
                    className="text-2xl text-yellow-400 relative group cursor-pointer"
                    disabled={overlayState.isSubmitting}
                  >
                    {((overlayState.hoveredStars > 0 && star <= overlayState.hoveredStars) || 
                      (overlayState.rating > 0 && star <= overlayState.rating)) 
                      ? '★' 
                      : '☆'
                    }
                    {overlayState.hoveredStars === star && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
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
                value={overlayState.text}
                onChange={(e) => setOverlayText(e.target.value)}
                className={`w-full h-32 p-2 border rounded-lg resize-none ${overlayState.isSubmitting ? 'bg-gray-100' : ''}`}
                placeholder="Write your review here..."
                disabled={overlayState.isSubmitting}
              />
            </div>
            
            {overlayState.submitError && (
              <p className="text-red-500 text-sm mb-2 text-center">{overlayState.submitError}</p>
            )}

            <button
              onClick={submitReview}
              className={`w-full bg-[#FF8000] text-white py-2 rounded-lg hover:bg-[#FF9933] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              disabled={overlayState.isSubmitting || overlayState.rating === 0}
            >
              {overlayState.isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}