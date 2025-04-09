'use client';
import { useEffect, useState, useCallback, useRef, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProductsByCategoryId, getStores, getCategoriesById } from '@/services/API_Service';
import { Product, Category, Store } from '@/app/product/[id]/types/Product';
import { basePrompts } from '@/app/product/[id]/data/basePrompts';
import { CategoryKey } from '@/app/product/[id]/data/basePrompts';

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
  // Artık backendden geliyorsa storeID'ye gerek yok gibi, ama Product type'ında zorunlu, kalsın.
}

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const categoryId = parseInt(resolvedParams.id);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ExtendedProduct[]>([]); // Burası artık doğrudan kategorinin ürünlerini tutacak
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<string>('popularity');
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [imagesGenerated, setImagesGenerated] = useState(false);
  
  // State/Ref olarak tanımlanan cache ve kontrol değişkenleri
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const processingPromptsRef = useRef<Set<string>>(new Set());
  const imageGenerationInProgressRef = useRef<boolean>(false);

  // Data yükleme işlemi için useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [categoryData, productsData, categoriesData, storesData] = await Promise.all([
          getCategoriesById(categoryId),
          getProductsByCategoryId(categoryId), 
          getCategories(),
          getStores()
        ]);

        setCategory(categoryData);
        setCategories(categoriesData);
        setStores(storesData); 

        const categoryProducts = productsData.map((product: Product): ExtendedProduct => {
          return product; 
        });
        
        console.log(`Loaded ${categoryProducts.length} products directly for category ${categoryId}`);
        setProducts(categoryProducts); 
        
        setExpandedCategories({ [categoryId]: true });

        // Markaları çıkar (storeName üründe varsa doğrudan kullan, yoksa stores listesinden bul)
        const uniqueBrands = Array.from(new Set(categoryProducts.map((product: ExtendedProduct) => {
          // storeName artık üründe geliyor, onu kullanalım
          return product.storeName || 'Unknown'; 
        }))).filter(brand => brand !== 'Unknown') as string[];
        
        setBrands(uniqueBrands);
        
        // Fiyat aralığını belirle
        if (categoryProducts.length > 0) {
          const prices = categoryProducts
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

  // Ürün resimleri için useEffect
  useEffect(() => {
    // Ref değerini kontrol et
    if (loading || imagesGenerated || imageGenerationInProgressRef.current) {
      return; // Yükleniyorsa, tamamlandıysa veya zaten işlemdeyse bir şey yapma
    }
    
    if (products.length > 0) {
      console.log("📋 Checking products for image generation");
      
      const initialLoadingState: Record<number, boolean> = {};
      products.forEach(product => {
        initialLoadingState[product.productID] = false;
      });
      setLoadingImages(initialLoadingState);
      
      const productsNeedingImages = products.filter(p => 
        !p.image || 
        p.image === '/placeholder.png' || 
        p.image.includes('placeholder') ||
        !imageCache[basePrompts[p.categoryName as CategoryKey || 'default']?.main(p.productName)] // Cache'de yoksa
      );
      
      if (productsNeedingImages.length > 0) {
        console.log(`🔍 Found ${productsNeedingImages.length} products needing images in category ${categoryId}`);
        
        // Ref değerini true yap
        imageGenerationInProgressRef.current = true;
        
        const generateImages = async () => {
          try {
            let processedCount = 0;
            const productsToProcess: ExtendedProduct[] = [];
            const promptsToProcess: string[] = [];
            
            for (const product of productsNeedingImages) {
              let productCategory = categories.find((c: Category) => c.categoryID === product.categoryID); 
              const categoryName = productCategory?.categoryName || 'default';
              const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
              // Prompt oluştururken hata olmaması için kontrol
              if (!categoryPrompt || typeof categoryPrompt.main !== 'function') {
                console.warn(`❓ Could not find or use prompt function for category: ${categoryName}, product: ${product.productName}`);
                continue;
              }
              const mainPrompt = categoryPrompt.main(product.productName);
              
              // Ref'teki seti kontrol et
              if (processingPromptsRef.current.has(mainPrompt)) {
                console.log(`⏭️ Skipping product ${product.productID} - prompt currently processing`);
                continue;
              }
              
              // State'teki cache'i kontrol et
              if (imageCache[mainPrompt]) {
                console.log(`💾 Using cached image from state for product ${product.productID}`);
                // Eğer üründe hala placeholder varsa, cache'deki ile güncelle (bu normalde olmamalı ama garanti)
                setProducts(prevProducts => 
                  prevProducts.map(p => 
                    p.productID === product.productID && (!p.image || p.image.includes('placeholder'))
                      ? { ...p, image: imageCache[mainPrompt] } 
                      : p
                  )
                );
                continue; // Cache'de varsa işleme ekleme
              }
              
              productsToProcess.push(product);
              promptsToProcess.push(mainPrompt);
              // Ref'teki sete ekle
              processingPromptsRef.current.add(mainPrompt);
            }
            
            console.log(`📊 Will process ${productsToProcess.length} products after filtering already processed/cached ones`);
            
            if (productsToProcess.length === 0) {
              console.log("✅ No products to process, all products either have images or are being processed/cached");
              setImagesGenerated(true);
              imageGenerationInProgressRef.current = false; // Ref'i false yap
              return;
            }
            
            for (let i = 0; i < productsToProcess.length; i++) {
               // Döngü başlamadan önce flag'i tekrar kontrol et (başka bir işlem başlatmış olabilir)
              if (!imageGenerationInProgressRef.current) {
                console.log("🛑 Image generation process was stopped externally.");
                break; 
              }

              const product = productsToProcess[i];
              const prompt = promptsToProcess[i];
              
              console.log(`🔄 Processing product ${processedCount + 1}/${productsToProcess.length}: ${product.productName}`);
              setLoadingImages(prev => ({ ...prev, [product.productID]: true }));
              
              try {
                console.log("📡 Sending API request for image generation:", product.productID);
                // NOT: Backend loglarındaki uyarıya göre, belki burada GET denemek daha iyi olabilir?
                // Şimdilik POST ile devam edelim, ama sorun sürerse burayı değiştirebiliriz.
                const response = await fetch('/api/ImageCache', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pageID: 'products', prompt: prompt, checkOnly: false }),
                  cache: 'no-store' 
                });
                
                if (response.ok) {
                  const data = await response.json();
                  console.log("📥 API response for product:", product.productID, "success:", data.success);
                  
                  if (data.success && data.image) {
                    console.log("✅ Successfully retrieved or generated image for product:", product.productID);
                    const imageUrl = `data:image/jpeg;base64,${data.image}`;
                    
                    // Önce state'deki cache'i güncelle
                    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                       setImageCache(prevCache => ({ ...prevCache, [prompt]: imageUrl }));
                       console.log(`💾 Added image to state cache for product ${product.productID}`);
                    }

                    // Sonra product state'ini güncelle
                    setProducts(prevProducts => 
                      prevProducts.map(p => 
                        p.productID === product.productID 
                          ? { ...p, image: imageUrl } 
                          : p
                      )
                    );
                    
                  } else {
                    console.error("❌ Failed to get image data from API response for product:", product.productID, "Response data:", data);
                  }
                } else {
                  console.error("❌ Error response from API for product:", product.productID, "Status:", response.status);
                }
              } catch (error) {
                console.error("❌ Exception during image retrieval for product:", product.productID, error);
              } finally {
                setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
                // Ref'teki setten kaldır
                processingPromptsRef.current.delete(prompt);
              }
              
              processedCount++;
              console.log(`📊 Processed ${processedCount}/${productsToProcess.length} products`);
              // Gecikmeyi koruyalım
              await new Promise(resolve => setTimeout(resolve, 500)); // Biraz kısalttım
            }
            
            console.log("🎉 Image generation loop finished");
            setImagesGenerated(true); // Tüm potansiyel ürünler işlendi
          } catch (error) {
            console.error("❌ Error in image generation process:", error);
          } finally {
            // Ref'i false yap
            imageGenerationInProgressRef.current = false;
            console.log("🏁 Image generation process ended.");
          }
        };
        
        generateImages();
      } else {
        // Hiç görüntüye ihtiyaç yoksa, işlemi tamamlanmış say
        if (!imagesGenerated) {
             console.log("📷 No images needed generation based on current state and cache.");
             setImagesGenerated(true);
        }
      }
    }
    // Bağımlılıkları optimize et: products ve categoryId değiştiğinde veya loading bittiğinde tetiklenmeli.
    // imagesGenerated'ı kaldırdık çünkü effect kendi içinde bunu set ediyor.
    // categories listesi değişirse de promptlar için gerekli olabilir.
  }, [loading, products, categories, categoryId, imageCache]); 

  // Sayfa yeniden yüklendiğinde veya başka bir kategoriye geçildiğinde temizlik yap
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up image generation state for category", categoryId);
      // Component unmount olduğunda veya categoryId değiştiğinde işlemi durdur
      imageGenerationInProgressRef.current = false;
      // İşlemdeki promptları temizle (opsiyonel, belki devam etmesi gereken durumlar olabilir? Şimdilik temizleyelim)
      processingPromptsRef.current.clear();
      // imagesGenerated state'ini sıfırla ki yeni kategori için tekrar başlasın
      setImagesGenerated(false); 
    };
  }, [categoryId]);

  // Marka seçildiğinde ürünleri filtrele
  const filteredProducts = products.filter((product) => {
    // Marka filtresi (Doğrudan product.storeName kullan)
    if (selectedBrands.length > 0) {
      if (!product.storeName || !selectedBrands.includes(product.storeName)) {
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
    // Kategori tıklandığında, otomatik olarak genişlet/daralt
    toggleCategory(cat.categoryID);
    
    // Eğer farklı bir kategori seçildiyse, o kategoriye git
    if (cat.categoryID !== categoryId) {
      window.location.href = `/store/details/${cat.categoryID}`;
    }
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
    <div className="container mx-auto px-4 py-8 flex-1">
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
                {expandedCategories[cat.categoryID] && cat.categoryID === categoryId && (
                  <ul className="pl-4 mt-2 space-y-1 max-h-[300px] overflow-y-auto">
                    {products.length > 0 ? (
                      products.map(product => (
                        <li key={product.productID}>
                          <Link 
                            href={`/product/${product.productID}`}
                            className="text-sm text-gray-600 hover:text-blue-600 flex items-center py-1"
                          >
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            {product.productName}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 italic py-1">Bu kategoride ürün yok.</li>
                    )}
                  </ul>
                )}
                {expandedCategories[cat.categoryID] && cat.categoryID !== categoryId && (
                   <div className="pl-4 mt-2">
                       <Link 
                          href={`/store/details/${cat.categoryID}`}
                          className="text-sm text-blue-600 hover:underline flex items-center py-1"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          See products in this category
                        </Link>
                   </div>
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
                      ) : product.image && !product.image.includes('placeholder') && product.image !== '/placeholder.png' ? (
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={product.image.startsWith('data:')}
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
                          {product.storeName || 'Unknown Store'}
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