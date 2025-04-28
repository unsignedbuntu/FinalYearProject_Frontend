"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Image from 'next/image'
import Shipped from '@/components/icons/Shipped'
import Delivered from '@/components/icons/Delivered'
import { useUserStore } from '@/app/stores/userStore'
import { useOrdersStore } from '@/app/stores/ordersStore'
import React from 'react'

export default function MyOrdersPage() {
  const router = useRouter()
  const { user } = useUserStore()
  const userId = user?.id

  const {
    orders,
    isLoading,
    error,
    searchTerm,
    selectedTab,
    currentPage,
    ordersPerPage,
    fetchOrders,
    setSearchTerm,
    setSelectedTab,
    setCurrentPage,
  } = useOrdersStore()

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const handleToggleExpansion = (index: number) => {
      setExpandedIndex(prev => prev === index ? null : index);
  };

  useEffect(() => {
    if (userId !== null && userId !== undefined) {
       fetchOrders(userId)
    } else {
      console.warn("User not logged in, cannot fetch orders.")
    }
  }, [userId, fetchOrders])

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = (order.status && order.status.toLowerCase().includes(lowerSearchTerm)) ||
                         (order.totalAmount && order.totalAmount.toString().includes(lowerSearchTerm));
    
    let matchesTab = true;
    if (selectedTab !== 'All') {
       const lowerStatus = order.status?.toLowerCase();
       if (selectedTab === 'Ongoing orders') {
          matchesTab = lowerStatus === 'pending' || lowerStatus === 'processing' || lowerStatus === 'shipped';
       } else if (selectedTab === 'Returns') {
          matchesTab = lowerStatus === 'returning' || lowerStatus === 'returned';
       } else if (selectedTab === 'Cancellations') {
          matchesTab = lowerStatus === 'cancelled';
       }
    }
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const tabs = ['All', 'Ongoing orders', 'Returns', 'Cancellations']
  const timeFilters = ['All orders', 'Last 30 day', 'Last 6 month', 'Last year', 'More than a year']

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
        return dateString
    }
  }

  const getStatusIcon = (status: string) => {
      const lowerStatus = status?.toLowerCase()
      if (lowerStatus === 'shipped') return <Shipped />
      if (lowerStatus === 'delivered') return <Delivered />
      if (lowerStatus === 'pending') return <Shipped />
      return null
  }
  
  const getStatusColor = (status: string) => {
      const lowerStatus = status?.toLowerCase()
      if (lowerStatus === 'shipped') return 'text-blue-500'
      if (lowerStatus === 'delivered') return 'text-green-500'
      if (lowerStatus === 'pending') return 'text-orange-500'
      if (lowerStatus === 'cancelled') return 'text-red-500'
      if (lowerStatus === 'returned') return 'text-purple-500'
      return 'text-gray-500'
  }

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="w-[1000px] bg-white rounded-lg p-6">
          <h1 className="font-raleway text-[64px] font-normal text-center mb-8">
            My orders
          </h1>

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

          {isLoading ? (
            <div className="text-center py-10">Loading orders...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found{searchTerm || selectedTab !== 'All' ? ' matching your criteria' : ''}.</div>
          ) : (
            <div className="space-y-4">
              {currentOrders.map((order, index) => {
                 const actualIndex = indexOfFirstOrder + index;
                 return (
                    <React.Fragment key={`order-${actualIndex}`}>
                      <div className="bg-[#D9D9D9] rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Image 
                            src={'/placeholder.png'}
                            alt={`Order from ${formatDate(order.orderDate)}`}
                            width={80} 
                            height={80}
                            className="rounded-lg"
                          />
                          <div>
                            <div className="font-raleway text-[16px]">Order Date: {formatDate(order.orderDate)}</div>
                            <div className="font-raleway text-sm">Status: {order.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-[200px]">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={getStatusColor(order.status)}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-gray-500">{formatDate(order.orderDate)}</div>
                              <div className="font-bold text-[#12B51D]">{order.totalAmount.toFixed(2)} TL</div>
                            </div>
                            <button 
                              onClick={() => handleToggleExpansion(actualIndex)}
                              className="focus:outline-none"
                            >
                              <svg 
                                className={`w-6 h-6 cursor-pointer transition-transform duration-200 ${expandedIndex === actualIndex ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      {expandedIndex === actualIndex && (
                        <div className="bg-gray-100 p-4 rounded-b-lg -mt-2 mb-2 border-t border-gray-300">
                          <h4 className="font-semibold mb-2">Order Details (Date: {formatDate(order.orderDate)})</h4>
                          <p className="text-sm text-gray-600">Product details will be shown here once the API is updated.</p>
                        </div>
                      )}
                    </React.Fragment>
                 );
              })}
            </div>
          )}

          {totalPages > 1 && !isLoading && !error && filteredOrders.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#D9D9D9] rounded-lg font-raleway disabled:opacity-50"
                >
                  Next
                </button>
              </div>
           )}
        </div>
      </div>
    </div>
  )
} 