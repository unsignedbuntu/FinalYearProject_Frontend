import axios from 'axios';
import https from 'https';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  withCredentials: true
});

// Request interceptor removed as cookies handle auth

// Export the configured Axios instance
export { api };

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
        throw new Error('User data not found in /me response.');
    }
  } catch (error: any) {
    // Handle specific errors like 401 Unauthorized (not logged in)
    if (error.response && error.response.status === 401) {
      console.warn('User not authenticated (401 from /api/Auth/me)');
      return null; // Indicate not logged in
    } else {
      console.error('Error fetching /api/Auth/me:', error);
      throw error; // Re-throw other errors
    }
  }
};

// Example: getCategoriesById using fetch (needs NEXT_PUBLIC_API_URL in env)
export const getCategoriesById = async (id: number) => {
  const apiUrl = process.env.URL;
  const response = await fetch(`${apiUrl}/api/Categories/${id}`, {
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
  return response.json();
};

// Ensure fetch calls use the correct environment variable or default
const getApiUrl = () => process.env.URL;

// Example update for createCategory
export const createCategory = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Categories`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'no-store',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  return response.json();
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
    const result = await fetch(`${getApiUrl()}/api/Products`, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store'
    });
    
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}; 

export const getProductById = async (id: number) => {
  const response = await fetch(`${getApiUrl()}/api/Products/${id}`, {
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
  const response = await fetch(`${getApiUrl()}/api/Stores/${id}`, {
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

export const createStore = async (data: any) => {
  const response = await fetch(`${getApiUrl()}/api/Stores`, {
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
    const response = await fetch(`${getApiUrl()}/api/ProductSuppliers`, {
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
    const response = await fetch(`${getApiUrl()}/api/Suppliers`, {
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

// Order creation DTO structure (adjust based on your actual backend DTO)
interface OrderItemPayload {
  productID: number;
  quantity: number;
  priceAtPurchase: number; // Use the price at the time of checkout
  // Add other fields if needed by backend (e.g., size, color)
}

interface OrderPayloadDTO {
  userID: number;
  totalAmount: number;
  shippingAddress?: string; // Optional or fetched elsewhere
  orderItems: OrderItemPayload[];
  // Add other fields if needed (e.g., couponCode)
}

//Orders
export const getUserOrders = async (userId: number) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/Orders/ByUser/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store'
    });
    if (!response.ok) {
      if (response.status === 404) return []; // Sipariş yoksa boş dizi
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return []; // Hata durumunda boş dizi
  }
};

// Add function to create an order
export const createOrder = async (orderData: OrderPayloadDTO) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/Orders`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store',
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
       const errorText = await response.text();
       // Try to parse error if JSON
       try {
         const errorJson = JSON.parse(errorText);
         throw new Error(errorJson.message || `HTTP error! status: ${response.status}, message: ${errorText}`);
       } catch {
         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
       }
    }
    return await response.json(); // Return the created order details
  } catch (error) {
     console.error('Error creating order:', error);
     throw error; // Re-throw for the component to handle
  }
};