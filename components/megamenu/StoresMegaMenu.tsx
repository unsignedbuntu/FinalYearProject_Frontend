"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import TicIcon from '../icons/TicIcon'
import TicHover from '../icons/Tic_Hover'
import ArrowRight from '../icons/ArrowRight'
<<<<<<< HEAD
import { getStores, getCategories, getProducts } from '@/services/API_Service'
import { useUIStore } from '@/app/stores/uiStore'
=======
import { getStores, getCategories, getProducts } from '@/services/Category_Actions'
>>>>>>> main

interface Store {
  storeID: number;
  storeName: string;
<<<<<<< HEAD
  // categories?: Category[]; // This might not be directly linkable anymore
=======
  categories?: Category[];
>>>>>>> main
}

interface Category {
  categoryID: number;
  categoryName: string;
<<<<<<< HEAD
  storeName: string; // API returns storeName, not storeID
  // storeID: number; 
  // products?: Product[];
=======
  storeID: number;
  products?: Product[];
>>>>>>> main
}

interface Product {
  productID: number;
  productName: string;
<<<<<<< HEAD
  // categoryID: number; // API returns categoryName
  // storeID: number; // API returns storeName
  categoryName: string; // Use names from API
  storeName: string; // Use names from API
  price?: number; 
  image?: string;
  stockQuantity?: number; // Add other fields from API if needed
  barcode?: string;
  status?: boolean;
  supplierName?: string;
}

export default function StoresMegaMenu() {
=======
  categoryID: number;
  storeID: number;
}

export default function StoresMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
>>>>>>> main
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
  const isOpen = useUIStore((state) => state.isStoresMegaMenuOpen);
  const closeMenu = useUIStore((state) => state.closeStoresMegaMenu);

=======
>>>>>>> main
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
<<<<<<< HEAD
          // Deduplicate stores by storeID before setting state
          const uniqueStores = storesData.filter(
            (store, index, self) =>
              index === self.findIndex((s) => s.storeID === store.storeID)
          );
          setStores(uniqueStores);
          // İlk mağazayı varsayılan olarak seç
          if (uniqueStores.length > 0) {
            setSelectedStore(uniqueStores[0]);
          }
=======
          setStores(storesData);
>>>>>>> main
        }
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
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
<<<<<<< HEAD
    useUIStore.getState().openStoresMegaMenu();
=======
    setIsOpen(true);
>>>>>>> main
  }, [timeoutId]);

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
<<<<<<< HEAD
      closeMenu();
    }, 300);
    setTimeoutId(id);
  }, [closeMenu]);
=======
      setIsOpen(false);
      setSelectedStore(null);
    }, 300); // 300ms gecikme
    setTimeoutId(id);
  }, []);
>>>>>>> main

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
<<<<<<< HEAD
        closeMenu();
=======
        setIsOpen(false);
        setSelectedStore(null);
>>>>>>> main
      }
    };

    document.addEventListener('mouseover', handleClickOutside);
    return () => {
      document.removeEventListener('mouseover', handleClickOutside);
    };
<<<<<<< HEAD
  }, [closeMenu]);
=======
  }, []);
>>>>>>> main

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
        <span className="font-satisfy text-2xl group-hover:text-[#FF9D00] group-hover:text-[28px]  transition-all">
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
          
          <div
<<<<<<< HEAD
            className="absolute top-full left-0 w-[1800px] h-[800px] bg-white shadow-xl rounded-lg p-6 z-50"
            onMouseEnter={handleMouseEnter}
            style={{ left: '-750px', top: '-30px', zIndex: 50, width: 'calc(100vw - 100px)', maxWidth: '1800px', minHeight: '900px', height: 'auto', maxHeight: '80vh' }}
=======
            className="absolute top-full left-0 w-[800px] bg-white shadow-xl rounded-lg p-6 z-50"
            onMouseEnter={handleMouseEnter}
>>>>>>> main
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <span className="text-red-500">{error}</span>
              </div>
            ) : (
              <div className="flex">
                {/* Mağazalar Listesi */}
<<<<<<< HEAD
                <div className="w-1/5 border-r border-gray-200 pr-4">
                  <h2 className="font-bold text-xl text-[#FF9D00] mb-4">Stores</h2>
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <div
                          key={store.storeID}
                          className={`py-2 px-4 hover:bg-gray-50 cursor-pointer rounded-md group/store transition-colors ${selectedStore?.storeID === store.storeID ? 'bg-gray-100' : ''}`}
                          onMouseEnter={() => handleStoreHover(store)}
                        >
                          <div className="flex items-center justify-between group-hover/store:text-[#1D4ED8]">
                            <span className={`font-medium ${selectedStore?.storeID === store.storeID ? 'text-[#1D4ED8]' : ''}`}>
                              {store.storeName}
                            </span>
                            <ArrowRight className={`w-4 h-4 transition-colors ${selectedStore?.storeID === store.storeID ? 'text-[#1D4ED8]' : ''}`} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-4 text-gray-500">No stores available</div>
                    )}
                  </div>
=======
                <div className="w-1/4 border-r border-gray-200 pr-4">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <div
                        key={store.storeID}
                        className="py-2 px-4 hover:bg-gray-50 cursor-pointer rounded-md group/store transition-colors"
                        onMouseEnter={() => handleStoreHover(store)}
                      >
                        <div className="flex items-center justify-between group-hover/store:text-[#1D4ED8]">
                          <span className="font-medium">{store.storeName}</span>
                          <ArrowRight className="w-4 h-4 transition-colors" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 px-4 text-gray-500">No stores available</div>
                  )}
>>>>>>> main
                </div>

                {/* Kategoriler ve Ürünler */}
                {selectedStore && (
<<<<<<< HEAD
                  <div className="w-4/5 pl-6">
                    <div className="grid grid-cols-4 gap-6 max-h-[800px] overflow-y-auto">
                      {categories
                        .filter(category => category.storeName === selectedStore.storeName)
                        .map((category) => (
                          <div key={category.categoryID} className="space-y-3">
                            <h3 className="font-bold text-lg text-[#FF9D00] pb-2 border-b border-gray-200">
                              <Link 
                                href={`/store/details/${category.categoryID}`}
                                className="hover:underline"
                              >
                                {category.categoryName}
                              </Link>
=======
                  <div className="w-3/4 pl-6">
                    <div className="grid grid-cols-5 gap-6">
                      {categories
                        .filter(category => category.storeID === selectedStore.storeID)
                        .map((category, index, arr) => (
                          <div key={category.categoryID} className="space-y-3">
                            <h3 className="font-bold text-lg text-[#FF9D00] pb-2 border-b border-gray-200">
                              {category.categoryName}
>>>>>>> main
                            </h3>
                            <ul className="space-y-2">
                              {products
                                .filter(product => 
<<<<<<< HEAD
                                  product.categoryName === category.categoryName && 
                                  product.storeName === selectedStore.storeName 
                                )
                                .slice(0, 6) // En fazla 6 ürün göster
=======
                                  product.categoryID === category.categoryID && 
                                  product.storeID === selectedStore.storeID
                                )
>>>>>>> main
                                .map((product) => (
                                  <li key={product.productID}>
                                    <Link 
                                      href={`/product/${product.productID}`}
<<<<<<< HEAD
                                      className="text-gray-600 hover:text-[#1D4ED8] transition-colors block py-1 text-sm"
=======
                                      className="text-gray-600 hover:text-[#1D4ED8] transition-colors block py-1"
>>>>>>> main
                                    >
                                      {product.productName}
                                    </Link>
                                  </li>
                                ))}
<<<<<<< HEAD
                              {products.filter(product => 
                                product.categoryName === category.categoryName && 
                                product.storeName === selectedStore.storeName
                              ).length > 6 && (
                                <li>
                                  <Link 
                                    href={`/store/details/${category.categoryID}`}
                                    className="text-[#1D4ED8] hover:underline block py-1 text-sm font-medium"
                                  >
                                    View all products...
                                  </Link>
                                </li>
                              )}
                              {products.filter(product => 
                                product.categoryName === category.categoryName && 
                                product.storeName === selectedStore.storeName
                              ).length === 0 && (
                                <li className="py-1 text-xs text-gray-400">(No products)</li>
                              )}
=======
>>>>>>> main
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