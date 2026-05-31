"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import TicIcon from '../icons/TicIcon'
import TicHover from '../icons/Tic_Hover'
import ArrowRight from '../icons/ArrowRight'
import { getStores, getCategories, getProducts } from '@/services/API_Service'
import { useUIStore } from '@/app/stores/uiStore'

interface Store {
  storeID: number;
  storeName: string;
}

interface Category {
  categoryID: number;
  categoryName: string;
  storeName: string;
}

interface Product {
  productID: number;
  productName: string;
  categoryName: string;
  storeName: string;
}

export default function StoresMegaMenu() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOpen = useUIStore((state) => state.isStoresMegaMenuOpen);
  const closeMenu = useUIStore((state) => state.closeStoresMegaMenu);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [storesData, categoriesData, productsData] = await Promise.all([
          getStores(),
          getCategories(),
          getProducts()
        ]);

        if (Array.isArray(storesData)) {
          // Çift mağazaları filtrele
          const uniqueStores = storesData.filter(
            (store, index, self) =>
              index === self.findIndex((s) => s.storeID === store.storeID)
          );
          setStores(uniqueStores);
          if (uniqueStores.length > 0) setSelectedStore(uniqueStores[0]);
        }

        if (Array.isArray(categoriesData)) setCategories(categoriesData);
        if (Array.isArray(productsData)) setProducts(productsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    useUIStore.getState().openStoresMegaMenu();
  }, [timeoutId]);

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
      closeMenu();
    }, 300);
    setTimeoutId(id);
  }, [closeMenu]);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleStoreHover = (store: Store) => {
    if (timeoutId) clearTimeout(timeoutId);
    setSelectedStore(store);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mouseover', handleClickOutside);
    return () => document.removeEventListener('mouseover', handleClickOutside);
  }, [closeMenu]);

  return (
    <div 
      ref={menuRef}
      className="relative"
      onMouseLeave={handleMouseLeave}
    >
      <button
        onMouseEnter={handleMouseEnter}
        className="h-[47px] w-[180px] flex items-center group-hover:justify-start pl-4 rounded-lg text-black hover:bg-opacity-40 transition-all group relative"
        style={{ backgroundColor: 'rgba(255, 255, 0, 0.35)' }}
      >
        <span className="font-satisfy text-2xl group-hover:text-[#FF9D00] group-hover:text-[28px] transition-all">
          Stores
        </span>
        <span className="absolute right-2 group-hover:hidden">
          <TicIcon />
        </span>
        <span className="absolute right-2 hidden group-hover:block">
          <TicHover />
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onMouseEnter={handleMouseLeave}
          />

          {/* DÜZELTİLEN YER: left:-750px yerine ekranın tam ortasına hizalandı */}
          <div
            className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1400px] bg-white shadow-2xl rounded-xl p-8 z-50 flex min-h-[600px] max-h-[80vh] overflow-hidden"
            onMouseEnter={handleMouseEnter}
          >
            {isLoading ? (
              <div className="flex justify-center items-center w-full">
                <span className="text-gray-500 text-xl font-bold">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center w-full">
                <span className="text-red-500 text-xl font-bold">{error}</span>
              </div>
            ) : (
              <div className="flex w-full h-full">
                {/* Mağazalar Listesi (Sol Sütun) */}
                <div className="w-1/4 border-r border-gray-200 pr-6 overflow-y-auto">
                  <h2 className="font-bold text-2xl text-[#FF9D00] mb-6">Stores</h2>
                  <div className="flex flex-col gap-2">
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <div
                          key={store.storeID}
                          className={`py-3 px-4 hover:bg-gray-100 cursor-pointer rounded-lg group/store transition-all ${selectedStore?.storeID === store.storeID ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                          onMouseEnter={() => handleStoreHover(store)}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${selectedStore?.storeID === store.storeID ? 'text-blue-700' : 'text-gray-700'}`}>
                              {store.storeName}
                            </span>
                            <ArrowRight className={`w-5 h-5 transition-colors ${selectedStore?.storeID === store.storeID ? 'text-blue-700' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No stores available</div>
                    )}
                  </div>
                </div>

                {/* Kategoriler ve Ürünler (Sağ Taraf) */}
                {selectedStore && (
                  <div className="w-3/4 pl-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">{selectedStore.storeName} Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      
                      {categories
                        .filter(category => category.storeName === selectedStore.storeName)
                        .map((category) => (
                          <div key={category.categoryID} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-xl text-[#FF9D00] mb-4">
                              <Link href={`/store/details/${category.categoryID}`} className="hover:text-blue-600 transition-colors">
                                {category.categoryName}
                              </Link>
                            </h3>
                            <ul className="space-y-3">
                              {products
                                .filter(product => 
                                  product.categoryName === category.categoryName && 
                                  product.storeName === selectedStore.storeName 
                                )
                                .slice(0, 5) // 5 ürün göster
                                .map((product) => (
                                  <li key={product.productID} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                    <Link 
                                      href={`/product/${product.productID}`}
                                      className="text-gray-700 hover:text-blue-600 hover:font-medium transition-all text-sm truncate"
                                    >
                                      {product.productName}
                                    </Link>
                                  </li>
                                ))}

                              {/* Ürün Fazlaysa View All Yazısı */}
                              {products.filter(product => 
                                product.categoryName === category.categoryName && 
                                product.storeName === selectedStore.storeName
                              ).length > 5 && (
                                <li className="pt-2 border-t border-gray-200 mt-2">
                                  <Link 
                                    href={`/store/details/${category.categoryID}`}
                                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
                                  >
                                    View all products <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </li>
                              )}

                              {/* Ürün Yoksa */}
                              {products.filter(product => 
                                product.categoryName === category.categoryName && 
                                product.storeName === selectedStore.storeName
                              ).length === 0 && (
                                <li className="text-sm text-gray-400 italic">No products found.</li>
                              )}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}