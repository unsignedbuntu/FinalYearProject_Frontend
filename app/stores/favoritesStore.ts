import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { toast, Toast } from 'react-hot-toast'
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
  isLoadingLists: boolean
  error: string | null
  isFavorite: (productId: number, listId?: number) => boolean
  actions: {
    initializeFavoritesAndLists: () => Promise<void>
    addProductToMainFavorites: (productId: number) => Promise<void>
    removeProductFromMainFavorites: (productId: number) => Promise<void>
    createFavoriteList: (listName: string, isPrivate: boolean) => Promise<FavoriteList | null>
    addProductToExistingList: (productId: number, listId: number) => Promise<void>
    removeProductFromList: (productId: number, listId: number) => Promise<void>
    removeSelectedProducts: () => Promise<void>
    setSortType: (type: string) => void
    setShowInStock: (show: boolean) => void
    sortProducts: (type?: string) => void
    _setFavoriteProducts: (products: FavoriteDto[]) => void
    _clearLocalState: () => void
    sortProductsInternal: (productsToSort: FavoriteProduct[], sortType: string) => FavoriteProduct[]
    toggleProductSelection: (productId: number) => void
    selectAllProducts: (select: boolean) => void
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
  isLoadingLists: false,
  error: null,
  isFavorite: () => false, // Bu create içinde override edilecek
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ...initialState,
  isFavorite: (productId, listId) => {
    if (listId === undefined) {
      return get().products.some(p => p.productId === productId && p.listId === undefined);
    }
    const list = get().lists.find(l => l.id === listId);
    return list ? list.productIds.includes(productId) : false;
  },
  actions: {
    initializeFavoritesAndLists: async () => {
      set({ isLoading: true, isLoadingLists: true, error: null, selectedProductIds: new Set() });
      try {
        const favoritesDto = await getUserFavorites();
        const listsFromApi: FavoriteList[] = []; // TODO: API'den çekilecek

        get().actions._setFavoriteProducts(favoritesDto);
        set({ lists: listsFromApi, isLoading: false, isLoadingLists: false });
        console.log('Favorites and lists loaded successfully.');
      } catch (error: any) {
        console.error('Error loading favorites/lists:', error);
        const message = error.response?.data?.message || 'Failed to load favorites data.';
        set({ error: message, isLoading: false, isLoadingLists: false });
        toast.error(message);
      }
    },

    addProductToMainFavorites: async (productId) => {
      if (get().products.some(p => p.productId === productId && p.listId === undefined)) {
        toast.error("Product is already in main favorites.");
        return;
      }
      set({ isLoading: true, error: null });
      try {
        const addedFavoriteDto = await addUserFavorite(productId);
        if (addedFavoriteDto) {
          const newFavorite: FavoriteProduct = {
            ...addedFavoriteDto,
            id: addedFavoriteDto.productId,
            name: addedFavoriteDto.productName || 'Unnamed Product',
            supplierName: addedFavoriteDto.supplierName,
            price: addedFavoriteDto.price,
            imageUrl: addedFavoriteDto.imageUrl,
            inStock: addedFavoriteDto.inStock,
            addedDate: addedFavoriteDto.addedDate,
            listId: undefined
          };
          set(state => {
            const updatedProducts = [...state.products, newFavorite];
            const sorted = state.actions.sortProductsInternal(updatedProducts, state.sortType);
            return { products: sorted, error: null, isLoading: false };
          });
           toast.success(`${newFavorite.name} added to main favorites!`);
        } else {
          throw new Error('Failed to get response from backend when adding favorite.');
        }
      } catch (error: any) {
        console.error('Error adding to main favorites:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to main favorites.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },

    removeProductFromMainFavorites: async (productId) => {
      const productToRemove = get().products.find(p => p.productId === productId && p.listId === undefined);
      if (!productToRemove) {
        toast("Product not found in main favorites.");
        return;
      }
      set({ isLoading: true, error: null });
      try {
        await removeUserFavorite(productId);
        set(state => ({
          products: state.products.filter(p => p.productId !== productId),
          selectedProductIds: new Set([...state.selectedProductIds].filter(id => id !== productId)),
          error: null,
          isLoading: false
        }));
        toast.success(`${productToRemove.name || 'Product'} removed from main favorites.`);
      } catch (error: any) {
        console.error('Error removing from main favorites:', error);
        const errorMessage = error.response?.data?.message || 'Failed to remove product from main favorites.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },

    createFavoriteList: async (listName, isPrivate) => {
      set({ isLoadingLists: true, error: null });
      try {
        const newList: FavoriteList = {
          id: Date.now(),
          name: listName,
          isPrivate: isPrivate,
          productIds: [],
        };
        set(state => ({
          lists: [...state.lists, newList],
          isLoadingLists: false,
        }));
        toast.success(`List "${listName}" created.`);
        return newList;
      } catch (error: any) {
        console.error('Error creating favorite list:', error);
        const errorMessage = error.response?.data?.message || 'Failed to create list.';
        set({ error: errorMessage, isLoadingLists: false });
        toast.error(errorMessage);
        return null;
      }
    },

    addProductToExistingList: async (productId, listId) => {
      set({ isLoading: true, error: null });
      try {
        const targetList = get().lists.find(list => list.id === listId);
        const productDetails = get().products.find(p => p.productId === productId);

        if (!targetList) throw new Error(`List with ID ${listId} not found.`);

        set(state => {
          const updatedLists = state.lists.map(list => {
            if (list.id === listId) {
              if (!list.productIds.includes(productId)) {
                return { ...list, productIds: [...list.productIds, productId] };
              }
            }
            return list;
          });

          return {
            lists: updatedLists,
            isLoading: false,
          };
        });
        toast.success(`${productDetails?.name || 'Product'} added to list: ${targetList.name}`);
      } catch (error: any) {
        console.error('Error adding product to existing list:', error);
        const errorMessage = error.message || 'Failed to add product to list.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },

    removeProductFromList: async (productId, listId) => {
      set({ isLoadingLists: true, error: null });
      try {
        const targetList = get().lists.find(list => list.id === listId);
        if (!targetList) throw new Error(`List with ID ${listId} not found.`);

        set(state => ({
          lists: state.lists.map(list =>
            list.id === listId
              ? { ...list, productIds: list.productIds.filter(id => id !== productId) }
              : list
          ),
          isLoadingLists: false,
        }));
        toast.success(`Product removed from list: ${targetList.name}`);
      } catch (error: any) {
        console.error('Error removing product from list:', error);
        const errorMessage = error.message || 'Failed to remove product from list.';
        set({ error: errorMessage, isLoadingLists: false });
        toast.error(errorMessage);
      }
    },

    removeSelectedProducts: async () => {
      const { selectedProductIds } = get();
      if (selectedProductIds.size === 0) {
        toast.error("No products selected to remove.");
        return;
      }
      set({ isLoading: true, error: null });
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
          isLoading: false
        }));
        toast.success(`${productIdsToRemove.length} product(s) removed.`);
      } catch (error: any) {
        console.error('Error removing selected favorites:', error);
        toast.error('Failed to remove some selected products.');
        set({ error: 'Failed to remove some products.', isLoading: false });
      }
    },
    
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
          default:
            const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
            const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
            if (sortType === 'date-asc') {
                 return dateA - dateB;
            }
            return (dateB - dateA) || ((b.productId ?? 0) - (a.productId ?? 0));
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
        inStock: dto.inStock,      
      }));
      const sorted = get().actions.sortProductsInternal(mappedProducts, get().sortType);
      set({ products: sorted, error: null, isLoading: false }); 
    },

    _clearLocalState: () => {
      set({...initialState, lists: [], selectedProductIds: new Set(), isFavorite: () => false });
    },
    setSortType: (type) => {
      set({ sortType: type });
      get().actions.sortProducts(type);
    },

    setShowInStock: (show) => {
      set({ showInStock: show });
    },

    sortProducts: (type) => {
      const sortType = type || get().sortType;
      set(state => ({
        products: get().actions.sortProductsInternal(state.products, sortType)
      }));
    },
    
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
  }
}))

// Opsiyonel: Action'ları direkt kullanmak için
export const useFavoritesActions = () => useFavoritesStore((state) => state.actions) 