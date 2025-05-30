"use client"
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/components/sidebar/Sidebar'
import ReviewIcon from '@/components/icons/Review'
import { useReviewsStore, ReviewableProductUi, ApiReview, SelectedTab as StoreSelectedTab } from '@/app/stores/reviewsStore'
import { useUserStore } from '@/app/stores/userStore'
import { toast } from 'react-hot-toast';

const ratingTexts: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Normal',
  4: 'Good',
  5: 'Very Good'
}

export default function MyReviewsPage() {
  const router = useRouter()
  // Individual hover state for each product card when overlay is not open for it
  const [cardHoveredStars, setCardHoveredStars] = useState<Record<string | number, number>>({});

  const {
    pendingProducts,
    completedReviews,
    isLoadingPending,
    isLoadingCompleted,
    error,
    selectedTab,
    currentPage,
    productsPerPage,
    overlayState,
    fetchPendingReviews,
    fetchCompletedReviews,
    setSelectedTab,
    setCurrentPage,
    openReviewOverlay,
    closeReviewOverlay,
    setOverlayRating,
    setOverlayText,
    setOverlayHoveredStars, // This will be primarily for the overlay itself
    submitReview
  } = useReviewsStore()

  const { user } = useUserStore()
  const userId = user?.id

  useEffect(() => {
    if (userId) {
      if (selectedTab === 'Pending reviews') {
        fetchPendingReviews();
      } else if (selectedTab === 'Completed reviews') {
        fetchCompletedReviews(userId);
      }
    }
  }, [userId, selectedTab, fetchPendingReviews, fetchCompletedReviews]);

  const currentProductsToDisplay: (ReviewableProductUi | ApiReview)[] = selectedTab === 'Pending reviews' 
    ? pendingProducts 
    : completedReviews;

  const isLoading = selectedTab === 'Pending reviews' ? isLoadingPending : isLoadingCompleted;

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const paginatedProducts = currentProductsToDisplay.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(currentProductsToDisplay.length / productsPerPage)

  const handleSubmitReview = async () => {
    try {
      await submitReview(); 
      const currentError = useReviewsStore.getState().overlayState.submitError;
      if (!currentError) {
         toast.success('Review submitted successfully!');
      } else {
        // Hata mesajı store'dan overlay'de zaten gösteriliyor, ek olarak toast da gösterilebilir.
        toast.error(currentError || 'Failed to submit review. Please try again.');
      }
    } catch (e) {
      toast.error("An unexpected error occurred while submitting the review.");
      console.error("Error in handleSubmitReview on page:", e)
    }
  }

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

  const renderReviewCard = (item: ReviewableProductUi | ApiReview, index: number) => {
    const isPendingProduct = (product: any): product is ReviewableProductUi => product && typeof product.isReviewed === 'boolean';
    const isCompletedReview = (review: any): review is ApiReview => review && review.reviewID !== undefined && !isPendingProduct(review);

    let cardKey: string | number;
    let imageUrl: string | null | undefined;
    let productName: string | undefined;
    let displayDate: string | undefined;
    // let ratingToShow: number | undefined; // Bu doğrudan JSX içinde belirlenecek
    // let commentToShow: string | null | undefined; // Bu doğrudan JSX içinde kullanılacak
    // let canReviewOrEdit = false; // Bu doğrudan JSX içinde belirlenecek
    // let reviewButtonText = "Review"; // Bu doğrudan JSX içinde belirlenecek

    if (isPendingProduct(item)) {
      cardKey = item.orderItemId;
      imageUrl = item.productId ? `/api-proxy/product-image/${item.productId}` : '/placeholder.png';
      productName = item.productName;
      displayDate = new Date(item.orderDate).toLocaleDateString();
    } else if (isCompletedReview(item)) {
      cardKey = item.reviewID;
      imageUrl = item.productID ? `/api-proxy/product-image/${item.productID}` : '/placeholder.png';
      productName = item.productName === null ? undefined : item.productName;
      displayDate = new Date(item.reviewDate).toLocaleDateString();
    } else {
      return null;
    }

    const itemIsSelectedInOverlay = overlayState.isOpen && overlayState.selectedProduct?.orderItemId === (isPendingProduct(item) ? item.orderItemId : undefined);
    const currentCardHoverRating = cardHoveredStars[cardKey] || 0;

    return (
      <div key={cardKey} className="w-[200px] h-[150px]">
        <div className="h-[100px] relative">
          <Image 
            src={imageUrl || '/placeholder.png'}
            alt={productName || 'Product image'}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="h-[50px] bg-[#D9D9D9] rounded-b-lg p-2 flex flex-col justify-between">
          <div className="font-raleway text-xs mb-0.5 truncate leading-tight">
            {productName}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                let starFilled = false;
                if (isPendingProduct(item)) {
                  if (item.isReviewed && item.existingReview) {
                    starFilled = star <= item.existingReview.rating;
                  } else if (itemIsSelectedInOverlay) {
                    starFilled = overlayState.hoveredStars > 0 ? star <= overlayState.hoveredStars : star <= overlayState.rating;
                  } else {
                    starFilled = currentCardHoverRating > 0 ? star <= currentCardHoverRating : star <= (item.userRating || 0);
                  }
                } else if (isCompletedReview(item)) {
                  starFilled = star <= item.rating;
                }

                return (
                  <button
                    key={star}
                    onClick={() => {
                      if (isPendingProduct(item) && !item.isReviewed) {
                        // Karttaki yıldızlara tıklanınca direkt overlay'i o rating ile aç
                        openReviewOverlay({...item, userRating: star}); 
                      }
                      // TODO: Completed review tıklandığında detay gösterme/edit overlay açma
                    }}
                    onMouseEnter={() => {
                      if (isPendingProduct(item) && !item.isReviewed && !itemIsSelectedInOverlay) {
                        setCardHoveredStars(prev => ({ ...prev, [cardKey]: star }));
                      } else if (isPendingProduct(item) && !item.isReviewed && itemIsSelectedInOverlay) {
                        setOverlayHoveredStars(star); // Overlay açıksa overlay'in hover'ını güncelle
                      }
                    }}
                    onMouseLeave={() => {
                      if (isPendingProduct(item) && !item.isReviewed && !itemIsSelectedInOverlay) {
                        setCardHoveredStars(prev => ({ ...prev, [cardKey]: 0 }));
                      } else if (isPendingProduct(item) && !item.isReviewed && itemIsSelectedInOverlay) {
                        setOverlayHoveredStars(0); // Overlay açıksa overlay'in hover'ını sıfırla
                      }
                    }}
                    className={`text-yellow-400 relative group ${isPendingProduct(item) && !item.isReviewed ? 'cursor-pointer' : 'cursor-default'}`}
                    disabled={isPendingProduct(item) && item.isReviewed}
                  >
                    {starFilled ? '★' : '☆'}
                    {isPendingProduct(item) && !item.isReviewed && 
                     ((!itemIsSelectedInOverlay && currentCardHoverRating === star && star > 0) || 
                      (itemIsSelectedInOverlay && overlayState.hoveredStars === star && star > 0)) && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                        {ratingTexts[star]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {isPendingProduct(item) && !item.isReviewed && (
                <button 
                 className="text-xs text-blue-500 hover:underline"
                 onClick={() => openReviewOverlay(item)} >
                 Review
               </button>
            )}
             {isCompletedReview(item) && (
                <span className="text-xs text-gray-500">{new Date(item.reviewDate).toLocaleDateString()}</span>
            )}
            {isPendingProduct(item) && item.isReviewed && item.existingReview && (
                 <span className="text-xs text-gray-500">{new Date(item.existingReview.reviewDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            ] as StoreSelectedTab[]).map((tab) => (
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
                  <ReviewIcon className={selectedTab === tab ? 'text-[#40BFFF]' : 'text-gray-500 group-hover:text-[#40BFFF]'} />
                </button>
              </div>
            ))}
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((item, index) => renderReviewCard(item, index))}
            </div>
           ) : (
             <div className="text-center py-10 text-gray-500">
               {selectedTab === 'Pending reviews' ? 'No pending reviews.' : 'No completed reviews found.'}
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
                  src={overlayState.selectedProduct.productImageUrl || '/placeholder.png'}
                  alt={overlayState.selectedProduct.productName}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-raleway text-lg">{overlayState.selectedProduct.productName}</h3>
                  <div className="text-sm text-gray-500">Order Date: {new Date(overlayState.selectedProduct.orderDate).toLocaleDateString()}</div>
                </div>
              </div>
              <button 
                onClick={closeReviewOverlay}
                className="w-6 h-6 flex items-center justify-center"
                disabled={overlayState.isSubmitting}
              >
                <Image 
                  src="/Close.png"
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
                    onClick={() => setOverlayRating(star)} // Overlay içindeki yıldızlar her zaman overlay rating'ini set eder
                    onMouseEnter={() => setOverlayHoveredStars(star)} // Overlay içindeyse her zaman overlay hover'ını set eder
                    onMouseLeave={() => setOverlayHoveredStars(0)}
                    className="text-2xl text-yellow-400 relative group cursor-pointer"
                    disabled={overlayState.isSubmitting}
                  >
                    {((overlayState.hoveredStars > 0 && star <= overlayState.hoveredStars) || 
                      (overlayState.rating > 0 && star <= overlayState.rating)) 
                      ? '★' 
                      : '☆'
                    }
                    {overlayState.hoveredStars === star && star > 0 && (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
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
              onClick={handleSubmitReview}
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