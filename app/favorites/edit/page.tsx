"use client"
import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Checkbox from '@/components/icons/Checkbox'
import Menu from '@/components/icons/Menu'
import CartFavorites from '@/components/icons/CartFavorites'
import DeleteOverlay from '@/components/messages/DeleteOverlay'

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
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
      
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