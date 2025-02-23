'use client';
import { useEffect, useState } from 'react';
import { getProducts, getProductSuppliers, getStores } from '@/services/Category_Actions';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, suppliersData, storesData] = await Promise.all([
          getProducts(),
          getProductSuppliers(),
          getStores()
        ]);

        const productsWithSuppliers = productsData.map((product: Product) => {
          const productSupplier = suppliersData.find(
            (ps: any) => ps.productID === product.productID
          );
          
          if (productSupplier) {
            const store = storesData.find(
              (s: any) => s.storeID === productSupplier.supplierID
            );
            return { ...product, store };
          }
          
          return product;
        });

        setProducts(productsWithSuppliers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.productID} product={product} />
        ))}
      </div>
    </div>
  );
}