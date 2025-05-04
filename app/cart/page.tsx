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
import { useCartStore, useCartActions } from '@/app/stores/cartStore'
import { useUserStore } from '@/app/stores/userStore'
import { createOrder, OrderPayloadDTO } from '@/services/API_Service'
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
    lastRemovedItems,
    isLoading,
    error: cartError,
    getSelectedTotalPrice,
    getItemCount,
    shippingCost
  } = useCartStore()

  const {
    removeItem,
    undoRemove,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    clearCart,
    removeSelectedItems,
    initializeCart
  } = useCartActions()

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
    initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    if (lastRemovedItems && lastRemovedItems.length > 0) {
      setShowUndoMessage(true)
      const timer = setTimeout(() => {
           setShowUndoMessage(false)
      }, 5000) 
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
  }

  const handleCompleteShopping = async () => {
    setOrderError(null)

    if (selectedItems.length === 0) {
      setShowCompleteShoppingMessage(true)
      return
    }

    if (!user || !user.id) {
      toast.error('Lütfen satın almayı tamamlamak için giriş yapın.')
      router.push('/signin');
      return
    }

    setIsLoadingOrder(true)

    const currentTotalPrice = getSelectedTotalPrice()
    const orderItemsPayload = products
      .filter(item => selectedItems.includes(item.productId))
      .map(item => ({
        productID: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price
      }))

    const orderPayload: OrderPayloadDTO = {
      userID: user.id,
      totalAmount: currentTotalPrice,
      orderItems: orderItemsPayload,
    }

    try {
      const createdOrder = await createOrder(orderPayload)
      console.log('Sipariş başarıyla oluşturuldu:', createdOrder)
      
      await removeSelectedItems()
      
      const orderIdFromResponse = createdOrder?.orderId || createdOrder?.id || createdOrder?.orderID;

      if (orderIdFromResponse) { 
           toast.success('Sipariş başarıyla oluşturuldu! Ödemeye yönlendiriliyorsunuz...');
           router.push(`/payment?orderId=${orderIdFromResponse}`);
      } else {
          console.error('Sipariş oluşturuldu ancak yanıtta geçerli bir orderId (orderId, id, orderID) bulunamadı. Yanıt:', createdOrder);
          toast.error('Sipariş oluşturuldu ancak ödemeye devam edilemedi. Lütfen Siparişlerim sayfasını kontrol edin.');
          router.push('/my-orders'); 
      }
    } catch (err: any) {
      console.error('Sipariş oluşturulurken hata:', err)
      const errorMessage = err.message || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.'
      setOrderError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingOrder(false)
    }
  }

  const currentSelectedTotalPrice = getSelectedTotalPrice()
  const currentItemCount = getItemCount()

  console.log('CartPage products state:', JSON.stringify(products, null, 2));

  if (isLoading && products.length === 0) {
     return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Sepetiniz yükleniyor...</span>
      </div>
     );
  }

  if (cartError) {
     return (
       <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
         <p>Hata: {cartError}</p>
         <button onClick={() => initializeCart()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
           Tekrar Dene
         </button>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-raleway text-[64px] font-normal text-left">
            Sepetim({currentItemCount} ürün)
          </h1>
          
          <div className="flex items-center gap-2 cursor-pointer" 
               style={{position: 'absolute', left: '983px', top: '179px'}}
               onClick={handleClearCart}
               title="Sepeti Temizle">
            <span className="text-[#FFF600] font-raleway text-[24px]">Ürünleri Sil</span>
            <Bin width={24} height={24} />
          </div>
        </div>

        <div className="w-[800px] h-[80px] bg-[#D9D9D9] rounded-lg flex items-center justify-between px-6"
             style={{position: 'absolute', left: '391px', top: '225px'}}>
          <div className="flex items-center gap-4">
            <Coupon width={32} height={32} color="#FF9D00" />
            <span className="font-raleway text-[32px] font-normal text-[#FF9D00]">Kuponlarım</span>
            <ArrowRight width={32} height={32} />
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer"
               onClick={() => setShowCouponOverlay(true)}>
            <span className="font-raleway text-[32px] font-normal text-[#FF9D00]"
                  style={{position: 'absolute', left: '500px', top: '20px'}}>
              Kupon kodu ekle +
            </span>
          </div>
        </div>

        <div className="mt-[100px]">
          {products.length === 0 && !isLoading ? (
             <p className="text-center text-gray-500 text-xl">Sepetiniz boş.</p>
          ) : (
            products.map((product) => (
              <div key={product.productId}
                   className="w-[800px] h-[150px] bg-[#D9D9D9] rounded-lg mb-4 relative">
                <div className="absolute left-0 top-3 w-full px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-raleway text-[16px]">Tedarikçi: </span>
                      <span className="font-raleway text-[16px] text-[#00FFB7]">{product.supplierName || 'Bilinmiyor'}</span>
                      <ArrowRight width={16} height={16} />
                    </div>
                    {selectedItems.includes(product.productId) && (
                      <span className="font-raleway text-[20px] font-normal text-[#008A09]">
                        Ücretsiz kargo
                      </span>
                    )}
                  </div>
                  <div className="w-[800px] h-[0.5px] bg-[#665F5F] mt-2 -mx-6" />
                </div>

                <div className="absolute left-[20px] top-[45px] flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-[32px] h-[32px] absolute left-[6px] top-[36px] cursor-pointer"
                    checked={selectedItems.includes(product.productId)}
                    onChange={() => toggleItemSelection(product.productId)}
                  />
                  <div className="ml-[36px] flex items-center">
                    <Image 
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.productName}
                      width={100}
                      height={100}
                      className="rounded-lg object-contain bg-white"
                    />
                    
                    <div className="flex flex-col max-w-[400px] ml-4">
                      <div className="font-raleway text-[14px] leading-tight">
                        {product.productName}
                      </div>
                      <div className="font-raleway text-[16px] font-bold text-blue-600 mt-1">
                        {product.price.toFixed(2)} TL
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[150px] top-[75px] flex items-center">
                  <button onClick={() => handleQuantityChange(product.productId, -1)}
                          className="w-[30px] h-[30px] bg-[#F0F0F0] rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300 disabled:opacity-50"
                          disabled={product.quantity <= 1 || isLoading}
                        >
                        -
                      </button>
                  <span className="mx-3 font-raleway text-[20px] w-8 text-center">{product.quantity}</span>
                  <button onClick={() => handleQuantityChange(product.productId, 1)}
                          className="w-[30px] h-[30px] bg-[#F0F0F0] rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300 disabled:opacity-50"
                           disabled={isLoading}
                        >
                        +
                      </button>
                </div>

                <button className="absolute right-[20px] top-[110px] text-gray-600 hover:text-red-500 disabled:opacity-50"
                        onClick={() => handleRemoveProduct(product.productId)}
                         disabled={isLoading}
                        title="Ürünü Kaldır">
                  <Bin width={20} height={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {products.length > 0 && (
             <div className="w-[400px] bg-[#D9D9D9] rounded-lg p-6 fixed right-[50px] top-[225px]">
                 <h2 className="font-raleway text-[32px] font-bold mb-4">Sipariş Özeti</h2>
                <div className="flex justify-between mb-2">
                     <span>Seçili Ürünler Toplamı:</span>
                    <span>{currentSelectedTotalPrice.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between mb-4">
                     <span>Kargo Ücreti:</span>
                    <span>{shippingCost.toFixed(2)} TL</span>
                </div>
                 <div className="border-t border-gray-400 pt-4 flex justify-between font-bold text-lg">
                     <span>Genel Toplam:</span>
                    <span>{(currentSelectedTotalPrice + (currentSelectedTotalPrice > 0 ? shippingCost : 0)).toFixed(2)} TL</span>
                 </div>
                <button 
                    onClick={handleCompleteShopping}
                     disabled={selectedItems.length === 0 || isLoadingOrder}
                    className="w-full mt-6 bg-[#FF9D00] text-white py-3 rounded-lg font-bold hover:bg-[#FFB84D] transition-colors disabled:opacity-50 flex items-center justify-center"
                 >
                     {isLoadingOrder ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Alışverişi Tamamla'}
                 </button>
                 {orderError && <p className="text-red-500 text-sm mt-2">{orderError}</p>}
             </div>
        )}
      </div>

      {showUndoMessage && lastRemovedItems && (
        <MyCartMessage 
           productName={lastRemovedItems[0]?.productName || 'Ürün'}
           onClose={() => setShowUndoMessage(false)} 
           onUndo={handleUndoRemove} 
        />
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
                <h2 className="font-raleway text-[24px] font-normal">Kuponlarım</h2>
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
                  placeholder="Tedarikçiye göre ara"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-red-hat-display"
                />
              </div>

              <h3 className="font-raleway text-[18px] font-normal mb-4">Tanımlı indirim kodları</h3>

              <div className="space-y-4 overflow-y-auto max-h-[600px] px-4">
                {currentCoupons.map((coupon, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0">
                      <Ticket width={342} height={104} />
                    </div>
                    <div className="relative z-10 p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[24px] font-bold font-red-hat-display text-black">{coupon.amount} TL indirim</span>
                          <button className="px-4 py-1 bg-white rounded-lg text-sm hover:bg-gray-50 font-red-hat-display">
                            Kullan
                          </button>
                        </div>
                        <div className="text-sm text-[#5C5C5C]">Minimum limit: {coupon.limit} TL</div>
                        <div className="flex items-center mt-2">
                          <div className="w-full border-b border-dashed border-black"></div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">12 Ocak 2025'e kadar geçerli</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Tedarikçiden tüm ürünlerde geçerli</span>
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
                  Önceki
                </button>
                <div className="text-sm">
                  Sayfa {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-sm text-[#5C5C5C] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
