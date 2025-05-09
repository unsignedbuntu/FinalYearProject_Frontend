// @ts-nocheck
"use client"

import { useRouter } from "next/navigation"
import { useFavoritesStore, useFavoritesActions } from "@/app/stores/favoritesStore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertTriangle } from "lucide-react"
import Sidebar from "@/components/sidebar/Sidebar"

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
    initializeFavorites
  } = useFavoritesActions()

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
  }

  return (
    <div className="min-h-screen pt-[160px] relative">
      <Sidebar />
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
                  key={product.id}
                  className={`border rounded-lg p-4 transition-colors duration-200 relative ${
                    selectedProductIds.has(product.id) 
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300" 
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <Checkbox
                    id={`select-${product.id}`}
                    checked={selectedProductIds.has(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                    className="absolute top-2 right-2 z-10 h-5 w-5"
                    aria-label={`Select ${product.name}`}
                  />
                  <label htmlFor={`select-${product.id}`} className="block cursor-pointer">
                    <div className="relative w-full aspect-square mb-3 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={product.imageUrl || "/placeholder.png"}
                        alt={product.name || "Product image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-700 text-sm sm:text-base font-medium">{product.price ? `₺${product.price.toFixed(2)}` : "Price not available"}</p>
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