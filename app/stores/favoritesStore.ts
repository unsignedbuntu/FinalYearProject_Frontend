import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-hot-toast'
import { 
    FavoriteDto, 
    getUserFavorites,
    addUserFavorite,
    removeUserFavorite
} from '@/services/API_Service'

// Frontend'de kullanılan FavoriteProduct yapısı (API DTO'suna göre güncellendi)
export interface FavoriteProduct extends FavoriteDto {
    id: number // productId ile aynı
    date?: Date // Backend DTO'sunda varsa (veya frontend'de tutulacaksa)
    inStock?: boolean // Backend DTO'sunda varsa
    selected?: boolean // UI state'i için (artık selectedProductIds kullanılacak, bu opsiyonel)
    listId?: number | undefined // Liste yönetimi için (şimdilik kullanılmıyor varsayalım)
    // image?: string // Artık imageUrl kullanılacak
    name: string // productName yerine name kullanılıyorsa
    supplierName?: string // supplierName eklendi (opsiyonel)
}

/* // Liste yönetimi sonraya bırakıldı
interface FavoriteList {
  id: number
  name: string
  products: number[] // product ids
}
*/

interface FavoritesState {
  products: FavoriteProduct[]
  selectedProductIds: Set<number> // Seçili ürün ID'lerini tutmak için Set
  // lists: FavoriteList[]
  sortType: string
  showInStock: boolean
  isLoading: boolean
  error: string | null
  isFavorite: (productId: number) => boolean
  actions: {
    initializeFavorites: () => Promise<void>
    addProduct: (productId: number) => Promise<void>
    removeProduct: (productId: number) => Promise<void> // Tekil silme
    setSortType: (type: string) => void
    setShowInStock: (show: boolean) => void
    sortProducts: (type?: string) => void
    _setFavoriteProducts: (products: FavoriteDto[]) => void
    _clearLocalState: () => void
    sortProductsInternal: (productsToSort: FavoriteProduct[], sortType: string) => FavoriteProduct[]
    // Seçim Action'ları
    toggleProductSelection: (productId: number) => void
    selectAllProducts: (select: boolean) => void
    removeSelectedProducts: () => Promise<void> // Seçili olanları silme
  }
}

// Initial state
const initialState: Omit<FavoritesState, 'actions'> = {
  products: [],
  selectedProductIds: new Set(), // Başlangıçta boş Set
  // lists: [],
  sortType: 'date-desc', // Varsayılan sıralama
  showInStock: true, // Varsayılan filtre
  isLoading: false,
  error: null,
  isFavorite: () => false, // Bu create içinde override edilecek
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ...initialState,
  isFavorite: (productId) => get().products.some(p => p.productId === productId),
  actions: {
    // --- API Tabanlı Action'lar ---
    initializeFavorites: async () => {
      set({ isLoading: true, error: null, selectedProductIds: new Set() }) // Seçimi de sıfırla
      try {
        const favoritesDto = await getUserFavorites()
        get().actions._setFavoriteProducts(favoritesDto)
        console.log('Favorites loaded successfully.')
      } catch (error: any) {
        console.error('Error loading favorites:', error)
        const message = error.response?.data?.message || 'Failed to load favorites.'
        set({ error: message, isLoading: false })
        toast.error(message)
      } finally {
        set({ isLoading: false })
      }
    },

    addProduct: async (productId) => {
      if (get().products.some(p => p.productId === productId)) {
        toast.error("Product is already in favorites.");
        return;
      }
      set({ isLoading: true, error: null })
      try {
        const addedFavoriteDto = await addUserFavorite(productId)
        if (addedFavoriteDto) {
          const newFavorite: FavoriteProduct = {
            ...addedFavoriteDto,
            id: addedFavoriteDto.productId,
            name: addedFavoriteDto.productName || 'Unnamed Product',
            // selected: false, // Artık state'de tutulmuyor
            supplierName: addedFavoriteDto.supplierName,
            inStock: addedFavoriteDto.inStock,
            imageUrl: addedFavoriteDto.imageUrl // imageUrl ekle
          }
          set(state => {
            const updatedProducts = [...state.products, newFavorite]
            const sorted = state.actions.sortProductsInternal(updatedProducts, state.sortType)
            return { products: sorted, error: null }
          })
           toast.success(`${newFavorite.name} added to favorites!`)
        } else {
          throw new Error('Failed to get response from backend when adding favorite.')
        }
      } catch (error: any) {
        console.error('Error adding to favorites:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to favorites.'
        set({ error: errorMessage })
        toast.error(errorMessage)
      } finally {
        set({ isLoading: false })
      }
    },

    // Tek bir ürünü ID ile siler
    removeProduct: async (productId) => {
      const productToRemove = get().products.find(p => p.productId === productId)
      if (!productToRemove) return;

      set({ isLoading: true, error: null })
      try {
        await removeUserFavorite(productId)
        set(state => ({
          products: state.products.filter(p => p.productId !== productId),
          selectedProductIds: new Set([...state.selectedProductIds].filter(id => id !== productId)), // Seçimden de kaldır
          error: null
        }))
        toast.success(`${productToRemove.name || 'Product'} removed from favorites.`)
      } catch (error: any) {
        console.error('Error removing from favorites:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to remove product from favorites.'
        set({ error: errorMessage })
        toast.error(errorMessage)
      } finally {
        set({ isLoading: false })
      }
    },

    // --- UI Action'ları ---
    setSortType: (type) => {
      set({ sortType: type })
      get().actions.sortProducts(type)
    },

    setShowInStock: (show) => {
      set({ showInStock: show })
    },

    sortProducts: (type) => {
      const sortType = type || get().sortType
      set(state => ({
        products: get().actions.sortProductsInternal(state.products, sortType)
      }))
    },

    // --- Seçim Action'ları ---
    toggleProductSelection: (productId) => {
      set(state => {
        const newSelectedIds = new Set(state.selectedProductIds);
        if (newSelectedIds.has(productId)) {
          newSelectedIds.delete(productId);
        } else {
          newSelectedIds.add(productId);
        }
        return { selectedProductIds: newSelectedIds };
      });
    },

    selectAllProducts: (select) => {
      set(state => {
        if (select) {
          const allProductIds = new Set(state.products.map(p => p.productId));
          return { selectedProductIds: allProductIds };
        } else {
          return { selectedProductIds: new Set() };
        }
      });
    },

    // Seçili ürünleri siler
    removeSelectedProducts: async () => {
      const { selectedProductIds, products } = get();
      if (selectedProductIds.size === 0) {
        toast.error("No products selected to remove.");
        return;
      }

      const productsToRemove = products.filter(p => selectedProductIds.has(p.productId));
      const productIdsToRemove = Array.from(selectedProductIds);

      set({ isLoading: true, error: null });
      let successCount = 0;
      let errorOccurred = false;

      try {
        // Tüm silme isteklerini paralel olarak gönder
        await Promise.all(productIdsToRemove.map(async (id) => {
          try {
            await removeUserFavorite(id);
            successCount++;
          } catch (err) {
            console.error(`Failed to remove favorite product ID: ${id}`, err);
            errorOccurred = true; // Herhangi bir hata olursa işaretle
            // Hata mesajını burada göstermek yerine toplu gösterebiliriz
          }
        }));

        // State'i güncelle
        set(state => ({
          products: state.products.filter(p => !state.selectedProductIds.has(p.productId)),
          selectedProductIds: new Set(), // Seçimi temizle
          error: errorOccurred ? "Some products could not be removed." : null,
        }));

        if (successCount > 0) {
          toast.success(`${successCount} product(s) removed from favorites.`);
        }
        if (errorOccurred) {
           toast.error("Failed to remove some selected products. Please check the console.");
        }

      } catch (error) { // Promise.all dışında beklenmedik bir hata olursa
        console.error("Unexpected error during bulk removal:", error);
        set({ error: "An unexpected error occurred while removing products.", isLoading: false });
        toast.error("An unexpected error occurred.");
      } finally {
        set({ isLoading: false });
      }
    },

    // --- Helper Action'lar ---
    sortProductsInternal: (productsToSort: FavoriteProduct[], sortType: string): FavoriteProduct[] => {
      const sorted = [...productsToSort];
      sorted.sort((a, b) => {
        switch (sortType) {
          case 'price-asc':
            return (a.price ?? 0) - (b.price ?? 0);
          case 'price-desc':
            return (b.price ?? 0) - (a.price ?? 0);
          case 'name-asc':
            return (a.name ?? '').localeCompare(b.name ?? '');
          case 'name-desc':
            return (b.name ?? '').localeCompare(a.name ?? '');
          // case 'date-asc': // Assuming id is used for date sorting if date is not available
          //   return (a.id ?? 0) - (b.id ?? 0);
          // case 'date-desc':
          default: // Default to descending ID (likely newest first)
            return (b.id ?? 0) - (a.id ?? 0);
        }
      });
      return sorted;
    },

    _setFavoriteProducts: (productsDto: FavoriteDto[]) => {
      const mappedProducts: FavoriteProduct[] = productsDto.map(dto => ({
        ...dto,
        id: dto.productId,
        name: dto.productName || 'Unnamed Product',
        supplierName: dto.supplierName,
        imageUrl: dto.imageUrl,
        inStock: dto.inStock
        // selected property artık burada atanmıyor
      }))
      const sorted = get().actions.sortProductsInternal(mappedProducts, get().sortType)
      set({ products: sorted, error: null, isLoading: false })
    },

    _clearLocalState: () => {
      set({...initialState, isFavorite: () => false, selectedProductIds: new Set() })
    },
  }
}))

// Opsiyonel: Action'ları direkt kullanmak için
export const useFavoritesActions = () => useFavoritesStore((state) => state.actions) 