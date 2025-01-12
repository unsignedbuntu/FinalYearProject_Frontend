"use client"
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface List {
  id: number;
  name: string;
  productCount: number;
}

export default function ListSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === null) return null;
  
  const [lists, setLists] = useState<List[]>([
    { id: 1, name: "vadv", productCount: 1 },
    { id: 2, name: "fawfwa", productCount: 0 }
  ])

  return (
    <div className="w-[300px] bg-white p-4">
      <h2 className="font-inter text-[32px] font-medium mb-6">
        My Lists
      </h2>
      
      <div className="space-y-2">
        {lists.map(list => (
          <button
            key={list.id}
            className={`w-full flex items-center p-3 text-left relative
                      ${pathname.includes(list.name) ? 'bg-black text-white' : ''}`}
            onClick={() => router.push(`/favorites/lists/${list.name}`)}
          >
            <span className="font-inter text-[16px]">
              {list.name}
            </span>
            <span className="ml-2 text-sm opacity-70">
              ({list.productCount})
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}   