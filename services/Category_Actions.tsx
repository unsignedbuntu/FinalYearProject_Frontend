import axios from 'axios';

export const getCategories = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Categories`, { 
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Categories/${id}`, {
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Categories`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Categories/${id}`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Categories/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

//Products
export const getProducts = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Products`, { 
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Products/${id}`, {
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Products`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Products/${id}`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Products/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};  

//Stores
export const getStores = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Stores`, { 
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Stores/${id}`, {
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Stores`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Stores/${id}`, {

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Stores/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

// Suppliers
export const getProductSuppliers = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ProductSuppliers`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ProductSuppliers/${id}`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ProductSuppliers`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ProductSuppliers/${id}`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ProductSuppliers/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export const getSuppliers = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Suppliers`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Suppliers/${id}`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Suppliers`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Suppliers/${id}`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Suppliers/SoftDelete_Status${id}`, {
    method: 'DELETE',
  });

  return response.json();
};

export const getCacheImageById = async (pageId: string, prompt: string, id: number) => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ImageCache?pageId=${pageId}&prompt=${prompt}&id=${id}`, {
    
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
          return { success: false, error: "PageID ve Prompt zorunludur!" };
      }

      // Next.js Route'umuza (yukarıda yazdığımız POST dosyasına) istek atıyoruz
      const response = await axios.post(`/api/ImageCache`, {
          pageID: pageID,
          prompt: prompt,
      }, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      });

      if (response.data && response.data.image) {
        return {
          success: true,
          image: response.data.image
        };
      }
  
      return { success: false, error: 'Failed to create image' };
    } catch( error) { 
        console.error('Error in createCacheImage:', error);
        const err = error as Error;
        return { success: false, error: err.message || 'Failed to create and cache image' };
    }
};

export const deleteCacheImage = async (id: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ImageCache/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
