'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { searchGlobal, GlobalSearchResults, SearchResultProduct, SearchResultCategory, SearchResultStore, SearchResultSupplier } from '@/services/API_Service';
import Image from 'next/image';

// Basic debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
}

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GlobalSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (query: string) => {
    console.log('[GlobalSearch] fetchResults (useCallback) called with query:', query);
    if (!query.trim()) {
      setResults(null);
      setIsDropdownVisible(false);
      return;
    }
    setIsLoading(true);
    try {
      console.log('[GlobalSearch] Calling searchGlobal with query:', query);
      const searchData = await searchGlobal(query);
      console.log('[GlobalSearch] Data received from searchGlobal:', searchData);

      // Set results first
      setResults(searchData);

      // Then, determine visibility based on content of searchData
      if (searchData && (searchData.products.length > 0 || searchData.categories.length > 0 || searchData.stores.length > 0 || searchData.suppliers.length > 0)) {
        setIsDropdownVisible(true);
        console.log('[GlobalSearch] Setting isDropdownVisible to true because searchData has content.');
      } else {
        setIsDropdownVisible(false);
        console.log('[GlobalSearch] Setting isDropdownVisible to false because searchData is empty or null.');
      }
    } catch (error) { // This catch is for errors thrown by searchGlobal or other issues in try block
      console.error("[GlobalSearch] Error in fetchResults:", error);
      setResults(null);
      setIsDropdownVisible(false);
    } finally {
      setIsLoading(false);
      // Logging state here might show values from previous render due to async nature of setState
      // console.log('[GlobalSearch] fetchResults FINALLY: results state:', results); // Best to check 'Data received' log
      // console.log('[GlobalSearch] fetchResults FINALLY: isDropdownVisible state:', isDropdownVisible); // And the new specific logs for visibility
    }
  }, []); // Dependencies are stable setters from useState (setIsLoading, setResults, setIsDropdownVisible) and searchGlobal (import)

  const debouncedFetchResults = useCallback(debounce(fetchResults, 300), [fetchResults]);

  useEffect(() => {
    if (searchTerm.trim() === '') { // Also handle clearing results when searchTerm is cleared
        setResults(null);
        setIsDropdownVisible(false);
        setIsLoading(false); // Ensure loading is also reset
    }
    // Only call debouncedFetchResults if searchTerm is not empty,
    // fetchResults itself handles the query.trim() check but this prevents unnecessary debounce scheduling.
    debouncedFetchResults(searchTerm);
  }, [searchTerm, debouncedFetchResults]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (searchTerm.trim() && results && (results.products.length > 0 || results.categories.length > 0 || results.stores.length > 0 || results.suppliers.length > 0)) {
        setIsDropdownVisible(true);
    }
  };
  
  const handleLinkClick = () => {
    setIsDropdownVisible(false);
    setSearchTerm(''); 
    setResults(null);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchContainerRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleInputFocus}
        placeholder="Search for product, category or brand..."
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {isDropdownVisible && results && (results.products.length > 0 || results.categories.length > 0 || results.stores.length > 0 || results.suppliers.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.products.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Products</h3>
              <ul>
                {results.products.map((product: SearchResultProduct) => (
                  <li key={`product-${product.productID}`}>
                    <Link 
                        href={`/product/${product.productID}`}
                        onClick={handleLinkClick}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-100 rounded-md transition-colors duration-150 ease-in-out"
                    >
                        {product.imageUrl && (
                            <Image 
                                src={`/api-proxy/product-image/${product.productID}`}
                                alt={product.productName}
                                width={32} 
                                height={32}
                                className="object-contain w-8 h-8 rounded-md mr-3"
                            />
                        )}
                        {!product.imageUrl && (
                            <div className="w-8 h-8 rounded-md mr-3 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Img</div>
                        )}
                        {product.productName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.categories.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Categories</h3>
              <ul>
                {results.categories.map((category: SearchResultCategory) => (
                  <li key={`category-${category.categoryID}`}>
                    <Link 
                        href={`/store/details/${category.categoryID}`} 
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-100 rounded-md transition-colors duration-150 ease-in-out"
                    >
                        {category.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.stores.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Stores</h3>
              <ul>
                {results.stores.map((store: SearchResultStore) => (
                  <li key={`store-${store.storeID}`}>
                     <Link 
                        href={`/store/details/${store.storeID}`} // Assuming store detail page uses storeID
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-100 rounded-md transition-colors duration-150 ease-in-out"
                    >
                        {store.storeName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.suppliers.length > 0 && (
            <div className="p-2">
              <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Brands / Suppliers</h3>
              <ul>
                {results.suppliers.map((supplier: SearchResultSupplier) => (
                  <li key={`supplier-${supplier.supplierID}`}>
                     <Link 
                        href={`/`} // Placeholder: Directs to homepage, adjust as needed
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-100 rounded-md transition-colors duration-150 ease-in-out"
                    >
                        {supplier.supplierName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 