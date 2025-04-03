'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts, getStores, getCategoriesById } from '@/services/API_Service';
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

// İşlenmekte olan promptları takip etmek için global bir set
const processingPrompts = new Set<string>();

// Sayfa yüklemesi arasında istek durumunu korumak için
let imageGenerationInProgress = false;

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

  // Data yükleme işlemi için useEffect
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
        
        // Tüm ürünleri yükle, filtreleme yapmadan
        const allProducts = productsData.map((product: Product) => {
          // Ürünün mağaza ID'sini bul
          const productCategory = categoriesData.find((c: Category) => c.categoryID === product.categoryID);
          const storeID = productCategory ? productCategory.storeID : 1; // Varsayılan olarak 1 kullan
          
          return {
            ...product,
            storeID: storeID
          };
        });
        
        // Seçili kategoriye ait ürünleri filtrele
        const filteredProducts = allProducts.filter((product: ExtendedProduct) => product.categoryID === categoryId);
        
        console.log(`Found ${filteredProducts.length} products for category ${categoryId}`);
        setProducts(filteredProducts); // Sadece filtrelenmiş ürünleri state'e kaydet
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

  // Ürün resimleri için useEffect - gönderdiğiniz çalışan koddan uyarlandı
  useEffect(() => {
    if (!loading && products.length > 0 && !imagesGenerated && !imageGenerationInProgress) {
      console.log("📋 Checking products for image generation");
      
      // Başlangıçta tüm ürünlerin yükleme durumunu false olarak ayarla
      const initialLoadingState: Record<number, boolean> = {};
      products.forEach(product => {
        initialLoadingState[product.productID] = false;
      });
      setLoadingImages(initialLoadingState);
      
      // Sadece seçili kategoriye ait ürünleri filtrele
      const categoryProducts = products.filter(p => p.categoryID === categoryId);
      console.log(`📋 Filtered ${categoryProducts.length} products for category ${categoryId}`);
      
      // Görseli olmayan veya placeholder olan ürünleri filtrele
      const productsNeedingImages = categoryProducts.filter(p => 
        !p.image || 
        p.image === '/placeholder.png' || 
        p.image.includes('placeholder')
      );
      
      if (productsNeedingImages.length > 0) {
        console.log(`🔍 Found ${productsNeedingImages.length} products needing images in category ${categoryId}`);
        
        // Global flag'i true yaparak işlemin başladığını belirt
        imageGenerationInProgress = true;
        
        // Görüntü oluşturma işlemlerini sırayla yap
        const generateImages = async () => {
          try {
            // İşlenen ürün sayısını takip et
            let processedCount = 0;
            
            // Tüm promptları önceden hazırla ve kontrol et
            const productsToProcess: ExtendedProduct[] = [];
            const promptsToProcess: string[] = [];
            
            // Önce hangi ürünlerin işlenmesi gerektiğini belirle
            for (const product of productsNeedingImages) {
              // Kategori adını belirle
              let productCategory = categories.find((c: Category) => c.categoryID === product.categoryID);
              const categoryName = productCategory?.categoryName || 'default';
              const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
              const mainPrompt = categoryPrompt.main(product.productName);
              
              // Eğer bu prompt daha önce işlendiyse veya şu anda işleniyorsa, atla
              if (processedPrompts.has(mainPrompt) || processingPrompts.has(mainPrompt)) {
                console.log(`⏭️ Skipping product ${product.productID} - prompt already processed or currently processing`);
                continue;
              }
              
              // Eğer global cache'de varsa, ürünü güncelle ve devam et
              if (globalImageCache[mainPrompt]) {
                console.log(`💾 Using cached image for product ${product.productID}`);
                
                setProducts(prevProducts => 
                  prevProducts.map(p => 
                    p.productID === product.productID 
                      ? { ...p, image: globalImageCache[mainPrompt] } 
                      : p
                  )
                );
                
                // Bu promptu işlenmiş olarak işaretle
                setProcessedPrompts(prev => new Set([...prev, mainPrompt]));
                continue;
              }
              
              // Bu ürün ve prompt işlenecek
              productsToProcess.push(product);
              promptsToProcess.push(mainPrompt);
              
              // İşlenecek ürünü önceden işaretleyelim
              processingPrompts.add(mainPrompt);
            }
            
            console.log(`📊 Will process ${productsToProcess.length} products after filtering already processed ones`);
            
            // Hiç işlenecek ürün yoksa bitir
            if (productsToProcess.length === 0) {
              console.log("✅ No products to process, all products either have images or are being processed");
              setImagesGenerated(true);
              imageGenerationInProgress = false;
              return;
            }
            
            // Şimdi sırayla işle
            for (let i = 0; i < productsToProcess.length; i++) {
              const product = productsToProcess[i];
              const prompt = promptsToProcess[i];
              
              // Bu promptu işlenmiş olarak işaretle
              setProcessedPrompts(prev => new Set([...prev, prompt]));
              
              // Görüntü oluştur
              console.log(`🔄 Processing product ${processedCount + 1}/${productsToProcess.length}: ${product.productName}`);
              setLoadingImages(prev => ({ ...prev, [product.productID]: true }));
              
              try {
                // Doğrudan POST isteği yap - resim varsa backend'de kontrol edilecek
                console.log("📡 Sending API request for image generation:", product.productID);
                const response = await fetch('/api/ImageCache', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    pageID: 'products',
                    prompt: prompt,
                    checkOnly: false
                  }),
                  cache: 'no-store' // Cache'lemeyi devre dışı bırak
                });
                
                if (response.ok) {
                  // 200 OK - Resim bulundu veya oluşturuldu
                  const data = await response.json();
                  console.log("📥 API response for product:", product.productID, "success:", data.success);
                  
                  if (data.success && data.image) {
                    console.log("✅ Successfully retrieved or generated image for product:", product.productID);
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
                    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                      globalImageCache[prompt] = imageUrl;
                      console.log(`💾 Added image to global cache for product ${product.productID}`);
                    }
                  } else {
                    console.error("❌ Failed to get image for product:", product.productID);
                  }
                } else {
                  console.error("❌ Error getting image for product:", product.productID, response.status);
                }
              } catch (error) {
                console.error("❌ Exception during image retrieval for product:", product.productID, error);
              } finally {
                // İşleme tamamlandı, yükleme durumunu güncelle
                setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
                // İşleme setinden kaldır
                processingPrompts.delete(prompt);
              }
              
              // İşlenen ürün sayısını artır
              processedCount++;
              console.log(`📊 Processed ${processedCount}/${productsToProcess.length} products`);
              
              // API'ye yük bindirmeyi önlemek için daha uzun bir bekleme
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle
            }
            
            // Tüm görüntüler oluşturuldu
            console.log("🎉 All images have been generated successfully");
            setImagesGenerated(true);
          } catch (error) {
            console.error("❌ Error in image generation process:", error);
          } finally {
            // İşlem bitti, global flag'i false yap
            imageGenerationInProgress = false;
          }
        };
        
        // İşlemi başlat
        generateImages();
      } else {
        // Hiç görüntü oluşturulmadı, ama işlem tamamlandı
        setImagesGenerated(true);
        console.log("📷 No images needed generation, all products have images");
      }
    }
  }, [loading, products, imagesGenerated, categories, processedPrompts, categoryId]);

  // Sayfa yeniden yüklendiğinde veya başka bir kategoriye geçildiğinde temizlik yap
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up image generation process for category", categoryId);
      
      // İşlenmekte olan promptları temizle
      processingPrompts.clear();
      
      // Kategoriler arası geçişlerde global flag'i de sıfırla
      imageGenerationInProgress = false;
    };
  }, [categoryId]);

  // Marka seçildiğinde ürünleri filtrele
  const filteredProducts = products.filter((product) => {
    // Önce kategori filtresi uygula - sadece seçili kategoriye ait ürünleri göster
    if (product.categoryID !== categoryId) {
      return false;
    }
    
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
                  <ul className="pl-4 mt-2 space-y-1 max-h-[300px] overflow-y-auto">
                    {/* Kategoriye ait tüm ürünleri listele, sınırlama olmadan */}
                    {products
                      .filter(product => product.categoryID === cat.categoryID)
                      .map(product => (
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
                    }
                    {products.filter(product => product.categoryID === cat.categoryID).length === 0 && (
                      <li className="text-sm text-gray-500 py-2 flex items-center">
                        <Link 
                          href={`/store/details/${cat.categoryID}`}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Bu kategorideki tüm ürünleri görüntüle
                        </Link>
                      </li>
                    )}
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
                      ) : product.image && !product.image.includes('placeholder') && product.image !== '/placeholder.png' ? (
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={product.image.startsWith('data:')} // Base64 görüntüler için optimizasyonu devre dışı bırak
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