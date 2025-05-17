import axios from 'axios';
import https from 'https';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.URL || 'https://localhost:7296', // Backend URL'nizi buraya ekleyin veya environment'tan alın
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Development için
  withCredentials: true // Oturum/Cookie tabanlı kimlik doğrulama için önemli
});

// Request interceptor KALDIRILDI. Kimlik doğrulamasının cookie'ler üzerinden
// ve `withCredentials: true` ile yönetildiği varsayılıyor.
// import { useUserStore } from '@/app/stores/userStore'; 

// api.interceptors.request.use(
//   (config) => {
//     const token = useUserStore.getState().user?.token; // VEYA user?.accessToken veya doğru yol
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Export the configured Axios instance
export { api };

// Ensure fetch calls use the correct environment variable or default
const getApiUrl = () => process.env.URL || 'https://localhost:7296';

// --- DTO Arayüzleri ---
// (Backend'deki DTO'larla eşleşmeli - Gerekirse alanları güncelleyin)
export interface CartItemDto {
  productId: number;
  productName: string; // Backend DTO'sunda productName olmalı
  supplierName?: string; // Backend DTO'sunda varsa
  price: number;
  quantity: number;
  imageUrl?: string; // Backend DTO'sundan gelen görsel yolu
  // Örnek: UserCartItemID ekleyebilirsiniz, frontend'de unique key için gerekebilir
  userCartItemId?: number; // Backend DTO'sunda varsa
}

export interface FavoriteDto {
  ProductId: number; // PascalCase olarak güncellendi
  ProductName?: string; // PascalCase ve opsiyonel olarak güncellendi
  Price: number; // PascalCase olarak güncellendi
  ImageUrl?: string; // PascalCase ve opsiyonel olarak güncellendi
  AddedDate: string; // PascalCase ve string olarak güncellendi (DateTime string olarak serialize edilir)
  SupplierName?: string; // Backend'den gelmesi beklenen tedarikçi adı
  InStock?: boolean;     // Backend'den gelmesi beklenen stok durumu
}

export interface AddOrUpdateCartItemRequestDto {
  productId: number;
  quantity: number;
}

export interface AddFavoriteRequestDto {
  productId: number;
}

// --- FAVORITE LISTS DTOs (NEW) ---
export interface FavoriteListDto {
  favoriteListID: number; // Swagger'a göre camelCase
  userID: number;         // Swagger'a göre camelCase
  listName: string;       // Swagger'a göre camelCase
  isPrivate: boolean;     // Swagger'a göre camelCase
  productIds?: number[];  // Opsiyonel, API yanıtında yoksa
  createdAt?: string;     // Opsiyonel, API yanıtında var
  status?: boolean;       // Opsiyonel, API yanıtında var
}

export interface CreateFavoriteListRequestDto {
  ListName: string;
  IsPrivate: boolean;
  // UserId backend tarafından token'dan alınır genelde
}

export interface AddProductToFavoriteListRequestDto {
  ProductId: number;
}

// Yeni DTO: Bir favori listesindeki ürünler için (Backend'deki FavoriteListItemResponseDTO'ya karşılık gelmeli)
export interface ApiFavoriteListItemDto {
  favoriteListItemID: number; // C# DTO'suna göre camelCase
  favoriteListID: number;   // C# DTO'suna göre camelCase
  productID: number;        // C# DTO'suna göre camelCase
  productName?: string;     // C# DTO'suna göre camelCase
  productPrice: number;     // C# DTO'suna göre (decimal -> number)
  productImageUrl?: string; // C# DTO'suna göre camelCase
  inStock: boolean;         // C# DTO'suna göre camelCase
  addedDate: string;        // C# DTO'suna göre (DateTime -> string)
  supplierName?: string;    // C# DTO'suna göre camelCase (opsiyonel olabilir backend'de string? değilse ? kaldırılır)
}

// Backend'den gelen genel bir başarı/hata yanıtı için
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[]; // Hata detayları için
}

// Refactored function using Axios instance
export const getStores = async () => {
  try {
    const response = await api.get('/api/Stores');
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};

// Example: Refactor getCategories as well if used in StoresMegaMenu or similar
export const getCategories = async () => {
  try {
    const response = await api.get('/api/Categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Keep other fetch-based functions for now, but consider refactoring them too
// if they need authentication or consistent HTTPS handling.

// Add function to get current user info
export const getAuthMe = async () => {
  // Axios instance `api` should automatically handle cookies/credentials
  try {
    const response = await api.get('/api/Auth/me'); 
    // Swagger response shows { status: "Success", user: { id: ..., email: ..., fullName: ... } }
    // We need to return the user object inside
    if (response.data && response.data.status === "Success" && response.data.user) {
        return response.data.user; 
    } else {
        // Handle cases where the API returns 200 OK but no valid user data
        console.error('getAuthMe returned success status but no user data:', response.data);
        return null; // Indicate not logged in
    }
  } catch (error: any) {
    // Handle specific errors like 401 Unauthorized (not logged in)
    if (error.response && error.response.status === 401) {
      console.warn('User not authenticated (401 from /api/Auth/me)');
      return null; // Indicate not logged in
    } else {
      console.error('Error fetching /api/Auth/me:', error);
      return null; // Re-throw other errors
    }
  }
};

// Example: getCategoriesById using fetch (needs NEXT_PUBLIC_API_URL in env)
export const getCategoriesById = async (id: number) => {
  try {
    const response = await api.get(`/api/Categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

// Example update for createCategory
export const createCategory = async (data: any) => {
  try {
    const response = await api.post('/api/Categories', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating category:', error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Kategori oluşturulamadı.';
    throw new Error(errorMessage);
  }
};

// Remember to update other fetch calls similarly...

export const updateCategory = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Categories/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteCategory = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Categories/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

//Products
export const getProducts = async () => {
  try {
    const result = await api.get('/api/Products'); // Axios kullanıldı
    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}; 

export const getProductById = async (id: number) => {
  try {
      const response = await api.get(`/api/Products/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
  }
};

export const getProductsByCategoryId = async (categoryId: number) => {
  try {
    const result = await fetch(`${getApiUrl()}/api/Products/ByCategory/${categoryId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store'
    });

    if (!result.ok) {
      if (result.status === 404) {
        console.warn(`No products found for category ${categoryId}`);
        return []; 
      }
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};

export const createProduct = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Products`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });
  
  return response.json();
};

export const updateProduct = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Products/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Products/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};  

//Stores
export const getStoreById = async (id: number) => {
  try {
      const response = await api.get(`/api/Stores/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error fetching store ${id}:`, error);
      throw error;
  }
};

export const createStore = async (data: any) => {
  try {
      const response = await api.post('/api/Stores', data);
      return response.data;
  } catch (error: any) {
      console.error('Error creating store:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Mağaza oluşturulamadı.';
      throw new Error(errorMessage);
  }
};

export const updateStore = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Stores/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteStore = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Stores/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

// Suppliers
export const getProductSuppliers = async () => {
  try {
    const response = await api.get('/api/ProductSuppliers'); // Axios kullanıldı
    return response.data;
  } catch (error) {
    console.error('Error fetching product suppliers:', error);
    return [];
  }
};

export const getProductSupplierById = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/ProductSuppliers/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store'
  });
  return response.json();
};

export const createProductSupplier = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/ProductSuppliers`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });
  
  return response.json();
};

export const updateProductSupplier = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/ProductSuppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteProductSupplier = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/ProductSuppliers/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export const getSuppliers = async () => {
  try {
    const response = await api.get('/api/Suppliers'); // Axios kullanıldı
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

export const getSupplierById = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Suppliers/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store'
  });
  return response.json();
};

export const createSupplier = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Suppliers`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });
  
  return response.json();
};

export const updateSupplier = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Suppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteSupplier = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Suppliers/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export async function getImageFromCache(pageId: string, prompt: string) {
  try {
    const response = await api.post('/api/ImageCache', {
      pageID: pageId,
      prompt: prompt,
      checkOnly: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    console.log('Cache response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching from cache:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return { cached: false, error: error.message };
  }
}

export const getCacheImageById = async (pageId: string, prompt: string, id: number) => {
  const response = await fetch(`${getApiUrl()}/api/ImageCache?pageId=${pageId}&prompt=${prompt}&id=${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store'
  });
  return response.json();
};

interface CreateCacheImageParams {
  pageID: string;
  prompt: string;
}

export const createCacheImage = async ({ pageID, prompt }: CreateCacheImageParams) => {
  try {
    if (!pageID || !prompt) {
      console.error("HATA: pageID veya prompt veya image eksik!", { pageID, prompt });
      return { success: false, error: "PageID ve Prompt,Image zorunludur!" };
    }

    const response = await api.post('/api/ImageCache', {
      pageID: pageID,
      prompt: prompt,
      checkOnly: false
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    if (response.data && response.data.image) {
      return {
        success: true,
        image: response.data.image
      };
    }
  
    return {
      success: false,
      error: 'Failed to create image'
    };
  } catch (error: any) {
    console.error('Error in createCacheImage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create and cache image' 
    };
  }
};

export const deleteCacheImage = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/ImageCache/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export const getLoyaltyPrograms = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/api/LoyaltyPrograms`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
      },
      mode: 'cors',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

export const getLoyaltyProgramById = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/LoyaltyPrograms/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store'
  });
  return response.json();
};

export const createLoyaltyProgram = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/LoyaltyPrograms`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });
  
  return response.json();
};

export const updateLoyaltyProgram = async (id: number, data: any) => {
  const response = await fetch(`${getApiUrl()}/api/LoyaltyPrograms/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteLoyaltyProgram = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/LoyaltyPrograms/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

//Reviews
export const getUserReviews = async (userId: number) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/Reviews/ByUser/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store'
    });
    if (!response.ok) {
      if (response.status === 404) return []; // Yorum yoksa boş dizi
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reviews for user ${userId}:`, error);
    return []; // Hata durumunda boş dizi
  }
};

export const submitReviewApi = async (reviewData: { 
  userId: number; 
  productId: number; 
  orderItemId?: number; // Backend'e göre gerekebilir
  rating: number; 
  comment: string; 
}) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/Reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store',
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return await response.json(); // Başarılı yanıtı döndür
  } catch (error) {
     console.error('Error submitting review:', error);
     throw error; // Hatanın store action'ında yakalanması için tekrar fırlat
  }
};

// Backend DTO'suna uygun payload oluştur
interface OrderItemPayload {
  productID: number;
  quantity: number;
  priceAtPurchase: number;
}

// OrderPayloadDTO interface'inin sadece bir kere tanımlandığından emin olalım
// Eğer başka bir yerde tanımlıysa onu kaldırıp bunu export edelim.
export interface OrderPayloadDTO {
  userID: number;
  totalAmount: number;
  shippingAddress?: string;
  orderItems: OrderItemPayload[];
}

//Orders
export const getUserOrders = async (userId: number) => {
  try {
    // Axios kullanıldı
    const response = await api.get(`/api/Orders/ByUser/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) return [];
    console.error(`Error fetching orders for user ${userId}:`, error);
    return [];
  }
};

// Add function to create an order
// Parametre tipi olarak export edilen OrderPayloadDTO'yu kullan
export const createOrder = async (orderData: OrderPayloadDTO) => {
  try {
    // Axios kullanıldı
    const response = await api.post('/api/Orders', orderData);
    return response.data; // Return the created order details
  } catch (error: any) {
     console.error('Error creating order:', error);
     // Daha detaylı hata mesajı fırlat
     const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sipariş oluşturulamadı.';
     throw new Error(errorMessage);
  }
};

// Add function to get details of a single order
export const getOrderDetails = async (orderId: number) => {
  try {
    // Axios kullanıldı
    const response = await api.get(`/api/Orders/${orderId}`);
    return response.data;
  } catch (error: any) {
     console.error(`Error fetching details for order ${orderId}:`, error);
     const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sipariş detayları alınamadı.';
     throw new Error(errorMessage);
  }
};

// --- YENİ SEPET API FONKSİYONLARI ---

/** Kullanıcının sepetindeki ürünleri getirir */
export const getUserCart = async (): Promise<CartItemDto[]> => {
  try {
    // Backend'in doğrudan List<CartItemDto> döndürdüğünü varsayıyoruz
    const response = await api.get<CartItemDto[]>('/api/Cart');
    console.log("getUserCart response:", response.data);
    // Backend'den gelen yanıtta `productId` gibi alan adları frontend ile uyuşmuyorsa burada map'leme yapın
    // Örnek map'leme:
    // return response.data.map(item => ({
    //   userCartItemId: item.userCartItemID, // Backend'den gelen
    //   productId: item.productID,         // Backend'den gelen
    //   productName: item.product?.productName || 'Unknown Product', // Join ile geliyorsa
    //   price: item.product?.price || 0,                       // Join ile geliyorsa
    //   quantity: item.quantity,
    //   imageUrl: item.product?.imageUrl,                     // Join ile geliyorsa
    //   supplierName: item.product?.supplier?.supplierName     // Join ile geliyorsa
    // }));
    return response.data || []; // Boş dizi döndür eğer data yoksa
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.warn('Kullanıcı sepeti alınamadı (Yetkisiz 401)');
      return [];
    }
    console.error('Kullanıcı sepeti alınırken hata:', error);
    return []; // Hata durumunda boş dizi döndür
  }
};

/** Sepete ürün ekler veya mevcut ürünün miktarını günceller */
export const addOrUpdateCartItem = async (item: AddOrUpdateCartItemRequestDto): Promise<CartItemDto | null> => {
  try {
    // Backend'in güncellenmiş veya eklenmiş CartItemDto döndürdüğünü varsayıyoruz
    const response = await api.post<CartItemDto>('/api/Cart', item);
    return response.data;
  } catch (error: any) {
    console.error('Sepete öğe eklerken/güncellerken hata:', error);
    // Hata mesajını backend'den almaya çalışalım
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sepete eklenemedi.';
    throw new Error(errorMessage);
  }
};

/** Sepetten belirli bir ürünü kaldırır */
export const removeCartItem = async (productId: number): Promise<boolean> => {
  try {
    // Backend'in başarı durumunda 200 OK veya 204 No Content döndürdüğünü varsayıyoruz
    await api.delete(`/api/Cart/${productId}`);
    return true;
  } catch (error: any) {
    console.error(`Sepetten ürün ${productId} kaldırılırken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Ürün sepetten kaldırılamadı.';
    throw new Error(errorMessage);
  }
};

/** Kullanıcının tüm sepetini temizler */
export const clearUserCart = async (): Promise<boolean> => {
  try {
    // Backend'in başarı durumunda 200 OK veya 204 No Content döndürdüğünü varsayıyoruz
    await api.delete('/api/Cart/clear');
    return true;
  } catch (error: any) {
    console.error('Sepet temizlenirken hata:', error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sepet temizlenemedi.';
    throw new Error(errorMessage);
  }
};

// --- YENİ FAVORİLER API FONKSİYONLARI ---

/** Kullanıcının favori ürünlerini getirir */
export const getUserFavorites = async (): Promise<FavoriteDto[]> => {
  try {
    // Backend'in doğrudan List<FavoriteDto> döndürdüğünü varsayıyoruz
    const response = await api.get<FavoriteDto[]>('/api/Favorites');
    console.log("getUserFavorites response:", response.data);
    // Gerekirse backend DTO alan adlarıyla map'leme yapın (productId, productName, imageUrl vb.)
    return response.data || [];
  } catch (error: any) {
     if (error.response && error.response.status === 401) {
      console.warn('Kullanıcı favorileri alınamadı (Yetkisiz 401)');
      return [];
    }
    console.error('Kullanıcı favorileri alınırken hata:', error);
    return [];
  }
};

/** Kullanıcının favorilerine ürün ekler */
export const addUserFavorite = async (productId: number): Promise<FavoriteDto | null> => {
  try {
    const requestBody: AddFavoriteRequestDto = { productId };
    // Backend'in eklenen FavoriteDto'yu döndürdüğünü varsayıyoruz
    const response = await api.post<FavoriteDto>('/api/Favorites', requestBody);
    return response.data;
  } catch (error: any) {
    console.error(`Favorilere ürün ${productId} eklenirken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Ürün favorilere eklenemedi.';
    // Check for specific conflict error (already favorited)
    if (error.response?.status === 409 || errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('zaten mevcut')) {
        throw new Error('Bu ürün zaten favorilerinizde.');
    }
    throw new Error(errorMessage);
  }
};

/** Kullanıcının favorilerinden ürünü kaldırır */
export const removeUserFavorite = async (productId: number): Promise<boolean> => {
  try {
    // Backend'in başarı durumunda 200 OK veya 204 No Content döndürdüğünü varsayıyoruz
    await api.delete(`/api/Favorites/${productId}`);
    return true;
  } catch (error: any) {
    console.error(`Favorilerden ürün ${productId} kaldırılırken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Ürün favorilerden kaldırılamadı.';
    throw new Error(errorMessage);
  }
};

// --- FAVORITE LISTS API FUNCTIONS (NEW) ---

/** Kullanıcının tüm favori listelerini getirir */
export const getUserFavoriteLists = async (userId: number): Promise<FavoriteListDto[]> => {
  try {
    const response = await api.get<FavoriteListDto[]>(`/api/FavoriteLists/users/${userId}`);
    console.log(`getUserFavoriteLists for user ${userId} response:`, response.data);
    return response.data || [];
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.warn(`Kullanıcı ${userId} favori listeleri alınamadı (Yetkisiz 401)`);
      return [];
    }
    console.error(`Kullanıcı ${userId} favori listeleri alınırken hata:`, error);
    return [];
  }
};

/** Yeni bir favori listesi oluşturur */
export const createFavoriteList = async (userId: number, listData: CreateFavoriteListRequestDto): Promise<FavoriteListDto | null> => {
  try {
    // userId'yi URL'e dahil et
    const response = await api.post<FavoriteListDto>(`/api/FavoriteLists/users/${userId}`, listData);
    return response.data;
  } catch (error: any) {
    console.error(`Kullanıcı ${userId} için favori listesi oluşturulurken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Favori listesi oluşturulamadı.';
    throw new Error(errorMessage);
  }
};

/** Belirli bir favori listesini siler */
export const deleteFavoriteList = async (listId: number): Promise<boolean> => {
  try {
    await api.delete(`/api/FavoriteLists/${listId}`);
    return true;
  } catch (error: any) {
    console.error(`Favori listesi ${listId} silinirken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Favori listesi silinemedi.';
    throw new Error(errorMessage);
  }
};

/** Bir favori listesine ürün ekler */
export const addProductToFavoriteList = async (listId: number, productId: number): Promise<void> => {
  try {
    const requestBody: AddProductToFavoriteListRequestDto = { ProductId: productId };
    // Endpoint URL'i backend'e göre değişebilir: /api/FavoriteLists/{listId}/items veya /api/FavoriteLists/{listId}/products
    await api.post(`/api/FavoriteLists/${listId}/products`, requestBody);
  } catch (error: any) {
    console.error(`Ürün ${productId} favori listesi ${listId}'e eklenirken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Ürün listeye eklenemedi.';
    // Check for specific conflict error (already in list)
    if (error.response?.status === 409 || errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('zaten mevcut')) {
        throw new Error('Bu ürün zaten listede.');
    }
    throw new Error(errorMessage);
  }
};

/** Bir favori listesinden ürünü kaldırır */
export const removeProductFromFavoriteList = async (listId: number, productId: number): Promise<void> => {
  try {
    // Endpoint URL'i backend'e göre değişebilir
    await api.delete(`/api/FavoriteLists/${listId}/products/${productId}`);
  } catch (error: any) {
    console.error(`Ürün ${productId} favori listesi ${listId}'nden kaldırılırken hata:`, error);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Ürün listeden kaldırılamadı.';
    throw new Error(errorMessage);
  }
};

/** Belirli bir favori listesindeki ürünleri getirir */
export const getFavoriteListItems = async (listId: number): Promise<ApiFavoriteListItemDto[]> => {
  try {
    const response = await api.get<ApiFavoriteListItemDto[]>(`/api/FavoriteLists/${listId}/products`);
    console.log(`getFavoriteListItems for list ${listId} response:`, response.data);
    return response.data || [];
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.warn(`Favori listesi ${listId} ürünleri alınamadı (Yetkisiz 401)`);
      // Kullanıcıya özel bir mesaj gösterilebilir veya login'e yönlendirilebilir.
    } else if (error.response && error.response.status === 404) {
      console.warn(`Favori listesi ${listId} bulunamadı veya ürünleri yok.`);
      // Liste bulunamadı veya boşsa farklı işlem yapılabilir.
    } else {
      console.error(`Favori listesi ${listId} ürünleri alınırken hata:`, error);
    }
    // Hata durumunda boş dizi döndürmek, UI'da "ürün yok" mesajını tetikleyebilir.
    // Veya hatayı fırlatıp store/component seviyesinde yakalamak da bir seçenek.
    // Şimdilik boş dizi dönüyoruz.
    return [];
  }
};

// Opsiyonel: Liste adını veya gizliliğini güncellemek için
// export interface UpdateFavoriteListRequestDto {
//   Name?: string;
//   IsPrivate?: boolean;
// }

// export const updateFavoriteList = async (listId: number, data: UpdateFavoriteListRequestDto): Promise<FavoriteListDto | null> => {
//   try {
//     const response = await api.put<FavoriteListDto>(`/api/FavoriteLists/${listId}`, data);
//     return response.data;
//   } catch (error: any) {
//     console.error(`Favori listesi ${listId} güncellenirken hata:`, error);
//     const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Liste güncellenemedi.';
//     throw new Error(errorMessage);
//   }
// };