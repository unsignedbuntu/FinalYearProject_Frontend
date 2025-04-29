import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  productId: number
  name: string
  supplier: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  selectedItems: number[]
  totalPrice: number
  shippingCost: number
  lastRemovedItems: CartItem[] | null
  addItem: (itemData: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: number) => void
  undoRemove: () => void
  updateQuantity: (productId: number, quantity: number) => void
  toggleItemSelection: (productId: number) => void
  selectAllItems: (select: boolean) => void
  clearCart: () => void
  getSelectedTotalPrice: () => number
  getItemCount: () => number
  removeSelectedItems: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      totalPrice: 0,
      shippingCost: 49.99,
      lastRemovedItems: null,

      addItem: (itemData) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === itemData.productId);
          const quantityToAdd = itemData.quantity ?? 1;

          if (existingItem) {
            console.log(`CartStore: Updating quantity for productId: ${itemData.productId}`);
            const newQuantity = existingItem.quantity + quantityToAdd;
            const oldTotal = existingItem.price * existingItem.quantity;
            const newTotal = existingItem.price * newQuantity;

            return {
              items: state.items.map(i =>
                i.id === existingItem.id ? { ...i, quantity: newQuantity } : i
              ),
              totalPrice: state.totalPrice - oldTotal + newTotal,
              lastRemovedItems: null,
            };
          } else {
            console.log(`CartStore: Adding new item for productId: ${itemData.productId}`);
            const newItem: CartItem = {
              ...itemData,
              id: Date.now(),
              quantity: quantityToAdd,
            };
            return {
              items: [...state.items, newItem],
              totalPrice: state.totalPrice + (newItem.price * newItem.quantity),
              lastRemovedItems: null,
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const itemToRemove = state.items.find(i => i.productId === productId);
          if (!itemToRemove) return state;

          return {
            items: state.items.filter(i => i.productId !== productId),
            selectedItems: state.selectedItems.filter(itemId => itemId !== itemToRemove.id),
            totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
            lastRemovedItems: [itemToRemove],
          };
        });
      },

      undoRemove: () => {
        set((state) => {
          if (!state.lastRemovedItems || state.lastRemovedItems.length === 0) return state;

          const itemsToRestore = state.lastRemovedItems;
          const restoredTotalPrice = itemsToRestore.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          const restoredItemsWithNewIds = itemsToRestore.map(item => ({ ...item, id: Date.now() + Math.random() }));

          return {
            items: [...state.items, ...restoredItemsWithNewIds],
            totalPrice: state.totalPrice + restoredTotalPrice,
            lastRemovedItems: null,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find(i => i.productId === productId);
          if (!item) return state;

          if (quantity <= 0) {
            console.log(`CartStore: Removing item due to zero quantity: productId ${productId}`);
            const itemToRemove = item;
            return {
              items: state.items.filter(i => i.productId !== productId),
              selectedItems: state.selectedItems.filter(itemId => itemId !== itemToRemove.id),
              totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
              lastRemovedItems: [itemToRemove],
            };
          }

          const oldTotal = item.price * item.quantity;
          const newTotal = item.price * quantity;

          return {
            items: state.items.map(i =>
              i.productId === productId ? { ...i, quantity } : i
            ),
            totalPrice: state.totalPrice - oldTotal + newTotal,
            lastRemovedItems: null,
          };
        });
      },

      toggleItemSelection: (productId) => {
        set((state) => {
          const item = state.items.find(i => i.productId === productId);
          if (!item) return state;
          const uniqueItemId = item.id;
          return {
            selectedItems: state.selectedItems.includes(uniqueItemId)
              ? state.selectedItems.filter(itemId => itemId !== uniqueItemId)
              : [...state.selectedItems, uniqueItemId]
          };
        });
      },

      selectAllItems: (select) => {
        set((state) => ({
          selectedItems: select ? state.items.map(item => item.id) : []
        }));
      },

      clearCart: () => {
        set((state) => ({
          items: [],
          selectedItems: [],
          totalPrice: 0,
          lastRemovedItems: state.items,
        }));
      },

      getSelectedTotalPrice: () => {
        const state = get()
        return state.items
          .filter(item => state.selectedItems.includes(item.id))
          .reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getItemCount: () => {
        return get().items.length
      },

      removeSelectedItems: () => {
        set((state) => {
          const remainingItems = state.items.filter(
            item => !state.selectedItems.includes(item.id)
          );
          const newTotalPrice = remainingItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
          );

          return {
            items: remainingItems,
            selectedItems: [],
            totalPrice: newTotalPrice,
            lastRemovedItems: null,
          };
        });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        selectedItems: state.selectedItems
      })
    }
  )
) 