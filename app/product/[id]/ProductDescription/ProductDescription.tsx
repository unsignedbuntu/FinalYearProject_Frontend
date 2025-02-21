import React from 'react';
import { Product, ProductSupplier } from '../types/Product';

interface ProductDescriptionProps {
  product: Product;
  supplier: ProductSupplier;
}

export default function ProductDescription({ product, supplier }: ProductDescriptionProps) {
  // Random rating için (geçici, daha sonra gerçek rating sistemi eklenebilir)
  const randomRating = (Math.floor(Math.random() * 5) + 1).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
            {supplier?.supplierName?.[0] || 'S'}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{supplier?.supplierName || 'Store Name'}</h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Number(randomRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">({randomRating})</span>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Follow Store
        </button>
      </div>
      
      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-4">Product Details</h4>
        <p className="text-gray-600">{product.description}</p>
        
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-4">
            <h5 className="font-semibold mb-2">Specifications</h5>
            <dl className="grid grid-cols-1 gap-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="font-medium w-1/3">{key}:</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
} 