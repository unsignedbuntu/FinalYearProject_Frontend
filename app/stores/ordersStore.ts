import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getUserOrders } from '@/services/API_Service'; // API servisini import et

// Order arayüzünü burada da tanımlayalım veya ortak bir yerden import edelim
interface Order {
  orderId?: number; // Make optional as it might be missing from list response
  orderDate: string;
  status: string;
  totalAmount: number;
  // Add other fields confirmed to be in the actual API response if needed
  userId?: number; // It seems userId is present in the logged objects
}

// Store state'inin arayüzü
interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedTab: string; // 'All', 'Ongoing orders', 'Returns', 'Cancellations'
  currentPage: number;
  ordersPerPage: number;
  expandedOrderId: number | null; // Add state for expanded order
  // Actions
  fetchOrders: (userId: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedTab: (tab: string) => void;
  setCurrentPage: (page: number) => void;
  toggleOrderExpansion: (orderId: number) => void; // Add action type
}

export const useOrdersStore = create<OrdersState>()(
  devtools(
    (set, get) => ({
      // --- INITIAL STATE ---
      orders: [],
      isLoading: true, // Başlangıçta yükleniyor
      error: null,
      searchTerm: '',
      selectedTab: 'All',
      currentPage: 1,
      ordersPerPage: 10, // Sayfa başına sipariş sayısı
      expandedOrderId: null, // Initialize expanded state

      // --- ACTIONS ---
      fetchOrders: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await getUserOrders(userId);
          set({ orders: data || [], isLoading: false });
        } catch (err) {
          console.error("Error fetching orders in store:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to load orders.';
          set({ error: errorMessage, isLoading: false });
        }
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 }); // Arama yapıldığında ilk sayfaya dön
      },

      setSelectedTab: (tab) => {
        set({ selectedTab: tab, currentPage: 1 }); // Sekme değişince ilk sayfaya dön
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      toggleOrderExpansion: (orderId) => {
        set((state) => ({
          expandedOrderId: state.expandedOrderId === orderId ? null : orderId
        }));
      },
    }),
    { name: 'orders-store' } // DevTools için isim
  )
); 