"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Image from 'next/image'
import Shipped from '@/components/icons/Shipped'
import Delivered from '@/components/icons/Delivered'

interface Order {
  id: string;
  date: string;
  status: 'Shipped' | 'Delivered';
  price: number;
  image: string;
}

export default function MyOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('All')
  const [orders] = useState<Order[]>([
    {
      id: '434 940 876',
      date: '21 October 2024',
      status: 'Shipped',
      price: 203.95,
      image: '/shoe.png'
    },
    {
      id: '235 344 610',
      date: '19 September 2024',
      status: 'Delivered',
      price: 874.9,
      image: '/headphone.png'
    }
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  const tabs = ['All', 'Ongoing orders', 'Returns', 'Cancellations']
  const timeFilters = ['All orders', 'Last 30 day', 'Last 6 month', 'Last year', 'More than a year']

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        {/* Main Content */}
        <div className="w-[1000px] bg-white rounded-lg p-6">
          {/* Header */}
          <h1 className="font-raleway text-[64px] font-normal text-center mb-8">
            My orders
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search my orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] h-[40px] px-4 py-2 rounded-lg bg-[#D9D9D9] pl-10 font-raleway"
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-raleway ${
                  selectedTab === tab 
                    ? 'bg-[#40BFFF] text-white' 
                    : 'bg-[#D9D9D9] text-black'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="relative ml-auto">
              <select className="appearance-none bg-[#D9D9D9] px-4 py-2 rounded-lg pr-8 font-raleway text-[20px]">
                {timeFilters.map((filter) => (
                  <option key={filter} className="font-raleway text-[20px]">{filter}</option>
                ))}
              </select>
              <svg className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.id} className="bg-[#D9D9D9] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image 
                    src={order.image} 
                    alt={`Order ${order.id}`}
                    width={80} 
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <div className="font-raleway text-[16px]">Order no: {order.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-[200px]">
                  <div className="flex items-center gap-2">
                    {order.status === 'Shipped' ? <Shipped /> : <Delivered />}
                    <span className={order.status === 'Shipped' ? 'text-blue-500' : 'text-green-500'}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-gray-500">{order.date}</div>
                      <div className="font-bold text-[#12B51D]">{order.price.toFixed(2)} TL</div>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-raleway ${
                    currentPage === page ? 'bg-[#40BFFF] text-white' : 'text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 