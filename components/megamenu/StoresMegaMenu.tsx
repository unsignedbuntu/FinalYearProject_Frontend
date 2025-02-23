"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import TicIcon from '../icons/TicIcon'
import TicHover from '../icons/Tic_Hover'
import ArrowRight from '../icons/ArrowRight'
import { getStores, getCategories, getProducts } from '@/services/Category_Actions'

interface Store {
  storeID: number;
  storeName: string;
  categories?: Category[];
}

interface Category {
  categoryID: number;
  categoryName: string;
  storeID: number;
  products?: Product[];
}

interface Product {
  productID: number;
  productName: string;
  categoryID: number;
  storeID: number;
}

export default function StoresMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
          setStores(storesData);
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
    setIsOpen(true);
  }, [timeoutId]);

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
      setSelectedStore(null);
    }, 300); // 300ms gecikme
    setTimeoutId(id);
  }, []);

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
        setIsOpen(false);
        setSelectedStore(null);
      }
    };

    document.addEventListener('mouseover', handleClickOutside);
    return () => {
      document.removeEventListener('mouseover', handleClickOutside);
    };
  }, []);

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
            className="absolute top-full left-0 w-[800px] bg-white shadow-xl rounded-lg p-6 z-50"
            onMouseEnter={handleMouseEnter}
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
                </div>

                {/* Kategoriler ve Ürünler */}
                {selectedStore && (
                  <div className="w-3/4 pl-6">
                    <div className="grid grid-cols-5 gap-6">
                      {categories
                        .filter(category => category.storeID === selectedStore.storeID)
                        .map((category, index, arr) => (
                          <div key={category.categoryID} className="space-y-3">
                            <h3 className="font-bold text-lg text-[#FF9D00] pb-2 border-b border-gray-200">
                              {category.categoryName}
                            </h3>
                            <ul className="space-y-2">
                              {products
                                .filter(product => 
                                  product.categoryID === category.categoryID && 
                                  product.storeID === selectedStore.storeID
                                )
                                .map((product) => (
                                  <li key={product.productID}>
                                    <Link 
                                      href={`/product/${product.productID}`}
                                      className="text-gray-600 hover:text-[#1D4ED8] transition-colors block py-1"
                                    >
                                      {product.productName}
                                    </Link>
                                  </li>
                                ))}
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