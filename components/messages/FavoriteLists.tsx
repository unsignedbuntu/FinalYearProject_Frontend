"use client"
import { useState } from 'react'

interface List {
  id: number;
  name: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
  }>;
}

export default function FavoriteLists() {
    
  const [lists, setLists] = useState<List[]>([])

  return (
    <div className="mt-8">
      {lists.map(list => (
        <div key={list.id} className="mb-8">
          <h2 className="font-inter text-[24px] font-medium mb-4">
            {list.name}
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {list.products.map(product => (
              <div 
                key={product.id}
                className="w-[200px] h-[200px] rounded-lg relative bg-[#D9D9D9]"
              >
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2">
                  <h3 className="font-inter text-[16px] text-white">
                    {product.name}
                  </h3>
                  <div className="font-inter text-[14px] text-[#40BFFF]">
                    ${product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 