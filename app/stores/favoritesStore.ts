import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { 
    FavoriteDto as ApiFavoriteDto,
    getUserFavorites as apiGetUserFavorites,
    addUserFavorite as apiAddUserFavorite,
    removeUserFavorite as apiRemoveUserFavorite,
    FavoriteListDto as ApiFavoriteListDto,
    getUserFavoriteLists as apiGetUserFavoriteLists,
    CreateFavoriteListRequestDto,
    createFavoriteList as apiCreateFavoriteList,
    deleteFavoriteList as apiDeleteFavoriteList,
    addProductToFavoriteList as apiAddProductToFavoriteList,
    removeProductFromFavoriteList as apiRemoveProductFromFavoriteList,
    ApiFavoriteListItemDto,
    getFavoriteListItems as apiGetFavoriteListItems
} from '@/services/API_Service'

export interface FavoriteProduct {
    id: number;
    ProductId: number;
    ProductName?: string;
    Price: number;
    ImageUrl?: string;
    AddedDate: string;
    name: string;
    date?: Date;
    inStock?: boolean;
    selected?: boolean;
    listId?: number | undefined;
}

export interface FavoriteList {
  id: number;
  name: string;
  isPrivate: boolean;
  productIds: number[];
}

interface FavoritesState {
  products: FavoriteProduct[]
  selectedProductIds: Set<number>
  lists: FavoriteList[]
  sortType: string
  showInStock: boolean
  isLoading: boolean
  isLoadingLists: boolean
  error: string | null
  currentListProducts: FavoriteProduct[]
  isLoadingCurrentListProducts: boolean
  isFavorite: (productId: number, listId?: number) => boolean
  actions: {
    initializeFavoritesAndLists: (userId: number) => Promise<void>
    addProductToMainFavorites: (productId: number) => Promise<void>
    removeProductFromMainFavorites: (productId: number) => Promise<void>
    createFavoriteList: (userId: number, listName: string, isPrivate: boolean) => Promise<FavoriteList | null>
    addProductToExistingList: (productId: number, listId: number) => Promise<void>
    removeProductFromList: (productId: number, listId: number) => Promise<void>
    deleteFavoriteListAction: (listId: number) => Promise<void>
    fetchProductsForList: (listId: number) => Promise<void>
    removeSelectedProducts: () => Promise<void>
    setSortType: (type: string) => void
    setShowInStock: (show: boolean) => void
    sortProducts: (type?: string) => void
    _setFavoriteProducts: (apiProducts: ApiFavoriteDto[]) => void
    _setFavoriteLists: (apiLists: ApiFavoriteListDto[]) => void
    _clearLocalState: () => void
    sortProductsInternal: (productsToSort: FavoriteProduct[], sortType: string) => FavoriteProduct[]
    toggleProductSelection: (productId: number) => void
    selectAllProducts: (select: boolean) => void
  }
}

const initialState: Omit<FavoritesState, 'actions'> = {
  products: [],
  selectedProductIds: new Set(),
  lists: [],
  sortType: 'date-desc',
  showInStock: true,
  isLoading: false,
  isLoadingLists: false,
  error: null,
  currentListProducts: [],
  isLoadingCurrentListProducts: false,
  isFavorite: () => false,
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ...initialState,
  isFavorite: (productId, listId) => {
    if (listId === undefined) {
      return get().products.some(p => p.ProductId === productId && p.listId === undefined);
    }
    const list = get().lists.find(l => l.id === listId);
    return list ? list.productIds.includes(productId) : false;
  },
  actions: {
    initializeFavoritesAndLists: async (userId: number) => {
      set({ isLoading: true, isLoadingLists: true, error: null, selectedProductIds: new Set() });
      try {
        const [favoritesDtoArray, listsDtoArray] = await Promise.all([
          apiGetUserFavorites(),
          apiGetUserFavoriteLists(userId)
        ]);
        
        get().actions._setFavoriteProducts(favoritesDtoArray);
        get().actions._setFavoriteLists(listsDtoArray);
        set({ isLoading: false, isLoadingLists: false });
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to load favorites or lists data.';
        set({ error: message, isLoading: false, isLoadingLists: false });
        toast.error(message);
      }
    },

    addProductToMainFavorites: async (productId) => {
      if (get().products.some(p => p.ProductId === productId && p.listId === undefined)) {
        toast.error("Product is already in main favorites.");
        return;
      }
      set({ isLoading: true, error: null });
      try {
        const addedFavoriteDto = await apiAddUserFavorite(productId);
        if (addedFavoriteDto) {
          const newFavorite: FavoriteProduct = {
            id: addedFavoriteDto.ProductId,
            ProductId: addedFavoriteDto.ProductId,
            ProductName: addedFavoriteDto.ProductName,
            Price: addedFavoriteDto.Price,
            ImageUrl: addedFavoriteDto.ImageUrl,
            AddedDate: addedFavoriteDto.AddedDate,
            name: addedFavoriteDto.ProductName || 'Unnamed Product',
            inStock: addedFavoriteDto.InStock,
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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to main favorites.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },

    removeProductFromMainFavorites: async (productId) => {
      console.log("[removeProductFromMainFavorites] Attempting to remove productId:", productId, "Type:", typeof productId);
      const productToRemove = get().products.find(p => p.ProductId === productId && p.listId === undefined);
      if (!productToRemove) {
        toast.error("Product not found in main favorites.");
        return;
      }
      set({ isLoading: true, error: null });
      try {
        await apiRemoveUserFavorite(productId);
        set(state => ({
          products: state.products.filter(p => p.ProductId !== productId),
          selectedProductIds: new Set([...state.selectedProductIds].filter(id => id !== productId)),
          error: null,
          isLoading: false
        }));
        toast.success(`${productToRemove.name} removed from main favorites.`);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to remove product from main favorites.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },


    addProductToExistingList: async (productId, listId) => {
      set({ isLoading: true, error: null }); 
      try {
        const targetList = get().lists.find(list => list.id === listId);
        const productDetails = get().products.find(p => p.ProductId === productId);

        if (!targetList) throw new Error(`List with ID ${listId} not found.`);
        if (!productDetails) throw new Error(`Product with ID ${productId} not found in favorites.`);

        set(state => {
          const updatedLists = state.lists.map(list => {
            if (list.id === listId) {
              if (!list.productIds.includes(productId)) { 
                return { ...list, productIds: [...list.productIds, productId] };
              }
            }
            return list;
          });
          return { lists: updatedLists, isLoading: false }; 
        });
        toast.success(`${productDetails.name} added to list: ${targetList.name}`);
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to add product to list.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },

    removeProductFromList: async (productId, listId) => {
      set({ isLoadingLists: true, error: null });
      try {
        await apiRemoveProductFromFavoriteList(listId, productId);
        set(state => ({
          lists: state.lists.map(list =>
            list.id === listId
              ? { ...list, productIds: list.productIds.filter(id => id !== productId) }
              : list
          ),
          isLoadingLists: false,
        }));
        const targetList = get().lists.find(l => l.id === listId);
        toast.success(`Product removed from list: ${targetList?.name || 'selected list'}`);
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to remove product from list.';
        set({ error: errorMessage, isLoadingLists: false });
        toast.error(errorMessage);
      }
    },

    deleteFavoriteListAction: async (listId: number) => {
        set({ isLoadingLists: true, error: null });
        try {
            await apiDeleteFavoriteList(listId);
            set(state => ({
                lists: state.lists.filter(list => list.id !== listId),
                isLoadingLists: false,
            }));
            toast.success('Favorite list deleted.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete favorite list.';
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
      console.log("[removeSelectedProducts] productIdsToRemove:", JSON.stringify(productIdsToRemove));

      try {
        await Promise.all(productIdsToRemove.map(id => {
          console.log("[removeSelectedProducts] Calling apiRemoveUserFavorite for id:", id, "Type:", typeof id);
          return apiRemoveUserFavorite(id);
        }));
        
        set(state => ({
          products: state.products.filter(p => !productIdsToRemove.includes(p.ProductId)),
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
        const errorMessage = error.response?.data?.message || 'Failed to remove some selected products.';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    },
    
    sortProductsInternal: (productsToSort: FavoriteProduct[], sortType: string): FavoriteProduct[] => {
      const sorted = [...productsToSort];
      sorted.sort((a, b) => {
        switch (sortType) {
          case 'price-asc':
            return (a.Price ?? 0) - (b.Price ?? 0);
          case 'price-desc':
            return (b.Price ?? 0) - (a.Price ?? 0);
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default: 
            const dateA = a.AddedDate ? new Date(a.AddedDate).getTime() : 0;
            const dateB = b.AddedDate ? new Date(b.AddedDate).getTime() : 0;
            if (sortType === 'date-asc') {
                 return dateA - dateB;
            }
            return (dateB - dateA) || ((b.ProductId ?? 0) - (a.ProductId ?? 0));
        }
      });
      return sorted;
    },

    _setFavoriteProducts: (apiProducts: ApiFavoriteDto[]) => {
      console.log("[_setFavoriteProducts] Received apiProducts:", JSON.stringify(apiProducts));
      const mappedProducts: FavoriteProduct[] = apiProducts.map((dto, index) => {
        // DETAILED LOG FOR EACH DTO ITEM
        console.log(`[_setFavoriteProducts] Mapping DTO item #${index} - ProductId: ${dto.ProductId}, ProductName: '${dto.ProductName}', Price: ${dto.Price}`);
        
        if (apiProducts.length > 0 && dto === apiProducts[0]) { 
          console.log("[_setFavoriteProducts] Mapping first dto (full object):", JSON.stringify(dto));
        }

        const currentProductName = dto.ProductName;
        const currentPrice = dto.Price;
        console.log(`[_setFavoriteProducts] Inside map, currentProductName: '${currentProductName}', currentPrice: ${currentPrice}`);

        return {
          id: dto.ProductId,
          ProductId: dto.ProductId,
          ProductName: currentProductName,
          Price: currentPrice,
          name: currentProductName || 'Unnamed Product',
          ImageUrl: dto.ImageUrl, 
          AddedDate: dto.AddedDate, 
          inStock: dto.InStock,           
          listId: undefined,
          selected: false,
        };
      });
      console.log("[_setFavoriteProducts] Mapped products (before sort) - Post SupplierName Removal Test:", JSON.stringify(mappedProducts));
      const sorted = get().actions.sortProductsInternal(mappedProducts, get().sortType);

      const productsToStore = sorted.map(p => ({
        id: p.id,
        ProductId: p.ProductId,
        ProductName: p.ProductName,
        Price: p.Price,
        ImageUrl: p.ImageUrl,
        AddedDate: p.AddedDate,
        name: p.name,
        inStock: p.inStock,
        listId: p.listId,
        selected: p.selected,
      }));
      console.log("[_setFavoriteProducts] Products to store (FINAL - before set state):", JSON.stringify(productsToStore));

      set({ products: productsToStore, error: null, isLoading: false }); 
    },

    _setFavoriteLists: (apiLists: ApiFavoriteListDto[]) => {
        const mappedLists: FavoriteList[] = apiLists.map(dto => ({
            id: dto.ListId,
            name: dto.Name,
            isPrivate: dto.IsPrivate,
            productIds: dto.ProductIds || [],
        }));
        set({ lists: mappedLists, isLoadingLists: false });
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
          const allProductIds = new Set(state.products.map(p => p.ProductId)); 
          return { selectedProductIds: allProductIds };
        } else {
          return { selectedProductIds: new Set() };
        }
      });
    },

    fetchProductsForList: async (listId: number) => {
      set({ isLoadingCurrentListProducts: true, error: null });
      try {
        const listItemsDto = await apiGetFavoriteListItems(listId);
        const mappedListProducts: FavoriteProduct[] = listItemsDto.map(dto => ({
          id: dto.ProductId,
          ProductId: dto.ProductId,
          ProductName: dto.ProductName,
          Price: dto.Price,
          ImageUrl: dto.ImageUrl,
          AddedDate: dto.AddedDate,
          name: dto.ProductName || 'Unnamed Product',
          inStock: dto.InStock,
          listId: listId,
          selected: false,
        }));
        set({ currentListProducts: mappedListProducts, isLoadingCurrentListProducts: false });
      } catch (error: any) {
        const message = error.response?.data?.message || `Failed to load products for list ${listId}.`;
        set({ error: message, isLoadingCurrentListProducts: false, currentListProducts: [] });
        toast.error(message);
      }
    },

    createFavoriteList: async (userId: number, listName: string, isPrivate: boolean): Promise<FavoriteList | null> => {
      set({ isLoadingLists: true, error: null });
      try {
        const requestBody: CreateFavoriteListRequestDto = { ListName: listName, IsPrivate: isPrivate };
        const newListDto = await apiCreateFavoriteList(userId, requestBody);
        if (newListDto) {
          const newList: FavoriteList = {
            id: newListDto.ListId,
            name: newListDto.Name,
            isPrivate: newListDto.IsPrivate,
            productIds: newListDto.ProductIds || [],
          };
          set(state => ({
            lists: [...state.lists, newList],
            isLoadingLists: false,
          }));
          toast.success(`List "${newList.name}" created.`);
          return newList;
        } else {
          throw new Error('Failed to get response from backend when creating list.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to create list.';
        set({ error: errorMessage, isLoadingLists: false });
        toast.error(errorMessage);
        return null;
      }
    },
  }
}))

export const useFavoritesActions = () => useFavoritesStore((state) => state.actions);