import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-hot-toast'
import { 
    // FavoriteDto as ApiFavoriteDto, // We will use ApiFavoriteProductResponse for incoming data
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
    ApiFavoriteListItemDto, // This is PascalCase, used for list items
    FavoriteDto as BackendFavoriteDto, // Keep original for addProductToMainFavorites if its response is truly PascalCase
    getFavoriteListItems as apiGetFavoriteListItems
} from '@/services/API_Service'

// Interface for the actual data received from the /api/Favorites endpoint
interface ApiFavoriteProductResponse {
  productId: number;
  productName?: string;
  price: number;
  imageUrl?: string;
  addedDate: string;
  supplierName?: string;
  inStock?: boolean;
}

// Standardized FavoriteProduct interface for the store (PascalCase)
export interface FavoriteProduct {
    Id: number; // Using ProductId as the main Id from backend
    ProductId: number;
    ProductName?: string;
    Price: number;
    ImageUrl?: string;
    AddedDate: string; // string from API
    InStock?: boolean;
    Selected?: boolean;
    ListId?: number | undefined;
    SupplierName?: string; 
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
    _setFavoriteProducts: (apiProducts: ApiFavoriteProductResponse[]) => void // Changed type here
    _setFavoriteLists: (apiLists: ApiFavoriteListDto[]) => Promise<void>
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

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ...initialState,
      isFavorite: (productId, listId) => {
        if (listId === undefined) {
          return get().products.some(p => p.ProductId === productId && p.ListId === undefined);
        }
        const list = get().lists.find(l => l.id === listId);
        return list ? list.productIds.includes(productId) : false;
      },
      actions: {
        initializeFavoritesAndLists: async (userId: number) => {
          set({ isLoading: true, isLoadingLists: true, error: null });
          try {
            const [favoritesResponseArray, listsDtoArrayFromApi] = await Promise.all([
              apiGetUserFavorites() as unknown as ApiFavoriteProductResponse[],
              apiGetUserFavoriteLists(userId)
            ]);
            
            get().actions._setFavoriteProducts(favoritesResponseArray);
            await get().actions._setFavoriteLists(listsDtoArrayFromApi);
          } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to load favorites or lists data.';
            set({ error: message, isLoading: false, isLoadingLists: false });
            toast.error(message);
          }
        },

        addProductToMainFavorites: async (productId) => {
          if (get().products.some(p => p.ProductId === productId && p.ListId === undefined)) {
            toast.error("Product is already in main favorites.");
            return;
          }
          set({ isLoading: true, error: null });
          try {
            // Assuming addedFavoriteDto from apiAddUserFavorite is BackendFavoriteDto (PascalCase)
            // If this API also returns camelCase, this mapping needs to be adjusted like _setFavoriteProducts
            const addedFavoriteDto = await apiAddUserFavorite(productId); 
            if (addedFavoriteDto) {
              const newFavorite: FavoriteProduct = {
                // Map from BackendFavoriteDto (PascalCase) to FavoriteProduct (PascalCase)
                Id: addedFavoriteDto.ProductId,
                ProductId: addedFavoriteDto.ProductId,
                ProductName: addedFavoriteDto.ProductName,
                Price: addedFavoriteDto.Price,
                ImageUrl: addedFavoriteDto.ImageUrl,
                AddedDate: addedFavoriteDto.AddedDate, // Ensure this is a string
                InStock: addedFavoriteDto.InStock,
                SupplierName: addedFavoriteDto.SupplierName,
                ListId: undefined,
                Selected: false
              };
              set(state => {
                const updatedProducts = [...state.products, newFavorite];
                const sorted = state.actions.sortProductsInternal(updatedProducts, state.sortType);
                return { products: sorted, error: null, isLoading: false };
              });
               toast.success(`${newFavorite.ProductName || 'Product'} added to main favorites!`); // Use ProductName
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
          const productToRemove = get().products.find(p => p.ProductId === productId && p.ListId === undefined);
          if (!productToRemove) {
            toast.error("Product not found in main favorites.");
            return;
          }
          set({ isLoading: true, error: null });
          try {
            await apiRemoveUserFavorite(productId);
            set(state => {
              // Only filter out from the main products array (where ListId is undefined)
              const updatedProducts = state.products.filter(p => !(p.ProductId === productId && p.ListId === undefined));
              
              const updatedSelectedIds = new Set(state.selectedProductIds);
              updatedSelectedIds.delete(productId);
              
              // DO NOT modify state.lists here for this specific action

              return {
                products: updatedProducts,
                selectedProductIds: updatedSelectedIds,
                lists: state.lists, // Keep lists as they are
                error: null,
                isLoading: false
              };
            });
            toast.success(`${productToRemove.ProductName || 'Product'} removed from main favorites.`); // Corrected toast
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
            // Ensure FavoriteProduct properties are accessed correctly (PascalCase)
            const productDetails = get().products.find(p => p.ProductId === productId);

            if (!targetList) throw new Error(`List with ID ${listId} not found.`);
            if (!productDetails) throw new Error(`Product with ID ${productId} not found in favorites.`);

            // apiAddProductToFavoriteList expects listId, productId
            await apiAddProductToFavoriteList(listId, productId); // Call API first

            set(state => { // Then update local state
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
            toast.success(`${productDetails.ProductName || 'Product'} added to list: ${targetList.name}`); // Use ProductName
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
            toast.success(`DEBUG: Product successfully removed ONLY from list: ${targetList?.name || 'selected list'}. ID: ${listId}`);
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
              // Ensure FavoriteProduct properties are accessed correctly (PascalCase)
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
                // Use ProductName for sorting
                return (a.ProductName || '').localeCompare(b.ProductName || '');
              case 'name-desc':
                // Use ProductName for sorting
                return (b.ProductName || '').localeCompare(a.ProductName || '');
              default: 
                // Ensure AddedDate and ProductId are accessed correctly
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

        _setFavoriteProducts: (apiProducts: ApiFavoriteProductResponse[]) => { // Changed type here
         // console.log("[_setFavoriteProducts] Received apiProducts (camelCase from API):", JSON.stringify(apiProducts));
          const mappedProducts: FavoriteProduct[] = apiProducts.map((dto, index) => {
            // console.log(`[_setFavoriteProducts] Mapping camelCase DTO item #${index} - productId: ${dto.productId}, productName: '${dto.productName}', price: ${dto.price}`);
            
            if (apiProducts.length > 0 && dto === apiProducts[0]) { 
              // console.log("[_setFavoriteProducts] Mapping first camelCase dto (full object):", JSON.stringify(dto));
            }

            return {
              // Map from ApiFavoriteProductResponse (camelCase) to FavoriteProduct (PascalCase)
              Id: dto.productId,
              ProductId: dto.productId,
              ProductName: dto.productName,
              Price: dto.price,
              ImageUrl: dto.imageUrl,
              AddedDate: dto.addedDate, // Ensure this is a string
              InStock: dto.inStock,
              SupplierName: dto.supplierName,
              ListId: undefined, // Default for main favorites
              Selected: false,   // Default
            };
          });
        //  console.log("[_setFavoriteProducts] Mapped products to PascalCase (before sort):", JSON.stringify(mappedProducts));
          const sorted = get().actions.sortProductsInternal(mappedProducts, get().sortType);

          // productsToStore is already FavoriteProduct[] type due to mappedProducts and sorted
         // console.log("[_setFavoriteProducts] Products to store (FINAL - before set state):", JSON.stringify(sorted));

          set({ products: sorted, error: null, isLoading: false }); 
        },

        _setFavoriteLists: async (apiLists: ApiFavoriteListDto[]) => {
            // apiLists artık favoriteListID ve listName (camelCase) içeren DTO'lardan oluşuyor.
            // Ancak productIds içermiyor. Bu yüzden her liste için ayrıca productID'leri çekeceğiz.
            
            const listsWithProductIdsPromises = apiLists.map(async (dto) => {
              let productIdsForCurrentList: number[] = [];
              try {
                // Her liste için ürünlerini (ve dolayısıyla ID'lerini) çek
                const items = await apiGetFavoriteListItems(dto.favoriteListID);
                productIdsForCurrentList = items.map(item => item.productID); // productID, ApiFavoriteListItemDto'da tanımlı olmalı
              } catch (error) {
                console.error(`Error fetching items for list ${dto.favoriteListID}:`, error);
                // Hata durumunda productIds boş kalır
              }
              return {
                id: dto.favoriteListID,   
                name: dto.listName,       
                isPrivate: dto.isPrivate,
                productIds: productIdsForCurrentList, 
              };
            });

            const mappedLists = await Promise.all(listsWithProductIdsPromises);
            
            set({ lists: mappedLists, isLoadingLists: false });
        },

        _clearLocalState: () => {
          set({ 
            products: [], 
            selectedProductIds: new Set(), 
            lists: [], 
            currentListProducts: [], 
            error: null, 
          }); 
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
              // Ensure FavoriteProduct properties are accessed correctly (PascalCase)
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
            // apiGetFavoriteListItems returns ApiFavoriteListItemDto[] (camelCase)
            const listItemsDto: ApiFavoriteListItemDto[] = await apiGetFavoriteListItems(listId); 
            const mappedListProducts: FavoriteProduct[] = listItemsDto.map((dto: ApiFavoriteListItemDto) => ({
              // Mapping from ApiFavoriteListItemDto (camelCase) to FavoriteProduct (PascalCase)
              Id: dto.productID,          // Corrected to camelCase: productID
              ProductId: dto.productID,   // Corrected to camelCase: productID
              ProductName: dto.productName, // Corrected to camelCase: productName
              Price: dto.productPrice,    // Corrected to camelCase: productPrice
              ImageUrl: dto.productImageUrl,// Corrected to camelCase: productImageUrl
              AddedDate: dto.addedDate,   // Corrected to camelCase: addedDate
              InStock: dto.inStock,       // Corrected to camelCase: inStock
              SupplierName: dto.supplierName, // Corrected to camelCase: supplierName
              ListId: listId,
              Selected: false,
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
            // apiCreateFavoriteList'ten dönen newListDto'nun da favoriteListID ve listName içerdiğini varsayıyoruz.
            const newListDto = await apiCreateFavoriteList(userId, requestBody);
            if (newListDto) {
              const newList: FavoriteList = {
                id: newListDto.favoriteListID, // Doğru alan: favoriteListID
                name: newListDto.listName,     // Doğru alan: listName
                isPrivate: newListDto.isPrivate,
                productIds: newListDto.productIds || [],
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
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        lists: state.lists,
        sortType: state.sortType,
        showInStock: state.showInStock,
      }),
    }
  )
)

export const useFavoritesActions = () => useFavoritesStore((state) => state.actions);