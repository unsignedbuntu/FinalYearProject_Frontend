import { create } from 'zustand'

interface UIState {
  isStoresMegaMenuOpen: boolean
  openStoresMegaMenu: () => void
  closeStoresMegaMenu: () => void
  toggleStoresMegaMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isStoresMegaMenuOpen: false,
  openStoresMegaMenu: () => set({ isStoresMegaMenuOpen: true }),
  closeStoresMegaMenu: () => set({ isStoresMegaMenuOpen: false }),
  toggleStoresMegaMenu: () => set((state) => ({ isStoresMegaMenuOpen: !state.isStoresMegaMenuOpen })),
})) 