import axios from 'axios';
import https from 'https';
import { AxiosResponse } from 'axios';

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

// --- REVIEWS API FUNCTIONS ---

// TypeScript Interfaces for Reviews
export interface ApiReviewableProduct {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  productImageUrl?: string | null;
  orderDate: string; // ISO Date string
  quantity: number;
  priceAtPurchase: number;
  productVariantInfo?: string | null;
}

export interface ApiReview {
  reviewID: number;
  userID: number;
  productID: number;
  orderItemID?: number | null;
  rating: number;
  comment?: string | null;
  reviewDate: string; // ISO Date string
  userFullName?: string | null;
  userAvatarUrl?: string | null;
  productName?: string | null;
  productImageUrl?: string | null;
}

export interface ApiCreateReviewPayload {
  productID: number;
  orderItemID?: number | null;
  rating: number;
  comment?: string | null;
}

/**
 * Fetches order items that are eligible for review by the current user.
 * GET /api/Reviews/me/reviewable-order-items
 */
export const getReviewableOrderItems = async (): Promise<ApiReviewableProduct[]> => {
  try {
    const response = await api.get<ApiReviewableProduct[]>('/api/Reviews/me/reviewable-order-items');
    console.log('[API_Service] getReviewableOrderItems response:', response.data);
    return response.data || []; // Ensure array is returned
  } catch (error) {
    console.error('[API_Service] Error fetching reviewable order items:', error);
    throw error; // Propagate error for store to handle
  }
};

/**
 * Submits a new review.
 * POST /api/Reviews
 */
export const createReview = async (payload: ApiCreateReviewPayload): Promise<ApiReview> => {
  try {
    const response = await api.post<ApiReview>('/api/Reviews', payload);
    console.log('[API_Service] createReview response:', response.data);
    if (!response.data || !response.data.reviewID) { // Basic validation of response
        throw new Error("Invalid response from createReview API");
    }
    return response.data;
  } catch (error) {
    console.error('[API_Service] Error creating review:', error);
    throw error;
  }
};

/**
 * Fetches reviews for a specific product.
 * GET /api/Reviews/ByProduct/{productId}
 */
export const getReviewsByProductId = async (productId: number): Promise<ApiReview[]> => {
  try {
    const response = await api.get<ApiReview[]>(`/api/Reviews/ByProduct/${productId}`);
    console.log(`[API_Service] getReviewsByProductId for ${productId} response:`, response.data);
    return response.data || []; // Ensure array is returned
  } catch (error) {
    console.error(`[API_Service] Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
};

/**
 * Fetches all reviews written by a specific user (for "Completed reviews" tab).
 * GET /api/Reviews/ByUser/{userId}
 */
export const getReviewsByUserId = async (userId: number): Promise<ApiReview[]> => {
  try {
    const response = await api.get<ApiReview[]>(`/api/Reviews/ByUser/${userId}`);
    console.log(`[API_Service] getReviewsByUserId for user ${userId} response:`, response.data);
    return response.data || []; // Ensure array is returned
  } catch (error) {
    console.error(`[API_Service] Error fetching reviews for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches details for a single review.
 * GET /api/Reviews/details/{id}
 */
export const getReviewDetailsById = async (reviewId: number): Promise<ApiReview | null> => {
  try {
    const response = await api.get<ApiReview>(`/api/Reviews/details/${reviewId}`);
    console.log(`[API_Service] getReviewDetailsById for ${reviewId} response:`, response.data);
    return response.data; // Can be null if not found
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
        return null;
    }
    console.error(`[API_Service] Error fetching review details for ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Deletes (soft delete via status update) a review by its ID.
 * DELETE /api/Reviews/{id} (as per backend controller)
 */
export const deleteReviewById = async (reviewId: number): Promise<{ message: string } | null > => {
  try {
    const response = await api.delete<{ message: string }>(`/api/Reviews/${reviewId}`);
    console.log(`[API_Service] deleteReviewById for ${reviewId} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API_Service] Error deleting review ${reviewId}:`, error);
    throw error;
  }
};

// --- ORDERS API FUNCTIONS ---

// Interface for creating an order (matches C# OrderPayloadDTO)
export interface OrderPayloadDTO {
  userID: number; // Or string, depending on your User ID type. Assuming number from useAuth.
  totalAmount: number;
  shippingAddress?: string; // Optional
  orderItems: Array<{
    productID: number;
    quantity: number;
    priceAtPurchase: number;
  }>;
}

// Interface for an Order (matches C# OrdersDTO or a simplified version)
export interface OrderDto {
  orderID: number;
  userID: number;
  orderDate: string; // ISO string
  totalAmount: number;
  status: string; // e.g., "Pending", "Shipped", "Delivered", "Cancelled"
  shippingAddress?: string;
  // Potentially include orderItems if the backend returns them directly with the order list
  // orderItems?: ApiOrderItemDto[]; 
}

/**
 * Fetches all orders for a specific user.
 * GET /api/Orders/ByUser/{userId}
 */
export const getUserOrders = async (userId: number): Promise<OrderDto[]> => {
  try {
    const response = await api.get<OrderDto[]>(`/api/Orders/ByUser/${userId}`);
    return response.data || []; // Ensure array is returned
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn(`No orders found for user ${userId} (404).`);
      return []; 
    }
    console.error(`Error fetching orders for user ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch orders for user ${userId}.`);
  }
};

/**
 * Creates a new order.
 * POST /api/Orders
 */
export const createOrder = async (orderData: OrderPayloadDTO): Promise<OrderDto> => {
  try {
    const response = await api.post<OrderDto>('/api/Orders', orderData);
    if (!response.data || !response.data.orderID) { // Basic validation
        throw new Error("Invalid response from createOrder API");
    }
    return response.data;
  } catch (error: any) {
     console.error('Error creating order:', error.response?.data || error.message);
     const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sipariş oluşturulamadı.';
     throw new Error(errorMessage);
  }
};

/**
 * Fetches details for a single order.
 * GET /api/Orders/{orderId}
 */
export const getOrderDetails = async (orderId: number): Promise<OrderDto | null> => {
  try {
    const response = await api.get<OrderDto>(`/api/Orders/${orderId}`);
    return response.data; // Can be null if not found
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
        console.warn(`Order ${orderId} not found (404).`);
        return null;
    }
    console.error(`Error fetching details for order ${orderId}:`, error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || 'Sipariş detayları alınamadı.';
    throw new Error(errorMessage);
  }
};

// --- YENİ SEPET API FONKSİYONLARI ---

/** Kullanıcının sepetindeki ürünleri getirir */
export const getUserCart = async (): Promise<CartItemDto[]> => {
  try {
    // Backend'in `/api/Cart` endpoint'inin CartItem'ları ve ilişkili Product/Supplier bilgilerini döndürdüğünü varsayıyoruz.
    // Dönen her bir öğenin productName, price, imageUrl VE supplierName içerdiğini varsayıyoruz.
    const response = await api.get<CartItemDto[]>('/api/Cart');
    console.log("getUserCart response:", response.data);

    // Backend'den gelen yanıtta supplierName alanı zaten doğru şekilde mapleniyorsa
    // (yani CartItemDto tanımındaki gibi camelCase ise) ekstra map'lemeye gerek olmayabilir.
    // Ancak, emin olmak için veya backend farklı bir yapı gönderiyorsa (örneğin Product.Supplier.SupplierName gibi)
    // burada bir map işlemi faydalı olabilir.
    // Aşağıdaki map varsayımsal bir backend yapısına göredir.
    // GERÇEK BACKEND YANITINIZA GÖRE AYARLAMANIZ GEREKİR.
    return (response.data || []).map(item => ({
      ...item, // productName, price, quantity, imageUrl gibi alanlar doğrudan gelsin
      productId: item.productId, // Zaten camelCase olmalı
      // supplierName alanı için olası senaryolar:
      // 1. item.supplierName (doğrudan geliyorsa)
      // 2. item.product?.supplier?.supplierName (iç içe objelerden geliyorsa)
      // 3. item.product?.supplierName (product objesinde direct supplierName varsa)
      // Backend DTO yapınıza göre doğru olanı seçin.
      // Şimdilik gelen item'da supplierName olduğunu varsayıyorum:
      supplierName: item.supplierName || 'Unknown Supplier',
      // Construct the proxied image URL
      imageUrl: item.productId ? `/api-proxy/product-image/${item.productId}` : (item.imageUrl || '/placeholder.png')
    }));
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
    // Gelen her bir favori ürün için ImageUrl'i proxy üzerinden oluştur
    return (response.data || []).map(fav => ({
      ...fav,
      // Varsayıyoruz ki fav.ProductId mevcut ve ImageUrl bununla oluşturulacak.
      // Eğer backend'den gelen ImageUrl zaten tam bir URL ise bu satırı kaldırabilirsiniz
      // veya koşullu olarak proxy kullanabilirsiniz.
      // Şimdilik, ProductId kullanarak proxy URL oluşturuyoruz.
      ImageUrl: fav.ProductId ? `/api-proxy/product-image/${fav.ProductId}` : (fav.ImageUrl || '/placeholder.png') 
    }));
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
    const itemsWithImages = (response.data || []).map(item => ({
      ...item,
      productImageUrl: `/api-proxy/product-image/${item.productID}` // Proxy URL'i oluştur
    }));
    return itemsWithImages; // Return the processed items
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

// --- UserInformation and UserAddress DTOs ---

// Corresponds to C# UserInformationDto
export interface UserInformationRequestDto {
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO string format for date (e.g., "YYYY-MM-DD")
  phoneNumber?: string | null; // phoneNumber alanı eklendi
}

// Corresponds to C# UserInformationResponseDto (assuming similar structure or direct mapping from UserInformation entity)
export interface UserInformationResponseDto {
  userInformationID: number;
  userID: number;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO string format
  phoneNumber?: string | null; // Eklendi
}

// Corresponds to C# UserAddressDto
export interface UserAddressRequestDto {
  // UserAddressID is typically 0 or omitted for new addresses.
  // For updates, it might be in the DTO or path. Backend uses path {id}.
  // UserAddressID?: number; 
  addressTitle: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district?: string | null;
  fullAddress: string;
  isDefault: boolean;
}

// Corresponds to C# UserAddressResponseDto (assuming similar structure or direct mapping from UserAddress entity)
export interface UserAddressResponseDto {
  userAddressID: number;
  userID: number;
  addressTitle: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district?: string | null;
  fullAddress: string;
  isDefault: boolean;
  status: boolean; // Assuming status is part of the response
}


// --- UserInformation API Functions ---

/**
 * Gets the current user's information.
 * GET /api/userinformation
 */
export const getCurrentUserInformation = async (): Promise<ApiResponse<UserInformationResponseDto | null>> => {
  try {
    const response = await api.get<ApiResponse<UserInformationResponseDto>>('/api/userinformation');
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user information:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch user information.', data: null };
  }
};

/**
 * Creates or updates the current user's information.
 * PUT /api/userinformation
 */
export const createOrUpdateCurrentUserInformation = async (userInfoData: UserInformationRequestDto): Promise<ApiResponse<UserInformationResponseDto | null>> => {
  try {
    const response = await api.put<ApiResponse<UserInformationResponseDto>>('/api/userinformation', userInfoData);
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error('Error creating/updating user information:', error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update user information.', 
      errors: error.response?.data?.errors,
      data: null
    };
  }
};

// --- UserAddresses API Functions ---

/**
 * Gets all active addresses for the current user.
 * GET /api/addresses
 */
export const getCurrentUserAddresses = async (): Promise<ApiResponse<UserAddressResponseDto[] | null>> => {
  try {
    const response = await api.get<ApiResponse<UserAddressResponseDto[]>>('/api/addresses');
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user addresses:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch addresses.', data: null };
  }
};

/**
 * Gets a specific address by ID for the current user.
 * GET /api/addresses/{id}
 */
export const getUserAddressById = async (id: number): Promise<ApiResponse<UserAddressResponseDto | null>> => {
  try {
    const response = await api.get<ApiResponse<UserAddressResponseDto>>(`/api/addresses/${id}`);
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching address ${id}:`, error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || `Failed to fetch address ${id}.`, data: null };
  }
};

/**
 * Creates a new address for the current user.
 * POST /api/addresses
 */
export const createUserAddress = async (addressData: UserAddressRequestDto): Promise<ApiResponse<UserAddressResponseDto | null>> => {
  try {
    const response = await api.post<ApiResponse<UserAddressResponseDto>>('/api/addresses', addressData);
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error('Error creating address:', error.response?.data || error.message);
     return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to create address.', 
      errors: error.response?.data?.errors,
      data: null
    };
  }
};

/**
 * Updates an existing address for the current user.
 * PUT /api/addresses/{id}
 */
export const updateUserAddress = async (id: number, addressData: UserAddressRequestDto): Promise<ApiResponse<UserAddressResponseDto | null>> => {
  try {
    const response = await api.put<ApiResponse<UserAddressResponseDto>>(`/api/addresses/${id}`, addressData);
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error(`Error updating address ${id}:`, error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || `Failed to update address ${id}.`,
      errors: error.response?.data?.errors,
      data: null
    };
  }
};

/**
 * Soft deletes an address for the current user (marks as inactive).
 * DELETE /api/addresses/{id}
 */
export const deleteUserAddress = async (id: number): Promise<ApiResponse<object | null>> => { // Backend returns ApiResponseDto<object>
  try {
    const response = await api.delete<ApiResponse<object>>(`/api/addresses/${id}`);
    // The backend controller returns ApiResponseDto directly
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting address ${id}:`, error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || `Failed to delete address ${id}.`, data: null };
  }
};

// Corresponds to C# ImageCacheDTO
export interface ImageCacheRequestDto {
  prompt: string;
  base64Image: string;
  entityType?: string; // "Product" or "Supplier"
  entityId?: number;
}

// Corresponds to C# ImageCacheResponseDTO
export interface ImageCacheResponseDto {
  id: number;
  prompt?: string;
  hashValue?: string;
  status: boolean;
  productId?: number;
  productName?: string;
  supplierId?: number;
  supplierName?: string;
  base64Image?: string; 
  imageUrl?: string;
}

// --- NEW ImageCache Functions for C# Backend ---

/**
 * Creates or updates an image in the backend cache.
 * POST /api/imagecache
 */
export const createOrUpdateImageInBackend = async (dto: ImageCacheRequestDto): Promise<ImageCacheResponseDto | null> => {
  try {
    const response = await api.post<ApiResponse<ImageCacheResponseDto>>('/api/imagecache', dto);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    console.error('Error creating/updating image in backend:', response.data?.message || 'No data returned', response.data);
    return null;
  } catch (error: any) {
    console.error('Exception in createOrUpdateImageInBackend:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save image to backend cache';
    throw new Error(errorMessage);
  }
};

/**
 * Gets an image from the backend cache by prompt.
 * GET /api/imagecache/prompt/{prompt}
 */
export const getImageByPromptFromBackend = async (prompt: string): Promise<ImageCacheResponseDto | null> => {
  if (!prompt) return null;
  try {
    const response = await api.get<ApiResponse<ImageCacheResponseDto>>(`/api/imagecache/prompt/${encodeURIComponent(prompt)}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data && !response.data.success) {
        // This is a valid case where image is not found, not necessarily an error.
        console.log(`Image not found in backend by prompt "${prompt}": ${response.data.message}`);
        return null;
    }
    return null;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log(`Image not found in backend by prompt (404): "${prompt}"`);
      return null;
    }
    console.error(`Error fetching image by prompt from backend for "${prompt}":`, error.response?.data || error.message);
    return null;
  }
};

/**
 * Returns the direct URL to fetch an image by its ID from the backend.
 * This URL will hit GET /api/imagecache/image/{id}
 */
export const getDirectImageUrlFromBackend = (imageId: number): string => {
  return `${getApiUrl()}/api/imagecache/image/${imageId}`;
};

/**
 * Soft deletes an image cache record from the backend.
 * DELETE /api/imagecache/{id}
 */
export const deleteImageCacheInBackend = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/api/imagecache/${id}`);
    return response.data?.success || false;
  } catch (error: any) {
    console.error(`Error deleting image cache ${id} in backend:`, error.response?.data || error.message);
    return false;
  }
};

/**
 * Gets image cache entries for a specific ProductID.
 * GET /api/imagecache/product/{productId}
 */
export const getImageCacheForProductFromBackend = async (productId: number): Promise<ImageCacheResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<ImageCacheResponseDto[]>>(`/api/imagecache/product/${productId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    console.error(`Error fetching image cache for product ${productId} from backend:`, error.response?.data || error.message);
    return [];
  }
};

/**
 * Gets image cache entries for a specific SupplierID.
 * GET /api/imagecache/supplier/{supplierId}
 */
export const getImageCacheForSupplierFromBackend = async (supplierId: number): Promise<ImageCacheResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<ImageCacheResponseDto[]>>(`/api/imagecache/supplier/${supplierId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    console.error(`Error fetching image cache for supplier ${supplierId} from backend:`, error.response?.data || error.message);
    return [];
  }
};

// --- Function to be called by Frontend Components via Next.js API Route ---

interface FrontendImageCacheParams {
  prompt: string;
  entityType?: 'Product' | 'Supplier' | string; // Page context like 'products', 'my-followed-stores'
  entityId?: number;
  // pageID was used to give context to Next.js API route. We'll use entityType primarily now.
  // pageID might still be passed if the Next.js API route needs it for other logic.
  pageID?: 'products' | 'my-followed-stores' | string; 
}

/**
 * This function is intended to be called by client-side components.
 * It triggers the Next.js API route (/api/ImageCache) for image generation and caching.
 * The Next.js API route, in turn, will use the "*InBackend" functions above to interact with the C# backend.
 * @param params - Contains prompt, entityType, entityId, and checkOnly flag.
 * @param params.checkOnly - If true, the Next.js API route should only check the cache (both its own logic and backend's) without generating.
 * @returns A promise that resolves to an object containing success status, and optionally the image (base64) or an error message.
 */
export const getOrGenerateImageViaNextApi = async (
  params: FrontendImageCacheParams & { checkOnly: boolean }
): Promise<{ success: boolean; image?: string; source?: string; error?: string }> => {
  try {
    const body: Record<string, any> = {
      prompt: params.prompt,
      checkOnly: params.checkOnly,
    };

    if (params.entityType && params.entityId !== undefined) {
      body.entityType = params.entityType;
      body.entityId = params.entityId;
    }
    // Pass pageID if provided, as the Next.js route might still use it for context
    // or to derive entityType/entityId if not explicitly given.
    if (params.pageID) {
        body.pageID = params.pageID;
    }

    // This fetch calls YOUR Next.js API route located at app/api/ImageCache/route.ts
    const response = await fetch('/api/ImageCache', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from Next.js API route' }));
      console.error('Error from Next.js /api/ImageCache route:', response.status, errorData);
      return { success: false, error: errorData.error || `Next.js API Route Error: ${response.status}` };
    }
    // The Next.js API route is expected to return a JSON response like:
    // { success: true, image: 'base64string', source: 'cache_or_generated' }
    // or { success: false, error: 'message', source: '...' }
    return await response.json();

  } catch (error: any) {
    console.error('Exception in getOrGenerateImageViaNextApi:', error);
    return { success: false, error: error.message || 'Failed to process image request via Next.js API route' };
  }
};

// --- Search DTOs and Service Function ---

export interface SearchResultProduct {
  productID: number;
  productName: string;
  imageUrl?: string;
}

export interface SearchResultCategory {
  categoryID: number;
  categoryName: string;
}

export interface SearchResultStore {
  storeID: number;
  storeName: string;
}

// New interface for Supplier results from backend
export interface SearchResultSupplier {
  supplierID: number;
  supplierName: string;
}

export interface GlobalSearchResults {
  products: SearchResultProduct[];
  categories: SearchResultCategory[];
  stores: SearchResultStore[];
  suppliers: SearchResultSupplier[];
}

/**
 * Performs a global search across products, categories, stores, and suppliers.
 * Calls the backend endpoint GET /api/search?q={searchTerm}
 */
export const searchGlobal = async (query: string): Promise<GlobalSearchResults> => {
  try {
    // Corrected endpoint to /api/Search and query parameter to 'q'
    // Use the existing ApiResponse interface for the expected response type.
    const response = await api.get<ApiResponse<GlobalSearchResults>>(`/api/Search?q=${encodeURIComponent(query)}`);
    
    console.log('[searchGlobal] Full Axios response:', response);
    console.log('[searchGlobal] API response.data (this is ApiResponse):', response.data);

    // Check if the backend operation was successful and data exists
    // The actual search results are in response.data.data
    if (response.data && response.data.success && response.data.data) {
      console.log('[searchGlobal] Search successful, returning response.data.data:', response.data.data);
      return response.data.data;
    } else {
      // Handle cases where the API call itself was successful (e.g., 200 OK) 
      // but the backend indicates a failure (e.g., success: false) or data is missing.
      console.warn('[searchGlobal] API call successful, but backend indicates failure or no data. Message:', response.data?.message);
      return { products: [], categories: [], stores: [], suppliers: [] };
    }

  } catch (error: any) { 
    console.error('[searchGlobal] Error during global search API call:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[searchGlobal] Axios error - Response Data:', error.response.data);
      console.error('[searchGlobal] Axios error - Response Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[searchGlobal] Axios error - No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[searchGlobal] Axios error - Request setup error:', error.message);
    }
    // Ensure a valid, empty GlobalSearchResults object is returned on any error.
    console.log('[searchGlobal] Returning empty results due to an exception during API call.');
    return { products: [], categories: [], stores: [], suppliers: [] };
  }
};

export const getProxiedProductImageUrl = (productId: number): string => {
  // This URL will point to a new Next.js API route we will create.
  // Using a distinct path like '/api-proxy' to avoid potential conflicts with '/api'.
  return `/api-proxy/product-image/${productId}`;
};

export const getProxiedSupplierImageUrl = (supplierId: number): string => {
  return `/api-proxy/supplier-image/${supplierId}`;
};

// --- User Followed Suppliers DTO and API Functions ---

export interface FollowedSupplierDto {
  supplierID: number;
  supplierName: string;
  contactEmail?: string;
  // Add other relevant fields if your backend provides them for a "followed supplier" context
}

/**
 * Gets all suppliers followed by a specific user.
 * Assumes backend endpoint: GET /api/users/{userId}/followed-suppliers
 */
export const getFollowedSuppliers = async (userId: number): Promise<ApiResponse<FollowedSupplierDto[] | null>> => {
  if (!userId) {
    console.warn('[getFollowedSuppliers] User ID is required.');
    return { success: false, message: 'User ID is required.', data: null };
  }
  try {
    const response = await api.get<ApiResponse<FollowedSupplierDto[]>>(`/api/users/${userId}/followed-suppliers`);
    // Assuming the backend returns ApiResponseDto<FollowedSupplierDto[]>
    return response.data;
  } catch (error: any) {
    console.error(`[getFollowedSuppliers] Error fetching followed suppliers for user ${userId}:`, error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || `Failed to fetch followed suppliers for user ${userId}.`, 
      data: null 
    };
  }
};

/**
 * Marks a supplier as followed by a user.
 * Assumes backend endpoint: POST /api/users/{userId}/followed-suppliers/{supplierId}
 */
export const followSupplier = async (userId: number, supplierId: number): Promise<ApiResponse<null>> => {
  if (!userId || !supplierId) {
    console.warn('[followSupplier] User ID and Supplier ID are required.');
    return { success: false, message: 'User ID and Supplier ID are required.' };
  }
  try {
    // Backend might return 201 Created with no content or an ApiResponse indicating success
    const response = await api.post<ApiResponse<null>>(`/api/users/${userId}/followed-suppliers/${supplierId}`);
    return response.data || { success: true, message: 'Supplier followed successfully.' }; // Fallback if response.data is empty but successful
  } catch (error: any) {
    console.error(`[followSupplier] Error following supplier ${supplierId} for user ${userId}:`, error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || `Failed to follow supplier ${supplierId}.`,
      errors: error.response?.data?.errors 
    };
  }
};

/**
 * Marks a supplier as unfollowed by a user.
 * Assumes backend endpoint: DELETE /api/users/{userId}/followed-suppliers/{supplierId}
 */
export const unfollowSupplier = async (userId: number, supplierId: number): Promise<ApiResponse<null>> => {
  if (!userId || !supplierId) {
    console.warn('[unfollowSupplier] User ID and Supplier ID are required.');
    return { success: false, message: 'User ID and Supplier ID are required.' };
  }
  try {
    // Backend might return 204 No Content or an ApiResponse indicating success
    const response = await api.delete<ApiResponse<null>>(`/api/users/${userId}/followed-suppliers/${supplierId}`);
    return response.data || { success: true, message: 'Supplier unfollowed successfully.' }; // Fallback if response.data is empty but successful
  } catch (error: any) {
    console.error(`[unfollowSupplier] Error unfollowing supplier ${supplierId} for user ${userId}:`, error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || `Failed to unfollow supplier ${supplierId}.`,
      errors: error.response?.data?.errors
    };
  }
};

// Corresponds to C# OrderItemsResponseDTO
export interface ApiOrderItemDto { 
  orderItemID: number;
  orderID: number;
  productID: number;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  barcode?: string | null; 
  productImageUrl?: string; // Yeni alan eklendi
}

/**
 * Belirli bir siparişe ait tüm sipariş kalemlerini getirir.
 * GET /api/OrderItems/ByOrder/{orderId}
 */
export const getOrderItemsByOrderId = async (orderId: number): Promise<ApiOrderItemDto[]> => {
  try {
    const response = await api.get<ApiOrderItemDto[]>(`/api/OrderItems/ByOrder/${orderId}`);
    const itemsWithImages = (response.data || []).map(item => ({
      ...item,
      productImageUrl: `/api-proxy/product-image/${item.productID}` // Proxy URL'i oluştur
    }));
    console.log(`[getOrderItemsByOrderId] Response for order ${orderId}:`, itemsWithImages);
    return itemsWithImages; 
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn(`[getOrderItemsByOrderId] No order items found for order ${orderId} (404).`);
      return []; 
    }
    console.error(`[getOrderItemsByOrderId] Error fetching order items for order ${orderId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch order items for order ${orderId}.`);
  }
};

// --- TOP REVIEWED PRODUCTS ---
export interface ApiTopReviewedProduct {
  productID: number;
  productName: string;
  price: number;
  originalPrice?: number; // Optional, if backend provides it
  imageUrl: string; // Assuming backend provides a direct or relative URL
  averageRating: number;
  // Fields like 'discount' string or 'isHot' might not be standard for this type of endpoint
  // They can be derived on the frontend if originalPrice is available, or omitted.
}

/**
 * Fetches the top N most reviewed products.
 * Assumes backend endpoint: GET /api/products/top-reviewed?count={count}
 */
export const getTopReviewedProducts = async (count: number): Promise<ApiTopReviewedProduct[]> => {
  try {
    const response = await api.get<ApiTopReviewedProduct[]>(`/api/products/top-reviewed?count=${count}`);
    console.log(`[getTopReviewedProducts] count=${count} response:`, response.data);
    return response.data || []; // Ensure array is returned
  } catch (error: any) {
    console.error(`[getTopReviewedProducts] Error fetching top reviewed products (count=${count}):`, error.response?.data || error.message);
    // Depending on how you want to handle errors, you might throw or return empty
    // For a best-seller component, returning empty might be preferable to breaking the page
    return []; 
  }
};