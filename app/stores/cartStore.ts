import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
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
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: number) => void
  undoRemove: () => void
  updateQuantity: (id: number, quantity: number) => void
  toggleItemSelection: (id: number) => void
  selectAllItems: (select: boolean) => void
  clearCart: () => void
  getSelectedTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      totalPrice: 0,
      shippingCost: 49.99,
      lastRemovedItems: null,

      addItem: (item) => {
        const newItem = { ...item, id: Date.now() }
        set((state) => ({
          items: [...state.items, newItem],
          totalPrice: state.totalPrice + (newItem.price * newItem.quantity),
          lastRemovedItems: null,
        }))
      },

      removeItem: (id) => {
        set((state) => {
          const itemToRemove = state.items.find(i => i.id === id)
          if (!itemToRemove) return state
          
          return {
            items: state.items.filter(i => i.id !== id),
            selectedItems: state.selectedItems.filter(itemId => itemId !== id),
            totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
            lastRemovedItems: [itemToRemove],
          }
        })
      },

      undoRemove: () => {
        set((state) => {
          if (!state.lastRemovedItems || state.lastRemovedItems.length === 0) return state

          const itemsToRestore = state.lastRemovedItems
          const restoredTotalPrice = itemsToRestore.reduce((sum, item) => sum + (item.price * item.quantity), 0)

          return {
            items: [...state.items, ...itemsToRestore],
            totalPrice: state.totalPrice + restoredTotalPrice,
            lastRemovedItems: null,
          }
        })
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find(i => i.id === id)
          if (!item) return state

          const oldTotal = item.price * item.quantity
          const newTotal = item.price * quantity
          
          return {
            items: state.items.map(i => 
              i.id === id ? { ...i, quantity } : i
            ),
            totalPrice: state.totalPrice - oldTotal + newTotal,
            lastRemovedItems: null,
          }
        })
      },

      toggleItemSelection: (id) => {
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter(itemId => itemId !== id)
            : [...state.selectedItems, id]
        }))
      },

      selectAllItems: (select) => {
        set((state) => ({
          selectedItems: select ? state.items.map(item => item.id) : []
        }))
      },

      clearCart: () => {
        set((state) => ({
          items: [],
          selectedItems: [],
          totalPrice: 0,
          lastRemovedItems: state.items,
        }))
      },

      getSelectedTotalPrice: () => {
        const state = get()
        return state.items
          .filter(item => state.selectedItems.includes(item.id))
          .reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getItemCount: () => {
        return get().items.length
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