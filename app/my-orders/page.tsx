"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserOrders, getOrderItemsByOrderId, ApiOrderItemDto } from '@/services/API_Service'
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
// import ProtectedRoute from '@/components/hoc/ProtectedRoute'
import Sidebar from '@/components/sidebar/Sidebar'
import Image from 'next/image'
import Shipped from '@/components/icons/Shipped'
import Delivered from '@/components/icons/Delivered'
import { useUserStore } from '@/app/stores/userStore'
import { useOrdersStore } from '@/app/stores/ordersStore'

interface BackendOrder {
  orderID: number;
  userID: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
}

const MyOrdersPage = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth()
  const userId = user?.id

  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [expandedOrderItems, setExpandedOrderItems] = useState<ApiOrderItemDto[]>([])
  const [isLoadingOrderItems, setIsLoadingOrderItems] = useState<boolean>(false)
  const [fetchItemsError, setFetchItemsError] = useState<string | null>(null)

  // useEffect to log expandedOrderItems whenever it changes
  useEffect(() => {
    console.log('[MyOrdersPage EFFECT] expandedOrderItems changed:', expandedOrderItems);
  }, [expandedOrderItems]);

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login')
      } else {
        const loadOrders = async () => {
          setIsLoading(true)
          setError(null)
          try {
            const fetchedOrders = await getUserOrders(user.id)
            setOrders(fetchedOrders || [])
          } catch (err: any) {
            setError(err.message || 'Failed to load orders.')
            setOrders([])
          }
          setIsLoading(false)
        }
        loadOrders()
      }
    }
  }, [authIsLoading, isAuthenticated, user, router])

  const handleToggleOrderDetails = useCallback(async (orderIdToToggle: number) => {
    console.log(`[MyOrdersPage] handleToggleOrderDetails called for order ID: ${orderIdToToggle}`);
    const currentlyExpanded = expandedOrderId === orderIdToToggle;
    if (currentlyExpanded) {
      console.log('[MyOrdersPage] Collapsing order details.');
      setExpandedOrderId(null);
      setExpandedOrderItems([]);
      setFetchItemsError(null);
    } else {
      console.log(`[MyOrdersPage] Expanding order details for order ID: ${orderIdToToggle}`);
      setExpandedOrderId(orderIdToToggle);
      setIsLoadingOrderItems(true);
      setFetchItemsError(null);
      console.log('[MyOrdersPage] About to clear expandedOrderItems. Current length:', expandedOrderItems.length);
      setExpandedOrderItems([]);
      console.log('[MyOrdersPage] Cleared expandedOrderItems (intended state). Next, fetching new items...');
      try {
        console.log(`[MyOrdersPage] Calling getOrderItemsByOrderId(${orderIdToToggle})`);
        const items = await getOrderItemsByOrderId(orderIdToToggle);
        console.log('[MyOrdersPage] Received items from API:', items);
        setExpandedOrderItems(items || []);
        console.log('[MyOrdersPage] Set expandedOrderItems with new items. Intended items length:', (items || []).length);
        if (!items || items.length === 0) {
          console.log('[MyOrdersPage] No items found or empty array returned.');
        }
      } catch (err: any) {
        console.error(`[MyOrdersPage] Error fetching items for order ${orderIdToToggle}:`, err);
        setFetchItemsError(err.message || `Failed to load items for order ${orderIdToToggle}.`);
        setExpandedOrderItems([]);
      }
      setIsLoadingOrderItems(false);
      console.log('[MyOrdersPage] Finished loading order items.');
    }
  }, [expandedOrderId, setExpandedOrderItems, setIsLoadingOrderItems, setFetchItemsError]);

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

  if (authIsLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Authenticating...</p></div>
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading your orders...</p></div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500"><p>Error: {error}</p></div>
  }

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="w-[1000px] bg-white rounded-lg p-6">
          <h1 className="font-raleway text-[64px] font-normal text-center mb-8">
            My orders
          </h1>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">You have no orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderID} className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                  <button
                    onClick={() => handleToggleOrderDetails(order.orderID)}
                    className="w-full text-left p-4 sm:p-5 focus:outline-none hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-md sm:text-lg font-semibold text-indigo-700">Order #{order.orderID}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Date: {formatDate(order.orderDate)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm sm:text-md font-medium text-gray-700">Total: ${order.totalAmount.toFixed(2)}</p>
                        <p className={`text-xs sm:text-sm font-semibold 
                          ${order.status === 'Delivered' ? 'text-green-600' : 
                            order.status === 'Cancelled' ? 'text-red-600' : 
                            order.status === 'Shipped' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          Status: {order.status}
                        </p>
                      </div>
                    </div>
                  </button>

                  {expandedOrderId === order.orderID && (
                    <div 
                      key={`order-items-for-${order.orderID}`}
                      className="border-t border-gray-200 bg-gray-100 p-4 sm:p-5"
                    >
                      {isLoadingOrderItems && <p className="text-sm text-gray-500 text-center py-4">Loading items...</p>}
                      {fetchItemsError && <p className="text-sm text-red-500 text-center py-4">Error fetching items: {fetchItemsError}</p>}
                      {!isLoadingOrderItems && !fetchItemsError && (
                        expandedOrderItems.length > 0 ? (
                          <>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Order Items:</h4>
                            { /* Boolean(console.log('[MyOrdersPage] Rendering Order Items. expandedOrderItems:', expandedOrderItems)) || null */ }
                            <ul className="space-y-3">
                              {expandedOrderItems.map(item => (
                                <li key={item.orderItemID} className="flex items-start p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                                  {item.productImageUrl && (
                                    <Image
                                      src={item.productImageUrl}
                                      alt={item.productName}
                                      width={64} 
                                      height={64} 
                                      className="rounded object-cover mr-4"
                                    />
                                  )}
                                  <div className="flex-grow">
                                    <p className="font-medium text-gray-800 text-sm sm:text-base">{item.productName}</p>
                                    <p className="text-xs text-gray-500">Product ID: {item.productID}</p>
                                    {item.barcode && <p className="text-xs text-gray-500">Barcode: {item.barcode}</p>}
                                  </div>
                                  <div className="text-left sm:text-right ml-4 flex-shrink-0">
                                    <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                                    <p className="text-xs sm:text-sm text-gray-800 font-semibold">@ ${item.priceAtPurchase.toFixed(2)}</p>
                                    <p className="text-sm sm:text-base text-gray-800 font-bold mt-1">
                                      ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {/* <pre>{JSON.stringify(expandedOrderItems, null, 2)}</pre> */}
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No items found for this order.</p>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrdersPage 