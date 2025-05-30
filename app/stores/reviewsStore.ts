import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getReviewableOrderItems,      
  createReview,                 
  getReviewsByUserId,           
  ApiReviewableProduct as ApiServiceReviewableProduct, // Alias to avoid naming conflict 
  ApiReview as ApiServiceReview,                    // Alias to avoid naming conflict
  ApiCreateReviewPayload      
} from '@/services/API_Service'; 
import { useUserStore } from './userStore'; 

// Re-export API types if they are used directly by components
export type { ApiServiceReviewableProduct as ApiReviewableProduct, ApiServiceReview as ApiReview };

// Tipler
// ReviewableProductUi, ApiReviewableProduct'ı temel alır ve UI'a özel alanlar ekler.
export interface ReviewableProductUi extends ApiServiceReviewableProduct { 
  isReviewed: boolean;
  existingReview?: {
    reviewId: number;
    rating: number;
    comment?: string | null;
    reviewDate: Date; // UI'da Date objesi olarak kullanmak daha kolay olabilir
  };
  userRating?: number; // Overlay için geçici kullanıcı rating'i
}

interface ReviewOverlayState {
  isOpen: boolean;
  selectedProduct: ReviewableProductUi | null;
  rating: number; 
  text: string; 
  hoveredStars: number; 
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
  pendingProducts: ReviewableProductUi[]; 
  completedReviews: ApiServiceReview[];         
  isLoadingPending: boolean;
  isLoadingCompleted: boolean;
  error: string | null;
  selectedTab: SelectedTab;
  currentPage: number;
  productsPerPage: number;
  overlayState: ReviewOverlayState;
  fetchPendingReviews: () => Promise<boolean>;       
  fetchCompletedReviews: (userId: number) => Promise<void>; 
  setSelectedTab: (tab: SelectedTab) => void;
  setCurrentPage: (page: number) => void;
  openReviewOverlay: (product: ReviewableProductUi) => void;
  closeReviewOverlay: () => void;
  setOverlayRating: (rating: number) => void;
  setOverlayText: (text: string) => void;
  setOverlayHoveredStars: (rating: number) => void;
  submitReview: () => Promise<void>;
}

const initialOverlayState: ReviewOverlayState = {
  isOpen: false,
  selectedProduct: null,
  rating: 0, 
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
      pendingProducts: [],
      completedReviews: [],
      isLoadingPending: false,
      isLoadingCompleted: false,
      error: null,
      selectedTab: 'Pending reviews',
      currentPage: 1,
      productsPerPage: 12, 
      overlayState: initialOverlayState,

      // --- ACTIONS ---
      fetchPendingReviews: async () => {
        set({ isLoadingPending: true, error: null });
        try {
          const reviewableItems = await getReviewableOrderItems(); 
          // ApiReviewableProduct.orderDate string olarak kalır.
          // ReviewableProductUi.orderDate de string olur.
          // Eğer UI'da Date objesine ihtiyaç olursa, component içinde new Date(item.orderDate) yapılır.
          const uiProducts: ReviewableProductUi[] = reviewableItems.map(item => ({
            ...item, // orderDate string olarak gelir ve öyle kalır
            isReviewed: false, 
          }));
          set({ pendingProducts: uiProducts, isLoadingPending: false });
          console.log('ReviewsStore: Fetched pending reviews:', uiProducts);
          return uiProducts.length === 0; 
        } catch (err) {
          console.error("ReviewsStore: Error in fetchPendingReviews:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to load pending reviews';
          set({ error: errorMessage, isLoadingPending: false, pendingProducts: [] });
          return false; 
        }
      },

      fetchCompletedReviews: async (userId) => {
        set({ isLoadingCompleted: true, error: null });
        try {
          const reviews = await getReviewsByUserId(userId); 
          set({ completedReviews: reviews, isLoadingCompleted: false });
          console.log('ReviewsStore: Fetched completed reviews:', reviews);
        } catch (err) {
          console.error("ReviewsStore: Error in fetchCompletedReviews:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to load completed reviews';
          set({ error: errorMessage, isLoadingCompleted: false, completedReviews: [] });
        }
      },

      setSelectedTab: (tab) => {
        set({ selectedTab: tab, currentPage: 1 }); 
        const userId = useUserStore.getState().user?.id;
        if (tab === 'Pending reviews') {
          get().fetchPendingReviews();
        } else if (tab === 'Completed reviews' && userId) {
          get().fetchCompletedReviews(userId);
        }
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
            rating: product.userRating || product.existingReview?.rating || 0, 
            text: product.existingReview?.comment || '', 
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
        const userId = useUserStore.getState().user?.id; 

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
           const reviewPayload: ApiCreateReviewPayload = { 
             productID: selectedProduct.productId, 
             orderItemID: selectedProduct.orderItemId, 
             rating: rating, 
             comment: text || null, 
           };
           console.log('Submitting review with payload:', reviewPayload);
           
           const submittedReview = await createReview(reviewPayload); 
           
           console.log('Review submitted successfully:', submittedReview);

           set(state => ({
             pendingProducts: state.pendingProducts.filter(p => 
               p.orderItemId !== selectedProduct.orderItemId 
             ),
             overlayState: initialOverlayState 
           }));
           if (get().selectedTab === 'Completed reviews' && userId) {
             get().fetchCompletedReviews(userId);
           }

        } catch (err) {
          console.error("Error submitting review:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
           set(state => ({ overlayState: { ...state.overlayState, isSubmitting: false, submitError: errorMessage } }));
        }
      },
    }),
    { name: 'reviews-store' } 
  )
);

// Gerekirse seçiciler (selectors) eklenebilir
// export const selectPendingReviews = (state: ReviewsState) => state.productsToReview.filter(p => !p.isReviewed);
// export const selectCompletedReviews = (state: ReviewsState) => state.productsToReview.filter(p => p.isReviewed); 