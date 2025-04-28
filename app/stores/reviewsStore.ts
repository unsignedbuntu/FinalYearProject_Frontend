import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// API servis fonksiyonlarını import edelim
import { getUserOrders, getUserReviews, submitReviewApi, getOrderDetails } from '@/services/API_Service'; 
// userStore'dan kullanıcı ID'sini almak için
import { useUserStore } from './userStore'; 

// Tipler
// ReviewableProduct'ı export edelim
export interface ReviewableProduct {
  productId: number;
  orderItemId: number; // Sipariş öğesi ID'si, aynı ürünü farklı siparişlerde ayırt etmek için
  productName: string;
  productImage: string | null;
  orderDate: Date; // Sipariş tarihi, sıralama için
  isReviewed: boolean;
  // Eğer yorumlanmışsa mevcut yorum bilgisi
  existingReview?: {
    reviewId: number;
    rating: number;
    comment: string;
    reviewDate: Date;
  };
  // Overlay için geçici kullanıcı rating'i (henüz kaydedilmemiş)
  userRating?: number; 
  size?: string; // Sipariş detayından alınabilir
  color?: string; // Sipariş detayından alınabilir
}

interface ReviewOverlayState {
  isOpen: boolean;
  selectedProduct: ReviewableProduct | null;
  rating: number; // Zorunlu yıldız rating'i
  text: string; // Opsiyonel yorum metni
  hoveredStars: number; // Sadece UI için overlay içindeki hover durumu
  isSubmitting: boolean;
  submitError: string | null;
}

// SelectedTab'ı export edelim
export type SelectedTab = 'Pending reviews' | 'Completed reviews';

interface Order {
  orderId?: number; 
  orderDate: string;
  status: string;
  totalAmount: number;
  userId?: number;
  // Add orderItems if it comes from getOrderDetails
  orderItems?: any[]; // Use a more specific type if possible
}

interface ReviewsState {
  productsToReview: ReviewableProduct[];
  isLoading: boolean;
  error: string | null;
  selectedTab: SelectedTab;
  currentPage: number;
  productsPerPage: number;
  overlayState: ReviewOverlayState;
  fetchReviewsAndOrders: (userId: number) => Promise<boolean>; // Boş durum kontrolü için boolean dönebilir
  setSelectedTab: (tab: SelectedTab) => void;
  setCurrentPage: (page: number) => void;
  openReviewOverlay: (product: ReviewableProduct) => void;
  closeReviewOverlay: () => void;
  setOverlayRating: (rating: number) => void;
  setOverlayText: (text: string) => void;
  setOverlayHoveredStars: (rating: number) => void;
  submitReview: () => Promise<void>;
}

const initialOverlayState: ReviewOverlayState = {
  isOpen: false,
  selectedProduct: null,
  rating: 0, // Başlangıçta 0, kullanıcı seçmeli
  text: '',
  hoveredStars: 0,
  isSubmitting: false,
  submitError: null,
};

// Helper type for Promise.allSettled results
type PromiseSettledResult<T> = 
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: any };

export const useReviewsStore = create<ReviewsState>()(
  devtools(
    (set, get) => ({
      // --- STATE ---
      productsToReview: [],
      isLoading: false,
      error: null,
      selectedTab: 'Pending reviews',
      currentPage: 1,
      productsPerPage: 12, // Sabit veya ayarlanabilir
      overlayState: initialOverlayState,

      // --- ACTIONS ---
      fetchReviewsAndOrders: async (userId) => {
        set({ isLoading: true, error: null, productsToReview: [] }); // Clear previous products
        try {
          console.log(`ReviewsStore: Fetching initial orders list for user: ${userId}`);
          const initialOrdersResponse = await getUserOrders(userId);
          const initialOrders = (initialOrdersResponse || []) as Order[]; // Cast to Order[]
          console.log('ReviewsStore: Initial orders fetched:', initialOrders);

          if (initialOrders.length === 0) {
             console.log('ReviewsStore: No orders found initially.');
             set({ isLoading: false });
             return true; // isEmpty = true
          }

          // Fetch details for each order to get orderItems
          console.log(`ReviewsStore: Fetching details for ${initialOrders.length} orders...`);
          const orderDetailPromises = initialOrders.map((order: Order) => 
              order.orderId ? getOrderDetails(order.orderId) : Promise.reject(`Order missing orderId: ${JSON.stringify(order)}`)
          );
          
          // Use Promise.allSettled to handle potential errors for individual orders
          const orderDetailResults = await Promise.allSettled(orderDetailPromises);
          console.log('ReviewsStore: Order detail results (settled):', orderDetailResults);

          // Filter out rejected promises and keep only fulfilled order details
          const successfulOrdersWithDetails: Order[] = orderDetailResults
              .filter((result): result is PromiseSettledResult<Order> & { status: 'fulfilled' } => result.status === 'fulfilled')
              .map(result => result.value);
          console.log('ReviewsStore: Successfully fetched order details:', successfulOrdersWithDetails);

          // Fetch reviews (can be done in parallel with details or after)
          console.log(`ReviewsStore: Fetching reviews for user: ${userId}`);
          const reviewsResponse = await getUserReviews(userId);
          const reviews = reviewsResponse || [];
          console.log('ReviewsStore: Reviews fetched:', reviews);

          // Now process the orders *with details* and reviews
          const processedProductsMap = new Map<number, ReviewableProduct>();
          console.log('ReviewsStore: Processing orders with details...');

          for (const orderDetail of successfulOrdersWithDetails) {
             // Check if orderItems exist in the detailed response
            if (orderDetail.orderItems && Array.isArray(orderDetail.orderItems)) {
              console.log(`ReviewsStore: Processing items for orderId ${orderDetail.orderId}`);
              for (const item of orderDetail.orderItems) {
                 console.log('ReviewsStore: Processing item from details:', item);
                // Ensure field names match the response from getOrderDetails
                const productId = item.product?.productID; // ADJUST FIELD NAME IF NEEDED
                const orderItemId = item.orderItemID; // ADJUST FIELD NAME IF NEEDED
                console.log(`ReviewsStore: Extracted productId: ${productId}, orderItemId: ${orderItemId}`);

                if (productId && orderItemId) {
                  if (!processedProductsMap.has(orderItemId)) {
                    console.log(`ReviewsStore: Adding item ${orderItemId} to map from order ${orderDetail.orderId}.`);
                    const productData: ReviewableProduct = {
                      productId: productId,
                      orderItemId: orderItemId,
                      productName: item.product?.productName || 'Unknown Product',
                      productImage: item.product?.image || null,
                      orderDate: new Date(orderDetail.orderDate), // Use date from detail response
                      isReviewed: false,
                      size: item.size,
                      color: item.color,
                    };
                    processedProductsMap.set(orderItemId, productData);
                  } else {
                    console.log(`ReviewsStore: Item ${orderItemId} already processed, skipping.`);
                  }
                } else {
                   console.warn(`ReviewsStore: Missing productId or orderItemId for item in order ${orderDetail.orderId}:`, item);
                }
              }
            } else {
                 console.log(`ReviewsStore: No orderItems found in details for orderId ${orderDetail.orderId}`);
            }
          }

          // Match with reviews (same logic as before)
           console.log('ReviewsStore: Matching with reviews...');
           for (const review of reviews as any[]) { // Assuming review type might be less defined
            // ... (review matching logic - check field names: review.orderItemId, review.reviewID etc.)
             const orderItemId = review.orderItemId; // ADJUST FIELD NAME IF NEEDED
             console.log(`ReviewsStore: Extracted orderItemId from review: ${orderItemId}`);
            
            if (orderItemId && processedProductsMap.has(orderItemId)) {
              console.log(`ReviewsStore: Found match for review, marking item ${orderItemId} as reviewed.`);
              const productToUpdate = processedProductsMap.get(orderItemId)!;
              productToUpdate.isReviewed = true;
              productToUpdate.existingReview = {
                reviewId: review.reviewID, // ADJUST FIELD NAME IF NEEDED
                rating: review.rating, // ADJUST FIELD NAME IF NEEDED
                comment: review.comment, // ADJUST FIELD NAME IF NEEDED
                reviewDate: new Date(review.reviewDate), // ADJUST FIELD NAME IF NEEDED
              };
              processedProductsMap.set(orderItemId, productToUpdate);
            } else {
                 console.log(`ReviewsStore: No matching product found in map for review's orderItemId: ${orderItemId}`);
            }
           }

          // Final processing
          const processedProducts = Array.from(processedProductsMap.values())
                                      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
          
          set({ productsToReview: processedProducts, isLoading: false });
          console.log('ReviewsStore: Final processed products for review:', processedProducts);
          
          return processedProducts.length === 0; // Return isEmpty status

        } catch (err) {
          console.error("ReviewsStore: Error in fetchReviewsAndOrders:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to load review data';
          set({ error: errorMessage, isLoading: false, productsToReview: [] });
          return false; // Assume not empty on error to prevent unwanted redirect
        }
      },

      setSelectedTab: (tab) => {
        set({ selectedTab: tab, currentPage: 1 }); // Sekme değişince ilk sayfaya dön
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      openReviewOverlay: (product) => {
        set({ 
          overlayState: { 
            ...initialOverlayState, 
            isOpen: true, 
            selectedProduct: product,
            rating: product.userRating || product.existingReview?.rating || 0, // Mevcut yorumun rating'ini de al
            text: product.existingReview?.comment || '', // Mevcut yorumun metnini de al
          } 
        });
      },

      closeReviewOverlay: () => {
        set({ overlayState: initialOverlayState });
      },

      setOverlayRating: (rating) => {
        set(state => ({ 
          overlayState: { ...state.overlayState, rating: rating, submitError: null } 
        }));
      },

      setOverlayText: (text) => {
        set(state => ({ overlayState: { ...state.overlayState, text: text } }));
      },
      
      setOverlayHoveredStars: (rating) => {
         set(state => ({ overlayState: { ...state.overlayState, hoveredStars: rating } }));
      },

      submitReview: async () => {
        const { overlayState } = get();
        const { selectedProduct, rating, text } = overlayState;
        // userStore'dan state al
        const userState = useUserStore.getState();
        const userId = userState.user?.id;

        if (userId === null || userId === undefined) {
          set(state => ({ overlayState: { ...state.overlayState, submitError: 'User not logged in.' } }));
          return;
        }

        if (!selectedProduct || rating === 0) {
           set(state => ({ overlayState: { ...state.overlayState, submitError: 'Please select a star rating.' } }));
          return;
        }

        set(state => ({ overlayState: { ...state.overlayState, isSubmitting: true, submitError: null } }));

        try {
           const reviewPayload = { 
             userId: userId,
             productId: selectedProduct.productId, 
             rating: rating, 
             comment: text,
             // Backend'in DTO'suna göre orderItemId gerekliyse ekle
             // orderItemId: selectedProduct.orderItemId 
           };
           console.log('Submitting review with payload:', reviewPayload);
           
           // API çağrısını yap
           const submittedReview = await submitReviewApi(reviewPayload);
           
           // Backend yanıtının yapısını varsayalım
           // submittedReview: { reviewID: number, rating: number, comment: string, reviewDate: string, ... }
           console.log('Review submitted successfully:', submittedReview);

           // State'deki ürünü güncelle
           set(state => ({
             productsToReview: state.productsToReview.map(p => 
               p.orderItemId === selectedProduct.orderItemId 
                 ? { 
                     ...p, 
                     isReviewed: true, 
                     existingReview: { 
                       reviewId: submittedReview.reviewID, // Yanıttan al
                       rating: submittedReview.rating,    // Yanıttan al
                       comment: submittedReview.comment,  // Yanıttan al
                       reviewDate: new Date(submittedReview.reviewDate) // Yanıttan al ve Date'e çevir
                     },
                     userRating: undefined 
                   } 
                 : p
             ),
             overlayState: initialOverlayState // Overlay'i kapat ve sıfırla
           }));

        } catch (err) {
          console.error("Error submitting review:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
           set(state => ({ overlayState: { ...state.overlayState, isSubmitting: false, submitError: errorMessage } }));
        }
      },
    }),
    { name: 'reviews-store' } // DevTools için isim
  )
);

// Gerekirse seçiciler (selectors) eklenebilir
// export const selectPendingReviews = (state: ReviewsState) => state.productsToReview.filter(p => !p.isReviewed);
// export const selectCompletedReviews = (state: ReviewsState) => state.productsToReview.filter(p => p.isReviewed); 