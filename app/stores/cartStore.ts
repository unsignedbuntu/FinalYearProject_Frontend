import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import {
    CartItemDto,
    AddOrUpdateCartItemRequestDto,
    getUserCart,
    addOrUpdateCartItem,
    removeCartItem,
    clearUserCart
} from '@/services/API_Service';

// Frontend representation of a cart item
interface CartItem extends CartItemDto {
  id: number; // Use productId as the unique identifier
}

// Define the state structure
interface CartState {
  items: CartItem[];
  selectedItems: number[]; // Array of selected productIds
  shippingCost: number; // Example shipping cost
  lastRemovedItems: CartItem[] | null; // For undo functionality
  isLoading: boolean;
  error: string | null;
  // Calculated values derived from state
  getSelectedTotalPrice: () => number;
  getItemCount: () => number; // Total number of unique items
  getTotalQuantity: () => number; // Total quantity of all items
  // Actions to modify the state
  actions: {
    initializeCart: () => Promise<void>;
    addItem: (itemData: AddOrUpdateCartItemRequestDto) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
    toggleItemSelection: (productId: number) => void;
    selectAllItems: (select: boolean) => void;
    removeSelectedItems: () => Promise<void>;
    clearCart: () => Promise<void>;
    undoRemove: () => Promise<void>;
    // Internal helper actions
    _setCartItems: (items: CartItemDto[]) => void;
    _clearLocalState: () => void;
  };
}

// Define the initial state, omitting actions and calculated getters
const initialState: Omit<CartState, 'actions' | 'getSelectedTotalPrice' | 'getItemCount' | 'getTotalQuantity'> = {
      items: [],
      selectedItems: [],
  shippingCost: 49.99, // Default or calculated later
      lastRemovedItems: null,
  isLoading: false,
  error: null,
};

// Create the Zustand store
export const useCartStore = create<CartState>((set, get) => ({
  ...initialState,

  // Calculated Getters
  getSelectedTotalPrice: () => {
    const { items, selectedItems } = get();
    if (!items || items.length === 0) return 0;
    return items
      .filter(item => selectedItems.includes(item.productId))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  getItemCount: () => {
    const { items } = get();
    return items ? items.length : 0;
  },
  getTotalQuantity: () => {
      const { items } = get();
      if (!items) return 0;
      return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Actions
  actions: {
    initializeCart: async () => {
      set({ isLoading: true, error: null });
      try {
        const cartItemsDto = await getUserCart();
        get().actions._setCartItems(cartItemsDto); // Use helper to map and set
        console.log('Sepet başarıyla yüklendi.');
        // Set loading false only after successful data processing
        set({ isLoading: false });
      } catch (error: any) {
        console.error('Sepet yüklenirken hata:', error);
        set({ error: 'Sepet yüklenemedi.', isLoading: false });
      }
      // No finally block needed if isLoading is set in both try and catch
    },

    addItem: async (itemData) => {
      set({ isLoading: true, error: null });
      let success = false;
      try {
        const updatedItemDto = await addOrUpdateCartItem(itemData);
        if (updatedItemDto) {
          set(state => {
            const existingItemIndex = state.items.findIndex(item => item.productId === itemData.productId);
            const updatedItems = [...state.items];
            const newItem: CartItem = { ...updatedItemDto, id: updatedItemDto.productId };

            if (existingItemIndex > -1) {
              updatedItems[existingItemIndex] = newItem;
            } else {
              updatedItems.push(newItem);
            }
            toast.success(`${newItem.productName || 'Ürün'} sepete eklendi/güncellendi!`);
            success = true; // Mark success for finally block
            return { items: updatedItems, error: null }; // Explicitly clear error on success
          });
        } else {
          throw new Error('Backend yanıtı eksik veya geçersiz.');
        }
      } catch (error: any) {
        console.error('Sepete eklenirken/güncellenirken hata:', error);
        const errorMessage = error.message || 'Ürün sepete eklenemedi/güncellenemedi.';
        set({ error: errorMessage }); // Set error state
        toast.error(errorMessage);
      } finally {
        // Always set loading to false, keep error state if success was not marked
        set(state => ({ isLoading: false, error: success ? null : state.error }));
      }
    },

    removeItem: async (productId) => {
      const itemToRemove = get().items.find(item => item.productId === productId);
      if (!itemToRemove) return;

      set({ isLoading: true, error: null });
      let success = false;
      try {
        await removeCartItem(productId);
        set(state => ({
          items: state.items.filter(item => item.productId !== productId),
          selectedItems: state.selectedItems.filter(id => id !== productId),
          lastRemovedItems: [itemToRemove],
          error: null // Clear error on success
        }));
        toast.success(`${itemToRemove.productName || 'Ürün'} sepetten kaldırıldı.`);
        success = true;
      } catch (error: any) {
        console.error('Sepetten kaldırılırken hata:', error);
        const errorMessage = error.message || 'Ürün sepetten kaldırılamadı.';
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set(state => ({ isLoading: false, error: success ? null : state.error }));
      }
    },

    updateQuantity: async (productId, newQuantity) => {
      if (newQuantity < 1) {
        await get().actions.removeItem(productId); // Use existing removeItem action
        return;
      }

      const itemToUpdate = get().items.find(item => item.productId === productId);
      if (!itemToUpdate) return;

      // Avoid API call if quantity hasn't changed
      if (itemToUpdate.quantity === newQuantity) return;

      set({ isLoading: true, error: null });
      let success = false;
      try {
        const updateData: AddOrUpdateCartItemRequestDto = { productId, quantity: newQuantity };
        const updatedItemDto = await addOrUpdateCartItem(updateData);
        if (updatedItemDto) {
          set(state => ({
            items: state.items.map(item =>
              item.productId === productId
                ? { ...item, ...updatedItemDto, id: updatedItemDto.productId }
                : item
            ),
            error: null // Clear error on success
          }));
           toast.success(`${itemToUpdate.productName || 'Ürün'} miktarı güncellendi.`);
          success = true;
        } else {
          throw new Error('Miktar güncellenirken backend yanıtı eksik veya geçersiz.');
        }
      } catch (error: any) {
        console.error('Miktar güncellenirken hata:', error);
        const errorMessage = error.message || 'Miktar güncellenemedi.';
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
         set(state => ({ isLoading: false, error: success ? null : state.error }));
      }
    },

    clearCart: async () => {
      const currentItems = get().items;
      if (currentItems.length === 0) return;

      set({ isLoading: true, error: null });
      let success = false;
      try {
        await clearUserCart();
        set({ items: [], selectedItems: [], lastRemovedItems: currentItems, error: null });
        toast.success('Sepet temizlendi.');
        success = true;
      } catch (error: any) {
        console.error('Sepet temizlenirken hata:', error);
        const errorMessage = error.message || 'Sepet temizlenemedi.';
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set(state => ({ isLoading: false, error: success ? null : state.error }));
      }
    },

    removeSelectedItems: async () => {
        const selectedIds = get().selectedItems;
        if (selectedIds.length === 0) {
            toast('Silinecek ürün seçilmedi.');
            return;
        }

        const itemsToRemove = get().items.filter(item => selectedIds.includes(item.productId));
        set({ isLoading: true, error: null });
        let successCount = 0;
        let errorsOccurred = false;
        const successfullyRemovedIds: number[] = []; // Keep track of successful removals

        try {
            const results = await Promise.allSettled(
                selectedIds.map(id => removeCartItem(id))
            );

            results.forEach((result, index) => {
                const currentId = selectedIds[index];
                if (result.status === 'fulfilled') {
                    successfullyRemovedIds.push(currentId);
                    successCount++;
                } else {
                    errorsOccurred = true;
                    const failedItemName = itemsToRemove.find(i => i.productId === currentId)?.productName || `Ürün ID: ${currentId}`;
                    console.error(`Seçili ürün ${failedItemName} silinirken hata:`, result.reason);
                    toast.error(`${failedItemName} silinirken hata oluştu.`);
                }
            });

            // Update state based on successful removals
            if (successfullyRemovedIds.length > 0) {
                set(state => ({
                    items: state.items.filter(item => !successfullyRemovedIds.includes(item.productId)),
                    selectedItems: [], // Clear selection after attempt
                    // Store only successfully removed items for undo
                    lastRemovedItems: itemsToRemove.filter(item => successfullyRemovedIds.includes(item.productId)),
                    error: errorsOccurred ? 'Bazı ürünler silinemedi.' : null
                }));
                toast.success(`${successCount} ürün sepetten kaldırıldı.`);
            } else if (errorsOccurred) {
                 // Handle case where no items were removed but errors occurred
                 set({ error: 'Seçili ürünler silinemedi.', isLoading: false });
                 // No toast needed here as individual errors were shown
            } else {
                 // Case where selection was empty? Should be caught earlier.
                 set({ isLoading: false }); // Just turn off loading
            }

        } catch (error: any) { // Catch potential general errors like network issues
            errorsOccurred = true;
            console.error('Seçili ürünler silinirken genel hata:', error);
            const errorMessage = error.message || 'Seçili ürünler silinemedi.';
            toast.error(errorMessage);
            set({ error: errorMessage, isLoading: false }); // Set error and turn off loading
        } finally {
           // Ensure loading is always false, error state is handled within try/catch logic
           if (get().isLoading) set({ isLoading: false });
        }
    },


    toggleItemSelection: (productId) => {
      set((state) => {
        const newSelectedItems = state.selectedItems.includes(productId)
          ? state.selectedItems.filter(id => id !== productId) // Remove if exists
          : [...state.selectedItems, productId]; // Add if not exists
        return { selectedItems: newSelectedItems };
      });
    },

    selectAllItems: (select) => {
        set(state => ({
            selectedItems: select ? state.items.map(item => item.productId) : []
        }));
    },

    undoRemove: async () => {
        const itemsToRestore = get().lastRemovedItems;
        if (!itemsToRestore || itemsToRestore.length === 0) return;

        set({ isLoading: true, error: null, lastRemovedItems: null }); // Clear undo state immediately
        let successCount = 0;
        let errorsOccurred = false;
        const successfullyRestoredItems: CartItem[] = [];

        try {
            const results = await Promise.allSettled(
                itemsToRestore.map(item =>
                    addOrUpdateCartItem({ productId: item.productId, quantity: item.quantity })
                )
            );

            results.forEach((result, index) => {
                const originalItem = itemsToRestore[index];
                if (result.status === 'fulfilled' && result.value) {
                    successfullyRestoredItems.push({ ...result.value, id: result.value.productId });
                    successCount++;
                } else {
                    errorsOccurred = true;
                    const failedItemName = originalItem.productName || `Ürün ID: ${originalItem.productId}`;
                    const reason = result.status === 'rejected' ? result.reason : 'API yanıtı eksik/geçersiz';
                    console.error(`Geri alınırken ürün ${failedItemName} eklenemedi:`, reason);
                    toast.error(`${failedItemName} geri alınırken hata oluştu.`);
                    // Optional: Re-add failed item to lastRemovedItems if needed?
                }
            });

            // Add successfully restored items back to the state
            if (successfullyRestoredItems.length > 0) {
                set(state => ({
                    items: [...state.items, ...successfullyRestoredItems],
                    error: errorsOccurred ? 'Bazı ürünler geri alınamadı.' : null
                }));
                toast.success(`${successCount} ürün geri alındı.`);
            } else if (errorsOccurred) {
                // Handle case where no items were restored but errors occurred
                set({ error: 'Ürünler geri alınamadı.', isLoading: false });
                 // No toast needed here as individual errors were shown
            } else {
                 set({ isLoading: false }); // Just turn off loading
            }

        } catch (error: any) { // Catch potential general errors
            errorsOccurred = true;
            console.error('Geri alma işlemi sırasında genel hata:', error);
            toast.error('Ürünler geri alınırken bir hata oluştu.');
            set({ error: 'Geri alma işlemi sırasında genel hata oluştu.', isLoading: false });
        } finally {
             if (get().isLoading) set({ isLoading: false });
        }
    },


    // --- Helper Actions ---
    _setCartItems: (itemsDto: CartItemDto[]) => {
      const mappedItems: CartItem[] = itemsDto.map(dto => ({
        ...dto,
        id: dto.productId // Ensure id is mapped
      }));
      // Reset selection and undo state when initializing or fully replacing items
      set({ items: mappedItems, selectedItems: [], lastRemovedItems: null, error: null });
    },

    _clearLocalState: () => {
      // Reset the store to its initial defined state
      // Need to explicitly pass the calculated getters functions as well if part of state definition
      // However, it's better practice to keep them outside initial state.
      // Let's assume calculated getters are correctly defined outside initialState.
      set({ ...initialState });
    }
  }
}));

// Export hook for accessing actions easily
export const useCartActions = () => useCartStore((state) => state.actions);
