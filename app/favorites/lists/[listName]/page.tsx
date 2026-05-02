"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import ListSidebar from '@/app/favorites/ListSidebar'

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function ListPage() {
  const params = useParams()
  if (params === null) return null;

  const listName = params.listName as string
  const [products, setProducts] = useState<Product[]>([])

  return (
    <div className="min-h-screen pt-[160px] flex">
      <Sidebar />
      <ListSidebar />
      
      <div className="flex-1 ml-8">
        <div className="flex items-center justify-between mb-8">
          <div className="w-[500px] h-[80px] bg-[#D9D9D9] flex items-center px-6 rounded-lg">
            <h1 className="font-inter text-[48px] font-normal">
              {listName}
              <span className="ml-4 text-[20px]">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {products.map(product => (
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
    </div>
  )
} 