"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Coupon from '@/components/icons/Coupon'
import ArrowRight from '@/components/icons/ArrowRight'
import Bin from '@/components/icons/Bin'
import Image from 'next/image'
import MyCartMessage from '@/components/messages/MyCartMessage'
import CompleteShopping from '@/components/messages/CompleteShopping'
import Ticket from '@/components/icons/Ticket'
import { useCartStore } from '@/app/stores/cartStore'
import { useUserStore } from '@/app/stores/userStore'
import { createOrder } from '@/services/API_Service'
import { toast } from 'react-hot-toast'

interface Product {
  id: number
  name: string
  supplier: string
  price: number
  image: string
  quantity: number
}

interface CouponType {
  code: string;
  amount: number;
  limit: number;
  supplier: string;
}

export default function CartPage() {
  const router = useRouter()
  const {
    items: products,
    selectedItems,
    removeItem,
    undoRemove,
    updateQuantity,
    toggleItemSelection,
    clearCart,
    getSelectedTotalPrice,
    getItemCount,
    lastRemovedItems,
    removeSelectedItems,
  } = useCartStore()

  const { user } = useUserStore()

  const [showCouponOverlay, setShowCouponOverlay] = useState(false)
  const [showUndoMessage, setShowUndoMessage] = useState(false)
  const [showCompleteShoppingMessage, setShowCompleteShoppingMessage] = useState(false)
  const [coupons] = useState<CouponType[]>([
    {
      code: "AYKON20",
      amount: 20,
      limit: 50,
      supplier: "Aykon Bilişim"
    },
    {
      code: "REMZI20",
      amount: 20,
      limit: 50,
      supplier: "Remzi Kitabevi"
    }
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const couponsPerPage = 4

  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    if (lastRemovedItems && lastRemovedItems.length > 0) {
      setShowUndoMessage(true)
      const timer = setTimeout(() => setShowUndoMessage(false), 5000)
      return () => clearTimeout(timer)
    } else {
      setShowUndoMessage(false)
    }
  }, [lastRemovedItems])

  const filteredCoupons = coupons.filter(coupon => 
    coupon.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCoupon = currentPage * couponsPerPage
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon)
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage)

  const handleRemoveProduct = (productId: number) => {
    removeItem(productId)
  }

  const handleUndoRemove = () => {
    undoRemove()
    setShowUndoMessage(false)
  }

  const handleQuantityChange = (productId: number, change: number) => {
    const product = products.find(p => p.productId === productId)
    if (product) {
      const newQuantity = product.quantity + change
      updateQuantity(productId, newQuantity)
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared!')
  }

  const handleCompleteShopping = async () => {
    setOrderError(null)

    if (selectedItems.length === 0) {
      setShowCompleteShoppingMessage(true)
      return
    }

    if (!user || !user.id) {
      toast.error('Please log in to complete your purchase.')
      return
    }

    setIsLoadingOrder(true)

    const selectedTotalPrice = getSelectedTotalPrice()
    const orderItemsPayload = products
      .filter(item => selectedItems.includes(item.id))
      .map(item => ({
        productID: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price
      }))

    const orderPayload = {
      userID: user.id,
      totalAmount: selectedTotalPrice,
      orderItems: orderItemsPayload,
    }

    try {
      const createdOrder = await createOrder(orderPayload)
      console.log('Order created successfully:', createdOrder)
      removeSelectedItems()
      
      // Check for possible variations of the order ID key
      const orderIdFromResponse = createdOrder?.orderId || createdOrder?.id || createdOrder?.orderID;

      if (orderIdFromResponse) { 
           toast.success('Order placed successfully! Redirecting to payment...');
           router.push(`/payment?orderId=${orderIdFromResponse}`);
      } else {
          console.error('Order created but a valid orderId (orderId, id, orderID) was not found in the response. Response was:', createdOrder);
          toast.error('Order created, but failed to proceed to payment. Please check My Orders.');
          router.push('/my-orders'); 
      }
    } catch (err: any) {
      console.error('Error creating order:', err)
      setOrderError(err.message || 'Failed to create order. Please try again.')
      toast.error(err.message || 'Failed to create order. Please try again.')
    } finally {
      setIsLoadingOrder(false)
    }
  }

  const selectedTotalPrice = getSelectedTotalPrice()
  const itemCount = getItemCount()

  // Store'dan gelen ürünleri konsola yazdır
  console.log('CartPage products state:', JSON.stringify(products, null, 2));

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-raleway text-[64px] font-normal text-left">
            My cart({itemCount} product{itemCount !== 1 ? 's' : ''})
          </h1>
          
          <div className="flex items-center gap-2 cursor-pointer" 
               style={{position: 'absolute', left: '983px', top: '179px'}}
               onClick={handleClearCart}>
            <span className="text-[#FFF600] font-raleway text-[24px]">Delete products</span>
            <Bin width={24} height={24} />
          </div>
        </div>

        <div className="w-[800px] h-[80px] bg-[#D9D9D9] rounded-lg flex items-center justify-between px-6"
             style={{position: 'absolute', left: '391px', top: '225px'}}>
          <div className="flex items-center gap-4">
            <Coupon width={32} height={32} color="#FF9D00" />
            <span className="font-raleway text-[32px] font-normal text-[#FF9D00]">My coupons</span>
            <ArrowRight width={32} height={32} />
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer"
               onClick={() => setShowCouponOverlay(true)}>
            <span className="font-raleway text-[32px] font-normal text-[#FF9D00]"
                  style={{position: 'absolute', left: '500px', top: '20px'}}>
              Add coupon code +
            </span>
          </div>
        </div>

        <div className="mt-[100px]">
          {products.map((product) => (
            <div key={product.id} 
                 className="w-[800px] h-[150px] bg-[#D9D9D9] rounded-lg mb-4 relative">
              <div className="absolute left-0 top-3 w-full px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-raleway text-[16px]">Supplier: </span>
                    <span className="font-raleway text-[16px] text-[#00FFB7]">{product.supplier}</span>
                    <ArrowRight width={16} height={16} />
                  </div>
                  {selectedItems.includes(product.id) && (
                    <span className="font-raleway text-[20px] font-normal text-[#008A09]">
                      Free shipping
                    </span>
                  )}
                </div>
                <div className="w-[800px] h-[0.5px] bg-[#665F5F] mt-2 -mx-6" />
              </div>

              <div className="absolute left-[20px] top-[45px] flex items-center">
                <input 
                  type="checkbox" 
                  className="w-[32px] h-[32px] absolute left-[6px] top-[36px]"
                  checked={selectedItems.includes(product.id)}
                  onChange={() => toggleItemSelection(product.productId)}
                />
                <div className="ml-[36px] flex items-center">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  
                  <div className="flex flex-col max-w-[400px] ml-4">
                    <div className="font-raleway text-[14px] leading-tight">
                      {product.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-[150px] top-[75px] flex items-center">
                <button onClick={() => handleQuantityChange(product.productId, -1)}
                        className="w-[30px] h-[30px] bg-[#F0F0F0] rounded-full flex items-center justify-center text-xl font-bold">
                    -
                </button>
                <span className="mx-3 font-raleway text-[20px]">{product.quantity}</span>
                <button onClick={() => handleQuantityChange(product.productId, 1)}
                        className="w-[30px] h-[30px] bg-[#F0F0F0] rounded-full flex items-center justify-center text-xl font-bold">
                    +
                </button>
              </div>

              <button className="absolute right-[20px] top-[110px]"
                      onClick={() => handleRemoveProduct(product.productId)}>
                <Bin width={20} height={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bg-[#D9D9D9] rounded-lg shadow-lg"
           style={{width: '255px', height: '300px', right: '372px', top: '205px'}}>
        <div className="p-4 flex flex-col h-full">
          <h2 className="font-red-hat-display text-[24px] font-normal text-center mb-4">
            Selected products ({selectedItems.length})
          </h2>
          
          <div className="text-center mb-2">
            <span className="font-red-hat-display text-[48px] font-normal">
              {selectedTotalPrice.toFixed(2)} TL
            </span>
          </div>

          <button 
            onClick={handleCompleteShopping}
            disabled={isLoadingOrder}
            className={`w-[230px] h-[50px] mx-auto bg-white hover:bg-[#FF9D00] rounded-lg transition-colors -mt-4 cursor-pointer ${isLoadingOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-inter text-[24px] font-normal">
              {isLoadingOrder ? 'Processing...' : 'Complete shopping'}
            </span>
          </button>

          {orderError && (
            <p className="text-red-600 text-sm mt-2 text-center">{orderError}</p>
          )}

          <div className="mt-auto">
            <div className="flex justify-between items-center mb-2 text-[#000000] opacity-40">
              <span className="font-red-hat-display">Products</span>
              <span className="font-red-hat-display">{selectedTotalPrice.toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between items-center text-[#000000] opacity-40">
              <span className="font-red-hat-display">Shipping</span>
              <div className="flex items-center gap-2">
                {selectedItems.length > 0 ? (
                  <>
                    <span className="font-inter text-[16px] font-normal text-[#008A09]">Free</span>
                    <span className="font-red-hat-display line-through">49.99 TL</span>
                  </>
                ) : (
                  <span className="font-red-hat-display">49.99 TL</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUndoMessage && (
        <MyCartMessage onClose={() => setShowUndoMessage(false)} onUndo={handleUndoRemove} />
      )}

      {showCompleteShoppingMessage && (
        <CompleteShopping onClose={() => setShowCompleteShoppingMessage(false)} />
      )}

      {showCouponOverlay && (
        <div className="fixed inset-0 flex items-start justify-end" style={{ zIndex: 9999 }}>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowCouponOverlay(false)}
          />
          
          <div className="relative bg-white rounded-lg shadow-lg mr-4 mt-4" 
               style={{ width: '450px', height: '900px', zIndex: 10000 }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-raleway text-[24px] font-normal">My Coupons</h2>
                <button 
                  onClick={() => setShowCouponOverlay(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Search by supplier"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-red-hat-display"
                />
              </div>

              <h3 className="font-raleway text-[18px] font-normal mb-4">Defined discount codes</h3>

              <div className="space-y-4 overflow-y-auto max-h-[600px] px-4">
                {currentCoupons.map((coupon, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0">
                      <Ticket width={342} height={104} />
                    </div>
                    <div className="relative z-10 p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[24px] font-bold font-red-hat-display text-black">{coupon.amount} TL discount</span>
                          <button className="px-4 py-1 bg-white rounded-lg text-sm hover:bg-gray-50 font-red-hat-display">
                            Use
                          </button>
                        </div>
                        <div className="text-sm text-[#5C5C5C]">Minimum limit: {coupon.limit} TL</div>
                        <div className="flex items-center mt-2">
                          <div className="w-full border-b border-dashed border-black"></div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">Valid until 12 January 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Valid for all products from supplier</span>
                          <span className="text-sm text-[#00FFB7]">{coupon.supplier}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mt-6 px-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-sm text-[#5C5C5C] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-sm text-[#5C5C5C] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
