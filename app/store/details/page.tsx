'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts, getStores } from '@/services/Category_Actions';
import { Product, Category, Store } from '@/app/product/[id]/types/Product';

export default function StoreDetailsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<string>('popularity');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData, storesData] = await Promise.all([
          getCategories(),
          getProducts(),
          getStores()
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
        setStores(storesData);

        // Kategori ID'si varsa, o kategoriyi seç
        if (categoryId) {
          const category = categoriesData.find((c: Category) => c.categoryID === parseInt(categoryId));
          if (category) {
            setSelectedCategory(category);
            setExpandedCategories(prev => ({ ...prev, [category.categoryID]: true }));
          }
        }

        // Markaları çıkar
        const uniqueBrands = Array.from(new Set(productsData.map((product: Product) => {
          const store = storesData.find((s: Store) => {
            // Burada ürünün mağazasını bulmak için bir mantık ekleyin
            // Örneğin, ürün-tedarikçi ilişkisi üzerinden
            return s.storeID === product.categoryID; // Bu sadece bir örnek, gerçek ilişkiye göre değiştirin
          });
          return store?.storeName || 'Unknown';
        }))) as string[];
        
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Kategori değiştiğinde ürünleri filtrele
  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = products.filter(
        (product) => product.categoryID === selectedCategory.categoryID
      );
      setProducts(filteredProducts);
    }
  }, [selectedCategory]);

  // Marka seçildiğinde ürünleri filtrele
  const filteredProducts = products.filter((product) => {
    // Marka filtresi
    if (selectedBrands.length > 0) {
      const productStore = stores.find((s) => s.storeID === product.categoryID);
      if (!productStore || !selectedBrands.includes(productStore.storeName)) {
        return false;
      }
    }

    // Fiyat aralığı filtresi
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Ürünleri sırala
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.productName.localeCompare(b.productName);
      case 'name-desc':
        return b.productName.localeCompare(a.productName);
      default:
        return 0;
    }
  });

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
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
        {/* Sol Sidebar - Kategoriler */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.categoryID} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className={`text-left ${selectedCategory?.categoryID === category.categoryID ? 'font-bold text-blue-600' : ''}`}
                  >
                    {category.categoryName}
                  </button>
                  <button
                    onClick={() => toggleCategory(category.categoryID)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedCategories[category.categoryID] ? (
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
                {expandedCategories[category.categoryID] && (
                  <ul className="pl-4 mt-2 space-y-1">
                    {/* Alt kategoriler burada listelenecek */}
                    <li>
                      <button className="text-sm text-gray-600 hover:text-blue-600">
                        Alt Kategori 1
                      </button>
                    </li>
                    <li>
                      <button className="text-sm text-gray-600 hover:text-blue-600">
                        Alt Kategori 2
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Marka Filtreleme */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Markalar</h2>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandSelect(brand)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fiyat Aralığı */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Fiyat Aralığı</h2>
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
                {selectedCategory ? selectedCategory.categoryName : 'Tüm Ürünler'}
              </h1>
              <div className="mt-4 md:mt-0 flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sırala:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="p-2 border rounded-md text-sm"
                >
                  <option value="popularity">Popülerlik</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="name-asc">İsim (A-Z)</option>
                  <option value="name-desc">İsim (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ürün Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.productID} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product.productID}`}>
                    <div className="relative h-48 bg-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-400">Resim Yok</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                        {product.productName}
                      </h3>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          {product.price.toFixed(2)} TL
                        </span>
                        <span className="text-xs text-gray-500">
                          {stores.find(s => s.storeID === product.categoryID)?.storeName || 'Bilinmeyen Mağaza'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Bu kriterlere uygun ürün bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
