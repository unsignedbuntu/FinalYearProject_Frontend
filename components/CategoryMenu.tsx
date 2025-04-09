'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getProducts, getStores } from '@/services/API_Service';

interface Category {
  categoryID: number;
  categoryName: string;
  storeName: string;
  storeID?: number;
}

interface Product {
  productID: number;
  productName: string;
  categoryName: string;
  storeName?: string;
  productPrice?: number;
  productDescription?: string;
  productImage?: string;
  price?: number;
  stockQuantity?: number;
}

interface Store {
  storeID: number;
  storeName: string;
}

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoriesData as Category[]);
        setProducts(productsData as Product[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryHover = (category: Category) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  const getCategoryProducts = (categoryName: string) => {
    return products.filter(product => product.categoryName === categoryName); 
  };

  if (loading) {
    return <div className="flex justify-center py-4">Kategoriler yükleniyor...</div>;
  }

  const uniqueCategories = categories.reduce((acc, current) => {
      if (!acc.find(item => item.categoryName === current.categoryName)) {
          acc.push(current);
      }
      return acc;
  }, [] as Category[]);

  return (
    <div className="relative z-40" onMouseLeave={handleMouseLeave}>
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {uniqueCategories.map((category) => (
          <div
            key={category.categoryID}
            className="relative group"
            onMouseEnter={() => handleCategoryHover(category)}
          >
            <Link
              href={`/store/details/${category.categoryID}`}
              className={`px-4 py-3 block text-sm font-medium hover:text-blue-600 whitespace-nowrap ${
                activeCategory?.categoryID === category.categoryID ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              {category.categoryName}
            </Link>
            
            {activeCategory?.categoryID === category.categoryID && (
              <div 
                className="fixed w-[300px] bg-white shadow-lg rounded-b-lg z-[9999] p-4"
                style={{ 
                  top: '160px',
                  left: '50px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h3 className="font-bold text-blue-600 mb-2">
                  <Link 
                    href={`/store/details/${category.categoryID}`} 
                    className="hover:underline"
                  >
                    {category.categoryName}
                  </Link>
                </h3>
                <ul className="max-h-[300px] overflow-y-auto pr-2">
                  {getCategoryProducts(category.categoryName).map((product) => (
                    <li key={product.productID} className="py-1 border-b border-gray-100 last:border-b-0">
                      <Link 
                        href={`/product/${product.productID}`} 
                        className="text-sm text-gray-600 hover:text-blue-600 block"
                      >
                        {product.productName}
                      </Link>
                    </li>
                  ))}
                  {getCategoryProducts(category.categoryName).length === 0 && (
                    <li className="py-2 text-center">
                      <p className="text-gray-500 text-sm">Bu kategoride henüz ürün bulunmamaktadır.</p>
                    </li>
                  )}
                </ul>
                <div className="mt-2 text-right">
                  <Link 
                    href={`/store/details/${category.categoryID}`}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Tüm ürünleri gör
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 