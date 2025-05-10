import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-hot-toast'
import { 
    FavoriteDto, 
    getUserFavorites,
    addUserFavorite,
    removeUserFavorite,
    // Varsayımsal API servisleri (gerçek isimler farklı olabilir)
    // createNewFavoriteList as apiCreateNewFavoriteList,
    // addProductToFavoriteList as apiAddProductToFavoriteList
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

// Liste yönetimi için FavoriteList interface'ini aktif hale getiriyoruz
export interface FavoriteList {
  id: number; // Benzersiz liste ID'si (backend'den veya frontend'de üretilebilir)
  name: string;
  isPrivate: boolean; // Listenin gizli olup olmadığını belirtir
  productIds: number[]; // Bu listedeki ürünlerin ID'leri
  // createdAt?: Date; // Opsiyonel: oluşturulma tarihi
}

interface FavoritesState {
  products: FavoriteProduct[]
  selectedProductIds: Set<number> // Seçili ürün ID'lerini tutmak için Set
  lists: FavoriteList[] // Aktif hale getirildi
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
    // Yeni liste ve ürün taşıma eylemleri
    createListAndAddProduct: (productId: number, listName: string, isPrivate: boolean) => Promise<void>
    // addProductToExistingList: (productId: number, listId: number) => Promise<void> // İleride eklenebilir
  }
}

// Initial state
const initialState: Omit<FavoritesState, 'actions'> = {
  products: [],
  selectedProductIds: new Set(), // Başlangıçta boş Set
  lists: [], // Başlangıçta boş liste dizisi
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
      set({ isLoading: true, error: null, selectedProductIds: new Set() })
      try {
        const favoritesDto = await getUserFavorites() // Bu sadece ana favori listesini getiriyor olabilir
        // TODO: Eğer backend listeleri de destekliyorsa, listeler için ayrı bir API çağrısı gerekebilir.
        // Şimdilik listeleri boş başlatıyoruz veya dummy data ile doldurabiliriz.
        get().actions._setFavoriteProducts(favoritesDto)
        // set({ lists: [] }); // Veya dummy listeler: set({ lists: [{id: 1, name: "My Wishlist", productIds: favoritesDto.map(p=>p.productId), isPrivate: false}] });
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
      if (get().products.some(p => p.productId === productId && p.listId === undefined)) { // Ana favori listesinde kontrol
        toast.error("Product is already in main favorites.");
        return;
      }
      set({ isLoading: true, error: null })
      try {
        const addedFavoriteDto = await addUserFavorite(productId) // Bu API sadece ana favorilere ekliyor olabilir
        if (addedFavoriteDto) {
          const newFavorite: FavoriteProduct = {
            ...addedFavoriteDto,
            id: addedFavoriteDto.productId,
            name: addedFavoriteDto.productName || 'Unnamed Product',
            supplierName: addedFavoriteDto.supplierName,
            inStock: addedFavoriteDto.inStock,
            imageUrl: addedFavoriteDto.imageUrl,
            listId: undefined // Ana favoriler listesine eklendiğini belirtir
          }
          set(state => {
            const updatedProducts = [...state.products, newFavorite]
            const sorted = state.actions.sortProductsInternal(updatedProducts, state.sortType)
            return { products: sorted, error: null }
          })
           toast.success(`${newFavorite.name} added to main favorites!`)
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
        // Eğer ürün bir listeye aitse, backend'de o listeden silme API'ı çağrılmalı.
        // Şimdilik sadece genel favorilerden silme varsayılıyor.
        await removeUserFavorite(productId) 
        set(state => ({
          products: state.products.filter(p => p.productId !== productId),
          selectedProductIds: new Set([...state.selectedProductIds].filter(id => id !== productId)),
          lists: state.lists.map(list => ({ // Ürünü tüm listelerden de kaldır
            ...list,
            productIds: list.productIds.filter(id => id !== productId)
          })),
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
      set({ isLoading: true, error: null });
      // Bu eylem seçili ürünleri hem ana favorilerden hem de ait oldukları listelerden (eğer varsa) silmeli.
      // Backend'de bu işlemlerin nasıl yapılacağına bağlı.
      // Şimdilik sadece ana favorilerden silme mantığını basitleştirilmiş olarak tutuyoruz.
      const productIdsToRemove = Array.from(selectedProductIds);
      try {
        await Promise.all(productIdsToRemove.map(id => removeUserFavorite(id)));
        set(state => ({
          products: state.products.filter(p => !productIdsToRemove.includes(p.productId)),
          selectedProductIds: new Set(),
          lists: state.lists.map(list => ({
            ...list,
            productIds: list.productIds.filter(id => !productIdsToRemove.includes(id))
          })),
          error: null,
        }));
        toast.success(`${productIdsToRemove.length} product(s) removed.`)
      } catch (error: any) {
        console.error('Error removing selected favorites:', error)
        toast.error('Failed to remove some selected products.')
        set({ error: 'Failed to remove some products.' })
      } finally {
        set({ isLoading: false });
      }
    },

    // Yeni liste oluşturma ve ürünü o listeye ekleme eylemi
    createListAndAddProduct: async (productId, listName, isPrivate) => {
      set({ isLoading: true, error: null });
      try {
        // Varsayımsal: Backend'de yeni liste oluşturma API'ı
        // const newListFromApi = await apiCreateNewFavoriteList({ name: listName, isPrivate: isPrivate });
        // const newListId = newListFromApi.id;
        
        // Şimdilik frontend'de yeni liste oluşturuyoruz (ID üretimi basitçe)
        const newListId = Date.now(); // Basit ID üretimi, backend entegrasyonunda değişmeli
        const newList: FavoriteList = {
          id: newListId,
          name: listName,
          isPrivate: isPrivate,
          productIds: [productId],
        };

        // Varsayımsal: Ürünü backend'de bu yeni listeye ekleme API'ı
        // await apiAddProductToFavoriteList(productId, newListId);

        // Ana favoriler listesinden ürünü kaldır (eğer oradaysa ve listeye özel olacaksa)
        // Ya da ürünü hem ana favorilerde tutup hem de listeye ekleyebiliriz. Tasarıma bağlı.
        // Şimdilik, ürünü ana favorilerden kaldırmadan listeye ekliyoruz.
        // Eğer ürün sadece bir listede olacaksa, aşağıdaki gibi bir filtreleme gerekebilir:
        // const productOriginal = get().products.find(p => p.productId === productId);
        // if (productOriginal && productOriginal.listId === undefined) { /* ana favorilerden kaldır */ }

        set(state => ({
          lists: [...state.lists, newList],
          // Eğer ürün artık sadece bu listede olacaksa ve ana `products` dizisinden de etkilenecekse:
          // products: state.products.map(p => 
          //   p.productId === productId ? { ...p, listId: newListId } : p
          // ),
          isLoading: false,
        }));
        toast.success(`Product added to new list: ${listName}`);
      } catch (error: any) {
        console.error('Error creating list and adding product:', error);
        toast.error('Failed to create list or add product.');
        set({ error: 'Failed to create list or add product.', isLoading: false });
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
        inStock: dto.inStock,
        listId:  undefined // Backend DTO'sunda listId varsa maplenir
      }))
      const sorted = get().actions.sortProductsInternal(mappedProducts, get().sortType)
      set({ products: sorted, error: null, isLoading: false })
    },

    _clearLocalState: () => {
      set({...initialState, lists: [], isFavorite: () => false, selectedProductIds: new Set() })
    },
  }
}))

// Opsiyonel: Action'ları direkt kullanmak için
export const useFavoritesActions = () => useFavoritesStore((state) => state.actions) 