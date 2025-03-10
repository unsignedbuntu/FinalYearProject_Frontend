'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getProducts, getStores } from '@/services/Category_Actions';

interface Category {
  categoryID: number;
  categoryName: string;
  storeID: number;
}

interface Product {
  productID: number;
  productName: string;
  categoryID: number;
  productPrice?: number;
  productDescription?: string;
  productImage?: string;
}

interface Store {
  storeID: number;
  storeName: string;
}

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Kategori hover işlemi
  const handleCategoryHover = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  // Hover'dan çıkma işlemi
  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  // Ana kategorileri getir (storeID'ye göre gruplandırılmış)
  const getMainCategories = () => {
    // Benzersiz storeID'leri bul
    const uniqueStoreIds = Array.from(new Set(categories.map(cat => cat.storeID)));
    
    // Her mağaza için bir ana kategori seç
    return uniqueStoreIds.map(storeId => {
      const storeCategories = categories.filter(cat => cat.storeID === storeId);
      // Her mağaza için ilk kategoriyi ana kategori olarak kullan
      return storeCategories[0];
    }).filter(Boolean); // undefined değerleri filtrele
  };

  // Alt kategorileri getir
  const getSubCategories = (categoryId: number) => {
    const mainCategory = categories.find(cat => cat.categoryID === categoryId);
    if (!mainCategory) return [];
    
    return categories.filter(cat => 
      cat.storeID === mainCategory.storeID && 
      cat.categoryID !== categoryId
    );
  };

  // Kategoriye ait ürünleri getir
  const getCategoryProducts = (categoryId: number) => {
    return products.filter(product => product.categoryID === categoryId).slice(0, 5); // En fazla 5 ürün göster
  };

  if (loading) {
    return <div className="flex justify-center py-4">Kategoriler yükleniyor...</div>;
  }

  const mainCategories = getMainCategories();

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      {/* Ana Kategori Menüsü */}
      <div className="flex border-b border-gray-200">
        {mainCategories.map((category) => (
          <div
            key={category.categoryID}
            className="relative group"
            onMouseEnter={() => handleCategoryHover(category.categoryID)}
          >
            <Link
              href={`/store/details/${category.categoryID}`}
              className={`px-4 py-3 block text-sm font-medium hover:text-blue-600 ${
                activeCategory === category.categoryID ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              {category.categoryName}
            </Link>
            
            {/* Alt Kategoriler ve Ürünler (Hover durumunda gösterilir) */}
            {activeCategory === category.categoryID && (
              <div className="absolute left-0 mt-1 w-[1000px] bg-white shadow-lg rounded-b-lg z-50 grid grid-cols-5 gap-4 p-6">
                {/* Ana kategori ve ürünleri */}
                <div className="col-span-1">
                  <h3 className="font-bold text-blue-600 mb-2">
                    <Link 
                      href={`/store/details/${category.categoryID}`} 
                      className="hover:underline"
                    >
                      {category.categoryName}
                    </Link>
                  </h3>
                  <ul className="space-y-1">
                    {getCategoryProducts(category.categoryID).map((product) => (
                      <li key={product.productID}>
                        <Link 
                          href={`/product/${product.productID}`} 
                          className="text-sm text-gray-600 hover:text-blue-600"
                        >
                          {product.productName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Alt kategoriler ve ürünleri */}
                {getSubCategories(category.categoryID).slice(0, 4).map((subCategory) => (
                  <div key={subCategory.categoryID} className="col-span-1">
                    <h3 className="font-bold text-blue-600 mb-2">
                      <Link 
                        href={`/store/details/${subCategory.categoryID}`} 
                        className="hover:underline"
                      >
                        {subCategory.categoryName}
                      </Link>
                    </h3>
                    <ul className="space-y-1">
                      {getCategoryProducts(subCategory.categoryID).map((product) => (
                        <li key={product.productID}>
                          <Link 
                            href={`/product/${product.productID}`} 
                            className="text-sm text-gray-600 hover:text-blue-600"
                          >
                            {product.productName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                {/* Eğer alt kategori yoksa veya çok az alt kategori varsa boş bir mesaj göster */}
                {getSubCategories(category.categoryID).length === 0 && (
                  <div className="col-span-4 text-center py-4">
                    <p className="text-gray-500">Bu kategoride henüz alt kategori bulunmamaktadır.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 