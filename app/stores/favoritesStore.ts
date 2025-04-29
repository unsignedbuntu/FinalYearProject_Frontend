import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Export FavoriteProduct interface
export interface FavoriteProduct {
  id: number // Bu alan ürünün GERÇEK veritabanı productID'si OLMALI
  name: string
  price: number
  date: Date
  image: string
  inStock: boolean
  selected: boolean // Bu, Edit sayfasındaki seçim için kullanılır
  listId?: number
}

interface FavoriteList {
  id: number
  name: string
  products: number[] // product ids
}

interface FavoritesState {
  products: FavoriteProduct[]
  lists: FavoriteList[]
  sortType: string
  showInStock: boolean
  selectedCount: number
  isAllSelected: boolean
  selectedProducts: number[]
  selectedLists: number[]
  
  // Product operations
  addProduct: (product: FavoriteProduct) => void
  removeProduct: (id: number) => void
  toggleProductSelection: (id: number) => void
  selectAllProducts: (select: boolean) => void
  moveProductsToList: (productIds: number[], listId: number | null) => void
  
  // List operations
  addList: (name: string) => void
  removeList: (id: number) => void
  renameList: (id: number, name: string) => void
  toggleListSelection: (id: number) => void
  selectAllLists: (select: boolean) => void
  getProductsByList: (listId: number | null) => FavoriteProduct[]
  isFavorite: (productId: number) => boolean
  
  // Sorting and filtering
  setSortType: (type: string) => void
  setShowInStock: (show: boolean) => void
  sortProducts: (type: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      products: [],
      lists: [],
      sortType: 'default',
      showInStock: true,
      selectedCount: 0,
      isAllSelected: false,
      selectedProducts: [],
      selectedLists: [],

      // Product operations
      addProduct: (product) => {
        // Gelen product nesnesinin id alanının ZATEN doğru productID olduğunu varsayıyoruz.
        // Yeni bir ID üretmiyoruz!
        // Eğer aynı ID varsa ekleme (veya güncelleme - şimdilik eklemeyelim tekrarı önle)
        if (get().products.some(p => p.id === product.id)) {
          console.warn(`FavoritesStore: Product with ID ${product.id} already exists.`);
          return; // Zaten varsa tekrar ekleme
        }
        set((state) => ({
          // product nesnesini doğrudan ekle, selected=false yap
          products: [...state.products, { ...product, selected: false }], 
        }));
      },

      removeProduct: (id) => { // Buradaki id, productID olmalı
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          // selectedProducts productId değil, store'un kendi unique ID'sini tutuyorsa güncellenmeli,
          // ama seçimi product'ın kendi `selected` alanı ile yapıyoruz, 
          // bu yüzden selectedProducts array'ine gerek kalmayabilir.
          // Şimdilik selectedProducts/selectedCount/isAllSelected mantığını basitleştirelim.
          selectedCount: state.products.filter(p => p.id !== id && p.selected).length,
          isAllSelected: state.products.length > 1 && state.products.filter(p => p.id !== id).every(p => p.selected)
        }));
      },

      toggleProductSelection: (id) => { // Buradaki id, productID olmalı
        set((state) => {
          const updatedProducts = state.products.map(p => 
            p.id === id ? { ...p, selected: !p.selected } : p
          );
          const newSelectedCount = updatedProducts.filter(p => p.selected).length;
          return {
            products: updatedProducts,
            selectedCount: newSelectedCount,
            isAllSelected: newSelectedCount === updatedProducts.length && updatedProducts.length > 0
          };
        });
      },

      selectAllProducts: (select) => {
        set((state) => ({
          products: state.products.map(p => ({ ...p, selected: select })),
          selectedCount: select ? state.products.length : 0,
          isAllSelected: select && state.products.length > 0
        }));
      },

      moveProductsToList: (productIds, listId) => {
        set((state) => ({
          products: state.products.map(p => 
            productIds.includes(p.id) ? { ...p, listId: listId === null ? undefined : listId } : p
          )
        }))
      },

      // List operations
      addList: (name) => {
        const id = Date.now()
        set((state) => ({
          lists: [...state.lists, { id, name, products: [] }]
        }))
      },

      removeList: (id) => {
        set((state) => ({
          lists: state.lists.filter(l => l.id !== id),
          products: state.products.map(p => 
            p.listId === id ? { ...p, listId: undefined } : p
          )
        }))
      },

      renameList: (id, newName) => {
        set((state) => ({
          lists: state.lists.map(l => 
            l.id === id ? { ...l, name: newName } : l
          )
        }))
      },

      toggleListSelection: (id) => {
        set((state) => ({
          selectedLists: state.selectedLists.includes(id) ? state.selectedLists.filter(i => i !== id) : [...state.selectedLists, id],
          isAllSelected: state.selectedLists.length + 1 === state.lists.length
        }))
      },

      selectAllLists: (select) => {
        set((state) => ({
          selectedLists: select ? state.lists.map(l => l.id) : [],
          isAllSelected: select
        }))
      },

      getProductsByList: (listId) => {
        return get().products.filter(p => p.listId === listId)
      },

      // Sorting and filtering
      setSortType: (type) => set({ sortType: type }),
      
      setShowInStock: (show) => set({ showInStock: show }),
      
      sortProducts: (type) => {
        set((state) => {
          const sorted = [...state.products]
          switch (type) {
            case 'price-high':
              sorted.sort((a, b) => b.price - a.price)
              break
            case 'price-low':
              sorted.sort((a, b) => a.price - b.price)
              break
            case 'oldest':
              sorted.sort((a, b) => a.date.getTime() - b.date.getTime())
              break
            case 'newest':
              sorted.sort((a, b) => b.date.getTime() - a.date.getTime())
              break
            case 'name-asc':
              sorted.sort((a, b) => a.name.localeCompare(b.name))
              break
            case 'name-desc':
              sorted.sort((a, b) => b.name.localeCompare(a.name))
              break
          }
          return { products: sorted }
        })
      },

      isFavorite: (productId) => {
        // Bu fonksiyon doğru, productId (gerçek ID) kontrol ediyor
        return get().products.some(p => p.id === productId);
      },
    }),
    {
      name: 'favorites-storage',
      // State'in hangi kısımlarının localStorage'a yazılacağını belirle
      // Büyük görselleri (eğer varsa) veya hesaplanan değerleri dışarıda bırak
      partialize: (state) => ({
        products: state.products.map(p => ({ // Belki görselleri burada çıkarabiliriz?
            ...p,
            image: p.image.startsWith('data:') ? '/placeholder.png' : p.image // VEYA sadece ID'leri sakla
        })),
        lists: state.lists,
        sortType: state.sortType,
        showInStock: state.showInStock,
        // selectedCount, isAllSelected gibi hesaplanan değerleri persist etme
      }),
    }
  )
) 