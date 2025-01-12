"use client"
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import Image from 'next/image'

interface Store {
  id: string;
  name: string;
  logo: string;
  productCount: number;
  followerCount: number;
}

const SAMPLE_STORES: Store[] = [
  {
    id: "1",
    name: "Nike Store",
    logo: "/products/shoe-1.png",
    productCount: 1250,
    followerCount: 45600
  },
  {
    id: "2",
    name: "Adidas Official",
    logo: "/products/shoe-2.png",
    productCount: 890,
    followerCount: 32400
  },
  {
    id: "3",
    name: "Puma Store",
    logo: "/products/shoe-3.png",
    productCount: 750,
    followerCount: 28900
  }
];

export default function FollowedStoresPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      
      <div className="ml-[480px]">
        <div className="w-[1000px] bg-white rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Followed Stores</h1>
          
          <div className="grid grid-cols-1 gap-6">
            {SAMPLE_STORES.map((store) => (
              <div
                key={store.id}
                className="bg-gray-50 p-6 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/product/1')} // Ürün sayfasına yönlendir
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{store.name}</h2>
                    <div className="flex gap-4 mt-2 text-gray-600">
                      <span>{store.productCount} Products</span>
                      <span>•</span>
                      <span>{store.followerCount.toLocaleString()} Followers</span>
                    </div>
                  </div>
                </div>
                
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Products
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 