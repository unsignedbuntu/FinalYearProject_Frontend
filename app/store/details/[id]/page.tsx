'use client';
import { useEffect, useState, useCallback, useRef, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProductsByCategoryId, getStores, getCategoriesById } from '@/services/API_Service';
import { Product, Store } from '@/app/product/[id]/types/Product';
import { basePrompts } from '@/app/product/[id]/data/basePrompts';
import { CategoryKey } from '@/app/product/[id]/data/basePrompts';

// Import necessary store hooks and actions, and icons
import { useCartActions } from '@/app/stores/cartStore';
import { useFavoritesStore, useFavoritesActions } from '@/app/stores/favoritesStore';
import { useUserStore } from '@/app/stores/userStore';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import FavoritesPageHover from '@/components/icons/FavoritesPageHover'; // Assuming this is the filled/active favorite icon
import CartHoverIcon from '@/components/icons/CartHover'; 
import CartFavoritesIcon from '@/components/icons/CartFavorites'; // Standard cart icon for product grids
import { toast } from 'react-hot-toast';
import CartIcon from '@/components/icons/CartIcon';

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

// Module-level cache and control variables (similar to the old working code)
const imageCache: Record<string, string> = {};
const processingPrompts = new Set<string>();
let imageGenerationInProgress = false;

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
  
  // States for hover effects on action buttons for each product
  const [hoveredFavoriteButtons, setHoveredFavoriteButtons] = useState<Record<number, boolean>>({});
  const [hoveredCartButtons, setHoveredCartButtons] = useState<Record<number, boolean>>({});

  // Store actions
  const { addItem: addToCartStore } = useCartActions();
  const { addProductToMainFavorites, removeProductFromMainFavorites } = useFavoritesActions();
  const { isFavorite } = useFavoritesStore();
  const { user } = useUserStore();

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

        // Initialize products with images from cache if available
        const categoryProducts = productsData.map((product: Product): ExtendedProduct => {
          let initialImage = product.image;
          try {
             const productCategory = categoriesData.find((c: Category) => c.categoryID === product.categoryID);
             const categoryName = productCategory?.categoryName || 'default';
             const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
             const mainPrompt = categoryPrompt.main(product.productName);
             if (imageCache[mainPrompt]) {
                 initialImage = imageCache[mainPrompt];
                 console.log(`🔄 Initializing product ${product.productID} with cached image.`);
             }
          } catch (e) {
             console.warn(`Could not determine initial image for ${product.productName}`, e);
          }
          return { ...product, image: initialImage };
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

  // Ürün resimleri için useEffect (Updated logic)
  useEffect(() => {
    // Use module-level flag
    if (loading || products.length === 0 || imageGenerationInProgress) {
      return;
    }

    console.log("📋 Checking products for image generation in CategoryDetailsPage");

    const initialLoadingState: Record<number, boolean> = {};
    products.forEach(product => {
      initialLoadingState[product.productID] = false;
    });
    setLoadingImages(initialLoadingState); // Initialize all to false

    // Check for products needing images based on current state and module-level cache
    const productsToProcessInitially = products.filter(p => {
        if (!p.image || p.image === '/placeholder.png' || p.image.includes('placeholder')) {
            try {
                const productCategory = categories.find((c: Category) => c.categoryID === p.categoryID);
                const categoryName = productCategory?.categoryName || 'default';
                const categoryPromptDef = basePrompts[categoryName as CategoryKey] || basePrompts.default;
                if (!categoryPromptDef || typeof categoryPromptDef.main !== 'function') {
                    console.warn(`❓ Could not find or use prompt function for category: ${categoryName}, product: ${p.productName} in CategoryDetailsPage filter`);
                    return false;
                }
                const mainPrompt = categoryPromptDef.main(p.productName);
                return !imageCache[mainPrompt] && !processingPrompts.has(mainPrompt);
            } catch (e) {
                console.warn(`Could not determine prompt for ${p.productName} in CategoryDetailsPage filter`, e);
                return false; // Don't process if prompt fails
            }
        }
        return false; // Already has a valid image
    });

    if (productsToProcessInitially.length > 0) {
      console.log(`🔍 Found ${productsToProcessInitially.length} products needing images in category ${categoryId} (CategoryDetailsPage)`);
      imageGenerationInProgress = true;

      const generateImages = async () => {
        try {
          for (const product of productsToProcessInitially) {
            if (!imageGenerationInProgress) { // Check flag before processing each product
                console.log("🛑 Image generation process was stopped externally in CategoryDetailsPage.");
                break; // Exit loop if flag is false
            }

            const productCategory = categories.find((c: Category) => c.categoryID === product.categoryID);
            const categoryName = productCategory?.categoryName || 'default';
            const categoryPromptDef = basePrompts[categoryName as CategoryKey] || basePrompts.default;

            if (!categoryPromptDef || typeof categoryPromptDef.main !== 'function') {
              console.warn(`❓ Could not find or use prompt function for category: ${categoryName}, product: ${product.productName} in CategoryDetailsPage loop`);
              continue; // Skip this product
            }
            const mainPrompt = categoryPromptDef.main(product.productName);

            // Double check cache and processing status just before the async call
            if (imageCache[mainPrompt]) {
              console.log(`⏭️ Product ${product.productID} (${product.productName}) already in imageCache. Updating state if needed. (CategoryDetailsPage)`);
              if (!product.image || product.image.includes('placeholder')) {
                setProducts(prevProducts =>
                  prevProducts.map(p =>
                    p.productID === product.productID ? { ...p, image: imageCache[mainPrompt] } : p
                  )
                );
              }
              continue; // Already cached
            }

            if (processingPrompts.has(mainPrompt)) {
              console.log(`⏭️ Product ${product.productID} (${product.productName}) is already being processed (in processingPrompts). Skipping. (CategoryDetailsPage)`);
              continue; // Already processing
            }

            console.log(`🔄 Processing product ${product.productName} (ID: ${product.productID}) (CategoryDetailsPage)`);
            setLoadingImages(prev => ({ ...prev, [product.productID]: true }));
            processingPrompts.add(mainPrompt); // Add to set before starting fetch

            try {
              console.log("📡 Sending API request for image generation (CategoryDetailsPage):", product.productID, "Prompt:", mainPrompt);
              const response = await fetch('/api/ImageCache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: mainPrompt,
                    entityType: "Product",
                    entityId: product.productID,
                    checkOnly: false
                }),
              });

              console.log(`📬 Received API response for product ${product.productID}. Status: ${response.status}, OK: ${response.ok} (CategoryDetailsPage)`);

              if (response.ok) {
                const data = await response.json();
                console.log(`📦 Parsed API response data for product ${product.productID}:`, data, "(CategoryDetailsPage)");

                if (data.success && data.image) {
                  console.log("✅ Successfully retrieved or generated image for product:", product.productID, "(CategoryDetailsPage)");
                  const imageUrl = `data:image/jpeg;base64,${data.image}`;

                  if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                     imageCache[mainPrompt] = imageUrl;
                     console.log(`💾 Added image to module cache for prompt: ${mainPrompt} (CategoryDetailsPage)`);
                  }

                  setProducts(prevProducts =>
                    prevProducts.map(p =>
                      p.productID === product.productID ? { ...p, image: imageUrl } : p
                    )
                  );
                } else {
                  console.error(`❌ API reported success=false or missing image for product ${product.productID}. Data:`, data, "(CategoryDetailsPage)");
                }
              } else {
                let errorBody = 'Could not read error body';
                try { errorBody = await response.text(); } catch (e) { console.warn("Could not read error body text", e); }
                console.error(`❌ API Error for product ${product.productID}: Status ${response.status}. Body:`, errorBody, "(CategoryDetailsPage)");
              }
            } catch (error) {
              console.error(`❌ Exception during fetch for product ${product.productID}:`, error, "(CategoryDetailsPage)");
            } finally {
              setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
              processingPrompts.delete(mainPrompt); // Remove from set after attempt (success or fail)
              console.log(`📊 Finished attempt for product ${product.productName}. Prompt removed: ${mainPrompt}. (CategoryDetailsPage)`);
            }
            
            // Optional delay between processing each product
            if (imageGenerationInProgress) { // Only delay if still supposed to be running
                await new Promise(resolve => setTimeout(resolve, 750)); // Slightly increased delay
            }
          } // End of for...of loop

          console.log("🎉 Image generation loop finished for this batch in CategoryDetailsPage.");
        } catch (error) {
          console.error("❌ Error in image generation process (CategoryDetailsPage):", error);
        } finally {
          imageGenerationInProgress = false;
          console.log("🏁 Image generation process ended for CategoryDetailsPage.");
        }
      };

      generateImages();
    } else {
        console.log("📷 No images need generation based on current state and cache in CategoryDetailsPage.");
        if (imageGenerationInProgress) {
            imageGenerationInProgress = false; // Ensure flag is reset if no generation was triggered
        }
    }
  }, [loading, products, categories, categoryId]); // Keep dependencies as they are, internal logic handles re-triggering issues

  // Cleanup useEffect (Updated)
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up image generation state for category", categoryId);
      // Signal the running process to stop if component unmounts
      imageGenerationInProgress = false;
      // We generally don't clear processingPrompts here,
      // as another component instance might be processing the same prompt.
      // The check at the beginning of the loop handles this.
      // We also don't clear the imageCache here, as it's meant to persist.
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

  // =========================================================================
  // Helpful functions before return function
  // =========================================================================

  const renderProductImage = (product: any) => {
    // 1. Durum: Resim yükleniyorsa spinner göster
    if (loadingImages[product.productID]) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Geçerli bir görsel var mı?
    const hasValidImage = product.image && !product.image.includes('placeholder') && product.image !== '/placeholder.png';

    // 2. Durum: Gerçek bir resim varsa onu göster
    if (hasValidImage) {
      return (
        <Image
          src={product.image}
          alt={product.productName}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={product.image.startsWith('data:')}
        />
      );
    }

    // 3. Durum: Resim yoksa veya hatalıysa "Görsel Yok" yazısını göster
    return (
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs px-2 text-center">
        <span>Görsel Yok</span>
      </div>
    );
  };

  const renderContent = () => {
    // 1. Durum: Sayfa ilk açılırken (Yükleniyor iskeleti)
    if (loading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ));
    }

    // 2. Durum: Ürünler başarıyla yüklendiyse kartları çiz
    if (sortedProducts.length > 0) {
      return sortedProducts.map((product) => {
        const productIsFavorite = isFavorite(product.productID);
        
        return (
          <div key={product.productID} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow relative group">
            <Link href={`/product/${product.productID}`} className="block">
              <div className="relative h-48 bg-gray-100">
                {/* Resmi çizen fonksiyonu çağırıyoruz */}
                {renderProductImage(product)}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-1" title={product.productName}>
                  {product.productName}
                </h3>
                {product.storeName && (
                  <p className="text-xs text-gray-500 mb-1 truncate" title={product.storeName}>
                    {product.storeName}
                  </p>
                )}
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price ? `${product.price.toFixed(2)} TL` : <span className="text-sm text-gray-500">Fiyat Yok</span>}
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Favori ve Sepete Ekle Butonları */}
            <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) { toast.error("Please log in to manage favorites."); return; }
                  if (productIsFavorite) {
                    removeProductFromMainFavorites(product.productID);
                  } else {
                    addProductToMainFavorites(product.productID);
                  }
                }}
                onMouseEnter={() => setHoveredFavoriteButtons(prev => ({ ...prev, [product.productID]: true }))}
                onMouseLeave={() => setHoveredFavoriteButtons(prev => ({ ...prev, [product.productID]: false }))}
                className={`p-2 rounded-full transition-colors shadow-sm ${
                  productIsFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : hoveredFavoriteButtons[product.productID] 
                      ? 'bg-red-100 text-red-500' 
                      : 'bg-white text-gray-500 hover:bg-red-100 hover:text-red-500'
                }`}
                title={productIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                {productIsFavorite || hoveredFavoriteButtons[product.productID] ? (
                  <FavoritesPageHover width={24} height={24} /> 
                ) : (
                  <FavoriteIcon width={24} height={24} />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) { toast.error("Please log in to add to cart."); return; }
                  addToCartStore({ productId: product.productID, quantity: 1 });
                  toast.success(`${product.productName} added to cart.`);
                }}
                onMouseEnter={() => setHoveredCartButtons(prev => ({ ...prev, [product.productID]: true }))}
                onMouseLeave={() => setHoveredCartButtons(prev => ({ ...prev, [product.productID]: false }))}
                className={`p-2 rounded-full transition-colors shadow-sm ${
                  hoveredCartButtons[product.productID]
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-500'
                }`}
                disabled={(product.stockQuantity ?? 0) === 0}
                title={(product.stockQuantity ?? 0) === 0 ? "Out of stock" : "Add to Cart"}
              >
                {hoveredCartButtons[product.productID] ? (
                  <CartHoverIcon width={32} height={32} />
                ) : (
                  <CartIcon width={24} height={24} />
                )}
              </button>
            </div>
          </div>
        );
      });
    }

    // 3. Durum: Ürün Yoksa
    return (
      <div className="col-span-full text-center py-12">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl font-semibold text-gray-700 mb-2">Hiç ürün bulunamadı</p>
          <p className="text-gray-500 max-w-md text-center">
            Seçili filtrelerle eşleşen ürün bulunamadı. Filtrelerinizi değiştirmeyi veya başka bir kategoriyi kontrol etmeyi deneyin.
          </p>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 2. MAIN STRUCTURE FWAK
  // =========================================================================
  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol Sidebar - Kategoriler ve Filtreler */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
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

          {/* Ürün Grid - İŞTE SİHİR BURADA, BÜTÜN KARMAŞAYI TEK SATIRA İNDİRDİK! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
} 