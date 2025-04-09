import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// API servis fonksiyonlarını import edelim
import { getUserOrders, getUserReviews, submitReviewApi } from '@/services/API_Service'; 
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
        set({ isLoading: true, error: null });
        try {
          console.log(`Fetching orders and reviews for user: ${userId}`);
          // API çağrılarını yap
          const ordersResponse = await getUserOrders(userId);
          const reviewsResponse = await getUserReviews(userId);
          
          // API yanıtlarının yapısını varsayalım (backend koduna göre)
          // ordersResponse: OrdersResponseDTO[]
          // reviewsResponse: ReviewsResponseDTO[] (veya benzeri)
          const orders = ordersResponse || [];
          const reviews = reviewsResponse || [];

          console.log('Orders fetched:', orders);
          console.log('Reviews fetched:', reviews);

          const processedProductsMap = new Map<number, ReviewableProduct>();

          // 1. Siparişlerden ürünleri işle
          for (const order of orders) {
            if (order.orderItems && Array.isArray(order.orderItems)) {
              for (const item of order.orderItems) {
                // Backend OrderItemsResponseDTO'nun yapısına göre alan adlarını düzeltin
                const productId = item.product?.productID; // Varsayım
                const orderItemId = item.orderItemID; // Varsayım
                
                if (productId && orderItemId && !processedProductsMap.has(orderItemId)) {
                  // Ürün daha önce eklenmediyse işle
                  const productData: ReviewableProduct = {
                    productId: productId,
                    orderItemId: orderItemId,
                    productName: item.product?.productName || 'Unknown Product', // Varsayım
                    productImage: item.product?.image || null, // Varsayım
                    orderDate: new Date(order.orderDate), // Varsayım
                    isReviewed: false, // Başlangıçta false
                    size: item.size, // Varsayım (DTO'da varsa)
                    color: item.color, // Varsayım (DTO'da varsa)
                  };
                  processedProductsMap.set(orderItemId, productData);
                }
              }
            }
          }

          // 2. Yorumlarla eşleştir ve güncelle
          for (const review of reviews) {
            // Backend ReviewsResponseDTO'nun yapısına göre alan adlarını düzeltin
            const orderItemId = review.orderItemId; // Yorumun hangi sipariş öğesine ait olduğu (Varsayım!)
            // VEYA productId ile eşleştirme (eğer orderItemId yoksa)
            // const productId = review.productId; 
            
            if (orderItemId && processedProductsMap.has(orderItemId)) {
              const productToUpdate = processedProductsMap.get(orderItemId)!;
              productToUpdate.isReviewed = true;
              productToUpdate.existingReview = {
                reviewId: review.reviewID, // Varsayım
                rating: review.rating, // Varsayım
                comment: review.comment, // Varsayım
                reviewDate: new Date(review.reviewDate), // Varsayım
              };
              processedProductsMap.set(orderItemId, productToUpdate);
            }
            // else if (productId) { ... productId ile eşleştirme mantığı ... }
          }

          // Map'i diziye çevir ve tarihe göre sırala (en yeni siparişler/ürünler başta)
          const processedProducts = Array.from(processedProductsMap.values())
                                      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
          
          set({ productsToReview: processedProducts, isLoading: false });
          console.log('Processed products for review:', processedProducts);
          
          // Boş durum kontrolü
          return processedProducts.length === 0; 

        } catch (err) {
          console.error("Error fetching reviews/orders:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
          set({ error: errorMessage, isLoading: false });
          return false; 
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