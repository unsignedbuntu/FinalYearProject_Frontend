'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts, getStores, getCategoriesById } from '@/services/Category_Actions';
import { Product, Category, Store } from '@/app/product/[id]/types/Product';
import { basePrompts } from '@/app/product/[id]/data/basePrompts';
import { CategoryKey } from '@/app/product/[id]/data/basePrompts';
import { use } from 'react';

// Lucide-react yerine SVG ikonları kullanacağız
const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ArrowUpDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 15 5 5 5-5"/>
    <path d="m7 9 5-5 5 5"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

// Product tipini genişletelim
interface ExtendedProduct extends Product {
  storeID?: number;
}

// Tüm işlenmiş promptları takip etmek için global bir cache oluştur
const globalImageCache: Record<string, string> = {};

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // React.use() ile params'ı çözümleme
  const resolvedParams = use(params);
  const categoryId = parseInt(resolvedParams.id);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<string>('popularity');
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [processedPrompts, setProcessedPrompts] = useState<Set<string>>(new Set());
  const [imagesGenerated, setImagesGenerated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Kategori bilgisini al
        const categoryData = await getCategoriesById(categoryId);
        setCategory(categoryData);
        
        // Tüm kategorileri, ürünleri ve mağazaları al
        const [categoriesData, productsData, storesData] = await Promise.all([
          getCategories(),
          getProducts(),
          getStores()
        ]);

        setCategories(categoriesData);
        
        // Sadece bu kategoriye ait ürünleri filtrele
        const filteredProducts = productsData
          .filter((product: Product) => product.categoryID === categoryId)
          .map((product: Product) => {
            // Ürünün mağaza ID'sini bul
            const productCategory = categoriesData.find((c: Category) => c.categoryID === product.categoryID);
            const storeID = productCategory ? productCategory.storeID : 1; // Varsayılan olarak 1 kullan
            
            return {
              ...product,
              storeID: storeID
            };
          });
        
        console.log(`Found ${filteredProducts.length} products for category ${categoryId}`);
        setProducts(filteredProducts);
        setStores(storesData);
        
        // Kategoriyi genişlet
        setExpandedCategories({ [categoryId]: true });

        // Markaları çıkar
        const uniqueBrands = Array.from(new Set(filteredProducts.map((product: ExtendedProduct) => {
          const store = storesData.find((s: Store) => s.storeID === product.storeID);
          return store ? store.storeName : 'Unknown';
        }))).filter(brand => brand !== 'Unknown') as string[];
        
        setBrands(uniqueBrands);
        
        // Fiyat aralığını belirle
        if (filteredProducts.length > 0) {
          const prices = filteredProducts
            .map((p: ExtendedProduct) => p.price || 0)
            .filter((price: number) => price > 0);
          
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  // Görsel üretme fonksiyonu - product/[id]/page.tsx'deki gibi
  const generateProductImage = useCallback(async (product: ExtendedProduct) => {
    // Zaten görseli varsa ve placeholder değilse üretme
    if (product.image && 
        product.image.length > 0 && 
        !product.image.includes('placeholder') && 
        product.image !== '/placeholder.png') {
      console.log("Product already has a valid image, skipping generation:", product.productID);
      return;
    }
    
    try {
      console.log("Checking for cached image for product:", product.productID, product.productName);
      setLoadingImages(prev => ({ ...prev, [product.productID]: true }));

      // Kategori adını belirle
      let productCategory = categories.find((c: Category) => c.categoryID === product.categoryID);
      
      // Kategori adını al, yoksa 'default' kullan
      const categoryName = productCategory?.categoryName || 'default';
      const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
      const mainPrompt = categoryPrompt.main(product.productName);
      
      // Eğer bu prompt daha önce işlendiyse, atla
      if (processedPrompts.has(mainPrompt)) {
        console.log("This prompt was already processed locally, skipping:", mainPrompt);
        setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
        return;
      }
      
      // Global cache'de varsa, kullan
      if (globalImageCache[mainPrompt]) {
        console.log("Image found in global cache, using cached image for:", product.productID);
        
        // Ürünü güncelle
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.productID === product.productID 
              ? { ...p, image: globalImageCache[mainPrompt] } 
              : p
          )
        );
        
        setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
        setProcessedPrompts(prev => new Set([...prev, mainPrompt]));
        return;
      }
      
      // Bu promptu işlenmiş olarak işaretle
      setProcessedPrompts(prev => new Set([...prev, mainPrompt]));
      
      // Sadece POST isteği kullan - GET isteklerini tamamen kaldır
      try {
        // Önce sadece kontrol et, varsa getir
        const checkResponse = await fetch('/api/ImageCache', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageID: 'products',
            prompt: mainPrompt,
            checkOnly: true
          })
        });
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          
          if (checkData.success && checkData.image) {
            // Görsel zaten cache'de var, kullan
            console.log("Image found in backend cache, using cached image for:", product.productID);
            const imageUrl = `data:image/jpeg;base64,${checkData.image}`;
            
            // Ürünü güncelle
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.productID === product.productID 
                  ? { ...p, image: imageUrl } 
                  : p
              )
            );
            
            // Global cache'e ekle
            globalImageCache[mainPrompt] = imageUrl;
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
            return;
          }
        }
        
        // Cache'de yoksa, oluştur
        console.log("Image not found in cache, generating for:", product.productID);
        const generateResponse = await fetch('/api/ImageCache', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageID: 'products',
            prompt: mainPrompt,
            checkOnly: false
          })
        });
        
        if (generateResponse.ok) {
          // 200 OK - Resim bulundu veya oluşturuldu
          const data = await generateResponse.json();
          if (data.success && data.image) {
            console.log("Successfully retrieved or generated image for product:", product.productID);
            const imageUrl = `data:image/jpeg;base64,${data.image}`;
            
            // Ürünü güncelle
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.productID === product.productID 
                  ? { ...p, image: imageUrl } 
                  : p
              )
            );
            
            // Global cache'e ekle
            globalImageCache[mainPrompt] = imageUrl;
          } else {
            console.error("Failed to get image for product:", product.productID);
          }
        } else if (generateResponse.status === 409) {
          // 409 Conflict - Resim zaten var
          const data = await generateResponse.json();
          if (data.success && data.image) {
            console.log("Image already exists in cache for product:", product.productID);
            const imageUrl = `data:image/jpeg;base64,${data.image}`;
            
            // Ürünü güncelle
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.productID === product.productID 
                  ? { ...p, image: imageUrl } 
                  : p
              )
            );
            
            // Global cache'e ekle
            globalImageCache[mainPrompt] = imageUrl;
          }
        } else {
          console.error("Error getting image for product:", product.productID, generateResponse.status);
        }
      } catch (error) {
        console.error("Exception during image retrieval for product:", product.productID, error);
      }
      
      setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
    } catch (error) {
      console.error('Error in image process for product:', product.productID, error);
      setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
    }
  }, [categories, processedPrompts]);

  // Ürün resimleri için
  useEffect(() => {
    if (!loading && products.length > 0 && !imagesGenerated) {
      // Başlangıçta tüm ürünlerin yükleme durumunu false olarak ayarla
      const initialLoadingState: Record<number, boolean> = {};
      products.forEach(product => {
        initialLoadingState[product.productID] = false;
      });
      setLoadingImages(initialLoadingState);
      
      const productsNeedingImages = products.filter(p => 
        !p.image || 
        p.image === '/placeholder.png' || 
        p.image.includes('placeholder')
      );
      
      if (productsNeedingImages.length > 0) {
        console.log(`Found ${productsNeedingImages.length} products needing images`);
        
        // Görüntü oluşturma işlemlerini sırayla yap
        const generateImages = async () => {
          // Aynı anda en fazla 2 ürün için görsel oluştur (paralelleştirme)
          const batchSize = 2;
          
          // Maksimum 10 ürün için görsel oluştur, diğerleri için placeholder kullan
          const maxProducts = Math.min(productsNeedingImages.length, 10);
          
          for (let i = 0; i < maxProducts; i += batchSize) {
            const batch = productsNeedingImages.slice(i, i + batchSize);
            
            // Batch içindeki ürünler için paralel olarak görsel oluştur
            await Promise.all(batch.map(product => generateProductImage(product)));
            
            // API'ye yük bindirmeyi önlemek için daha uzun bir bekleme
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          // Kalan ürünler için placeholder kullan
          if (productsNeedingImages.length > maxProducts) {
            const remainingProducts = productsNeedingImages.slice(maxProducts);
            console.log(`Using placeholders for ${remainingProducts.length} remaining products`);
            
            setProducts(prevProducts => 
              prevProducts.map(p => {
                if (remainingProducts.some(rp => rp.productID === p.productID)) {
                  return { ...p, image: '/placeholder.png' };
                }
                return p;
              })
            );
          }
          
          // Tüm görüntüler oluşturuldu
          setImagesGenerated(true);
        };
        
        // İşlemi başlat
        generateImages();
      } else {
        // Hiç görüntü oluşturulmadı, ama işlem tamamlandı
        setImagesGenerated(true);
      }
    }
  }, [loading, products, imagesGenerated, generateProductImage]);

  // Marka seçildiğinde ürünleri filtrele
  const filteredProducts = products.filter((product) => {
    // Marka filtresi
    if (selectedBrands.length > 0) {
      const productStore = stores.find((s) => s.storeID === product.storeID);
      if (!productStore || !selectedBrands.includes(productStore.storeName)) {
        return false;
      }
    }

    // Fiyat aralığı filtresi
    if (product.price && (product.price < priceRange[0] || product.price > priceRange[1])) {
      return false;
    }

    return true;
  });

  // Ürünleri sırala
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'name-asc':
        return a.productName.localeCompare(b.productName);
      case 'name-desc':
        return b.productName.localeCompare(a.productName);
      default:
        return 0;
    }
  });

  const toggleCategory = (catId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleCategorySelect = (cat: Category) => {
    window.location.href = `/store/details/${cat.categoryID}`;
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol Sidebar - Kategoriler ve Filtreler */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.categoryID} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleCategorySelect(cat)}
                    className={`text-left ${cat.categoryID === categoryId ? 'font-bold text-blue-600' : ''}`}
                  >
                    {cat.categoryName}
                  </button>
                  <button
                    onClick={() => toggleCategory(cat.categoryID)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedCategories[cat.categoryID] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>
                {expandedCategories[cat.categoryID] && (
                  <ul className="pl-4 mt-2 space-y-1">
                    {/* Alt kategoriler burada listelenecek */}
                    {categories
                      .filter(subCat => subCat.storeID === cat.storeID && subCat.categoryID !== cat.categoryID)
                      .map(subCat => (
                        <li key={subCat.categoryID}>
                          <button 
                            onClick={() => handleCategorySelect(subCat)}
                            className={`text-sm ${subCat.categoryID === categoryId ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600`}
                          >
                            {subCat.categoryName}
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Marka Filtreleme */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Brands</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandSelect(brand)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700 flex items-center">
                    {selectedBrands.includes(brand) && (
                      <span className="text-blue-600 mr-1"><CheckIcon /></span>
                    )}
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fiyat Aralığı */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Price Range</h2>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
                className="w-24 p-2 border rounded"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
                className="w-24 p-2 border rounded"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Ürün Listesi */}
        <div className="w-full md:w-3/4">
          {/* Üst Kısım - Kategori Başlığı ve Sıralama */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold">
                {category ? category.categoryName : 'Category Not Found'}
              </h1>
              <div className="mt-4 md:mt-0 flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="p-2 pl-3 pr-10 border rounded-md text-sm appearance-none bg-white"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {sortOption === 'popularity' && <ArrowUpDownIcon />}
                    {sortOption === 'price-asc' && <ArrowUpIcon />}
                    {sortOption === 'price-desc' && <ArrowDownIcon />}
                    {sortOption === 'name-asc' && <ArrowUpIcon />}
                    {sortOption === 'name-desc' && <ArrowDownIcon />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ürün Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Yükleme durumunda gösterilecek içerik
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.productID} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product.productID}`}>
                    <div className="relative h-48 bg-gray-100">
                      {loadingImages[product.productID] ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : product.image ? (
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                        {product.productName}
                      </h3>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          {product.price ? `${product.price.toFixed(2)} TL` : 'Price not available'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {stores.find(s => s.storeID === product.storeID)?.storeName || 'Unknown Store'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
                  <p className="text-gray-500 max-w-md text-center">
                    We couldn't find any products in this category. Please try selecting a different category or check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 