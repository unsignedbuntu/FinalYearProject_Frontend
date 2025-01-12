// Unsplash API kullanarak ürün fotoğrafı arama
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function searchProductImages(query: string, count: number = 3): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${count}&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    const data = await response.json();
    return data.results.map((result: any) => result.urls.regular);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}

// Benzer ürünleri bulma fonksiyonu
export function findRelatedProducts(
  currentProduct: any,
  allProducts: any[],
  limit: number = 4
): any[] {
  return allProducts
    .filter(product => 
      product.id !== currentProduct.id && 
      (product.category === currentProduct.category ||
       product.tags?.some((tag: string) => currentProduct.tags?.includes(tag)))
    )
    .slice(0, limit);
}

// Ürün fotoğraflarını önbelleğe alma
const imageCache = new Map<string, string[]>();

export async function getCachedProductImages(
  query: string,
  count: number = 3
): Promise<string[]> {
  const cacheKey = `${query}_${count}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const images = await searchProductImages(query, count);
  imageCache.set(cacheKey, images);
  return images;
} 