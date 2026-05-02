"use client"
<<<<<<< HEAD

import { useRouter } from "next/navigation"
import { useFavoritesStore, useFavoritesActions } from "@/app/stores/favoritesStore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertTriangle } from "lucide-react"
import Sidebar from "@/components/sidebar/Sidebar"
// import { useEffect } from "react" // Eğer initializeFavorites çağrılacaksa eklenebilir
// import { useUserStore } from "@/app/stores/userStore"; // Eğer initializeFavorites çağrılacaksa eklenebilir

export default function FavoritesEditPage() {
  const router = useRouter()
  const {
    products,
    isLoading,
    error,
    selectedProductIds,
  } = useFavoritesStore()

  const {
    toggleProductSelection,
    selectAllProducts,
    removeSelectedProducts,
    initializeFavoritesAndLists: initializeFavorites // MODIFIED: Destructure and alias
  } = useFavoritesActions()

  // const { user } = useUserStore(); // Eğer initializeFavorites çağrılacaksa

  // useEffect(() => { // Eğer bu sayfada favorilerin yüklenmesi gerekiyorsa
  //   if (user?.id) {
  //     initializeFavorites(user.id);
  //   }
  // }, [initializeFavorites, user]);

  const selectedCount = selectedProductIds.size
  const isAllSelected = products.length > 0 && selectedProductIds.size === products.length

  const handleRemoveSelected = async () => {
    await removeSelectedProducts()
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <AlertTriangle className="h-16 w-16 mb-4" />
        <p className="text-xl mb-4">Error loading favorites.</p>
        <p className="mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
=======
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Checkbox from '@/components/icons/Checkbox'
import Menu from '@/components/icons/Menu'
import CartFavorites from '@/components/icons/CartFavorites'
import DeleteOverlay from '@/components/overlay/DeleteOverlay'

interface Product {
  id: number;
  selected: boolean;
}

export default function EditListPage() {
  const [selectedCount, setSelectedCount] = useState(0)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [products, setProducts] = useState<Product[]>(
    Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      selected: false
    }))
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSelectAll = () => {
    const newIsAllSelected = !isAllSelected
    setIsAllSelected(newIsAllSelected)
    setProducts(products.map(product => ({
      ...product,
      selected: newIsAllSelected
    })))
    setSelectedCount(newIsAllSelected ? products.length : 0)
  }

  const handleSelectProduct = (productId: number) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, selected: !product.selected }
      }
      return product
    }))
    
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, selected: !product.selected } : product
    )
    const newSelectedCount = updatedProducts.filter(p => p.selected).length
    setSelectedCount(newSelectedCount)
    setIsAllSelected(newSelectedCount === products.length)
  }

  const handleDelete = () => {
    const selectedProducts = products.filter(p => p.selected)
    if (selectedProducts.length > 0) {
      setShowDeleteConfirm(true)
    }
  }

  const handleConfirmDelete = () => {
    setProducts(prev => prev.filter(p => !p.selected))
    setSelectedCount(0)
    setIsAllSelected(false)
>>>>>>> main
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
<<<<<<< HEAD
      <div className="ml-[480px]">
        <div className="flex justify-between items-center mb-6 mt-[30px] mr-[470px]">
          <h1 className="text-4xl font-semibold">Edit Favorites</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
        
        <div className="w-[1000px] h-auto bg-white mt-4 p-6 rounded-lg shadow-lg min-h-[750px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={(checked) => selectAllProducts(Boolean(checked))}
                disabled={products.length === 0}
                aria-label="Select all products"
              />
              <label htmlFor="select-all" className="font-semibold cursor-pointer">
                {selectedCount} / {products.length} selected
              </label>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Button 
                onClick={() => selectAllProducts(!isAllSelected)}
                disabled={products.length === 0}
                variant="secondary"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                onClick={handleRemoveSelected}
                disabled={selectedCount === 0}
                variant="destructive"
              >
                Delete Selected ({selectedCount})
              </Button>
            </div>
          </div>

          {products.length === 0 && !isLoading ? (
             <div className="text-center py-10 bg-white rounded-lg shadow">
               <p className="text-lg text-gray-500">No favorite products to edit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div 
                  key={product.Id}
                  className={`border rounded-lg p-4 transition-colors duration-200 relative ${
                    selectedProductIds.has(product.Id) 
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300" 
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <Checkbox
                    id={`select-${product.Id}`}
                    checked={selectedProductIds.has(product.  Id)}
                    onCheckedChange={() => toggleProductSelection(product.Id)}
                    className="absolute top-2 right-2 z-10 h-5 w-5"
                    aria-label={`Select ${product.ProductName}`}
                  />
                  <label htmlFor={`select-${product.Id}`} className="block cursor-pointer">
                    <div className="relative w-full aspect-square mb-3 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={`/api-proxy/product-image/${product.ProductId}`}
                        alt={product.ProductName || "Product image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 line-clamp-2">{product.ProductName}</h3>
                    <p className="text-gray-700 text-sm sm:text-base font-medium">{product.Price ? `₺${product.Price.toFixed(2)}` : "Price not available"}</p>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
=======
      
      <div className="ml-[480px]">
        <div className="mt-[30px]">
          <div className="flex justify-between items-center">
            <div className="w-[500px] h-[80px] bg-[#D9D9D9] flex items-center px-6 rounded-lg">
              <h1 className="font-inter text-[48px] font-normal">
                Edit list
              </h1>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-8 mt-4">
            <button 
              className="w-[185px] h-[50px] bg-[#D9D9D9] rounded-[10px] border-2
                        font-inter text-[24px] transition-all duration-200
                        hover:bg-[#FF9500] hover:text-[#00F6FF]"
              style={{ position: 'absolute', left: '1050px', top: '287px' }}
              onClick={handleDelete}
            >
              Delete selected
            </button>

            <button 
              className="w-[185px] h-[50px] bg-[#8F8F8F] rounded-[10px] border-2
                        font-inter text-[24px] transition-all duration-200
                        hover:bg-[#FF0048] hover:text-[#00F6FF]"
              style={{ position: 'absolute', left: '1270px', top: '287px' }}
            >
              Move selected
            </button>
          </div>

          {/* Selection Status */}
          <div className="flex items-center justify-between" 
               style={{ position: 'absolute', left: '947px', top: '357px', width: '508px' }}>
            <span className="font-inter text-[24px] text-[#FF0000]">
              {selectedCount === 0 
                ? "No product selected" 
                : `${selectedCount} product${selectedCount > 1 ? 's' : ''} selected`}
            </span>

            <div className="flex items-center gap-2">
              <button onClick={handleSelectAll} className="flex items-center gap-2">
                <Checkbox checked={isAllSelected} size={25} />
                <span className="font-inter text-[24px]">
                  Choose all ({selectedCount})
                </span>
              </button>
            </div>
          </div>

          {/* Ana içerik alanı */}
          <div className="w-[1000px] h-[750px] bg-[#FFFFFF] mt-4 p-6 rounded-lg">
            {/* Filtre butonları */}
            <div className="flex items-center gap-4">
              <button 
                className="w-[140px] h-[50px] border border-[#FF8800] rounded-lg font-inter text-[16px] 
                          transition-colors text-[#FF8800]"
              >
                In stock
              </button>
              
              <button 
                className="w-[160px] h-[50px] border border-gray-300 rounded-lg font-inter text-[16px] 
                          transition-colors hover:text-[#FF8800] ml-4"
              >
                Out of stock
              </button>
            </div>

            {/* Ürün Grid'i */}
            <div className="grid grid-cols-4 gap-6 mt-8">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="w-[200px] h-[200px] rounded-lg relative bg-[#D9D9D9]"
                >
                  <div className="absolute top-2 left-2 z-20">
                    <button onClick={() => handleSelectProduct(product.id)}>
                      <Checkbox checked={product.selected} size={25} />
                    </button>
                  </div>
                  <button 
                    className="absolute top-2 right-2 z-10"
                  >
                    <Menu />
                  </button>
                  <div className="absolute bottom-1 right-1">
                    <CartFavorites />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteOverlay
          productCount={selectedCount}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
} 
>>>>>>> main
