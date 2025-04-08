"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFavoritesStore } from "@/app/stores/favoritesStore"
import Image from "next/image"

export default function FavoritesEditPage() {
  const router = useRouter()
  const { 
    products, 
    lists, 
    selectedCount,
    isAllSelected,
    toggleProductSelection,
    selectAllProducts,
    moveProductsToList,
    addList,
    removeList,
    renameList
  } = useFavoritesStore()

  const [newListName, setNewListName] = useState("")
  const [editingListId, setEditingListId] = useState<number | null>(null)
  const [editingListName, setEditingListName] = useState("")

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim())
      setNewListName("")
    }
  }

  const handleRenameList = (id: number) => {
    if (editingListName.trim()) {
      renameList(id, editingListName.trim())
      setEditingListId(null)
      setEditingListName("")
    }
  }

  const handleMoveToNewList = () => {
    if (newListName.trim()) {
      const selectedProducts = products.filter(p => p.selected).map(p => p.id)
    if (selectedProducts.length > 0) {
        const newListId = Date.now()
        addList(newListName.trim())
        moveProductsToList(selectedProducts, newListId)
        setNewListName("")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Favori Listeleri Düzenle</h1>
            <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Geri Dön
            </button>
          </div>

        {/* Seçili Ürünler ve Yeni Liste */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-semibold">{selectedCount} ürün seçildi</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => selectAllProducts(!isAllSelected)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isAllSelected ? "Seçimi Kaldır" : "Tümünü Seç"}
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Yeni liste adı"
                  className="px-4 py-2 border rounded-lg"
                />
              <button 
                  onClick={handleMoveToNewList}
                  disabled={!newListName.trim() || selectedCount === 0}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                  Yeni Listeye Taşı
              </button>
              </div>
            </div>
            </div>

          {/* Ürün Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id}
                className={`border rounded-lg p-4 ${
                  product.selected ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={product.selected}
                    onChange={() => toggleProductSelection(product.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="relative w-full h-40 mb-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">₺{product.price}</p>
                    {product.listId && (
                      <p className="text-sm text-gray-500">
                        Liste: {lists.find(l => l.id === product.listId)?.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mevcut Listeler */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Mevcut Listeler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <div key={list.id} className="border rounded-lg p-4">
                {editingListId === list.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingListName}
                      onChange={(e) => setEditingListName(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => handleRenameList(list.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => {
                        setEditingListId(null)
                        setEditingListName("")
                      }}
                      className="px-2 py-1 bg-gray-500 text-white rounded"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{list.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingListId(list.id)
                          setEditingListName(list.name)
                        }}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Düzenle
                      </button>
                  <button 
                        onClick={() => removeList(list.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                        Sil
                  </button>
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {products.filter(p => p.listId === list.id).length} ürün
                </p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  )
} 