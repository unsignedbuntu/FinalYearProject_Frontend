import axios from 'axios';
import https from 'https';

export const getCategories = async () => {
  try {
    const result = await fetch(`${process.env.URL}/api/Categories`, { 
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
    console.error('Error fetching categories:', error);
    return [];
  }
}; 


export const getCategoriesById = async (id: number) => {

  const response = await fetch(`${process.env.URL}/api/Categories/${id}`, {
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

export const createCategory = async (data: any) => {

  const response = await fetch(`${process.env.URL}/api/Categories`, {

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

export const updateCategory = async (id: number, data: any) => {

  const response = await fetch(`${process.env.URL}/api/Categories/${id}`, {

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

  const response = await fetch(`${process.env.URL}/api/Categories/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

//Products
export const getProducts = async () => {
  try {
    const result = await fetch(`${process.env.URL}/api/Products`, { 
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

  const response = await fetch(`${process.env.URL}/api/Products/${id}`, {
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

export const createProduct = async (data: any) => {

  const response = await fetch(`${process.env.URL}/api/Products`, {

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

  const response = await fetch(`${process.env.URL}/api/Products/${id}`, {

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

  const response = await fetch(`${process.env.URL}/api/Products/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};  

//Stores
export const getStores = async () => {
  try {
    const result = await fetch(`${process.env.URL}/api/Stores`, { 
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
    console.error('Error fetching stores:', error);
    return [];
  }
};

export const getStoreById = async (id: number) => {

  const response = await fetch(`${process.env.URL}/api/Stores/${id}`, {
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

  const response = await fetch(`${process.env.URL}/api/Stores`, {

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

  const response = await fetch(`${process.env.URL}/api/Stores/${id}`, {

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

  const response = await fetch(`${process.env.URL}/api/Stores/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

// Suppliers
export const getSuppliers = async () => {
  try {
    const response = await fetch(`${process.env.URL}/api/Suppliers`, {
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
    const response = await fetch(`${process.env.URL}/api/Suppliers/${id}`, {
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
  const response = await fetch(`${process.env.URL}/api/Suppliers`, {
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
  const response = await fetch(`${process.env.URL}/api/Suppliers/${id}`, {
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
  const response = await fetch(`${process.env.URL}/api/Suppliers/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export async function getImageFromCache(pageId: string, prompt: string) {
  try {
      // Create the same short hash for consistency
      
      const response = await axios.get(`${process.env.URL}/api/ImageCache/${pageId}/${prompt}`, {
        
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

  const response = await fetch(`${process.env.URL}/api/ImageCache?pageId=${pageId}&prompt=${prompt}&id=${id}`, {
    
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
  image: string; 
}

export const createCacheImage = async ({ pageID, prompt, image}: CreateCacheImageParams) => {
  try {
      if ( !pageID || !prompt || !image ) {
          console.error("HATA: pageID veya prompt veya image eksik!", { pageID, prompt, image });
          return { success: false, error: "PageID ve Prompt,Image zorunludur!" };
      }

      // Önce cache'de var mı kontrol et
      const existingImage = await getImageFromCache(pageID, prompt);
      if (existingImage.cached && existingImage.image) {
          console.log("Görsel zaten cache'de mevcut, varolan görseli döndürüyorum");
          return {
              success: true,
              image: existingImage.image
          };
      } 

      const response = await axios.post(`${process.env.URL}/api/ImageCache`, {
          pageID: pageID,
          prompt: prompt,
          image: image
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
  const response = await fetch(`${process.env.URL}/api/ImageCache/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};