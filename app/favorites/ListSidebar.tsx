"use client"
import { useRouter, usePathname } from 'next/navigation'
import { useFavoritesStore, useFavoritesActions } from '@/app/stores/favoritesStore'
import { useEffect } from 'react'
import Add from '@/components/icons/Add'
// import { PlusCircleIcon } from '@heroicons/react/24/outline'; // Example of a different icon library

export default function ListSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const { lists, isLoadingLists } = useFavoritesStore()
  const { createFavoriteList, initializeFavoritesAndLists } = useFavoritesActions()

  useEffect(() => {
    // This ensures lists are loaded if the sidebar is used on a page 
    // that doesn't already initialize the store, or for direct navigation.
    // If FavoritesPage (or similar parent) always initializes, this might be redundant,
    // but it provides robustness.
    if (lists.length === 0 && !isLoadingLists) {
        // initializeFavoritesAndLists(); // Potentially call if lists are empty and not loading
        // Decided to let parent components manage initialization primarily to avoid multiple calls.
    }
  }, [lists.length, isLoadingLists, initializeFavoritesAndLists])

  const handleCreateNewList = async () => {
    const listName = prompt("Enter new list name:")
    if (listName && listName.trim() !== "") {
      // For simplicity, isPrivate is false. A modal/form could offer this option.
      await createFavoriteList(listName.trim(), false)
    }
  }

  if (pathname === null) return null

  return (
    <div className="w-[280px] bg-white p-4 border-r border-gray-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-inter text-xl font-semibold text-gray-700">
          My Lists
        </h2>
        <button
          onClick={handleCreateNewList}
          className="p-1.5 hover:bg-gray-100 rounded-full text-blue-500 hover:text-blue-600 transition-colors"
          title="Create new list"
        >
          <Add className="w-5 h-5" />
          {/* <PlusCircleIcon className="w-6 h-6" /> */}
        </button>
      </div>

      {isLoadingLists && lists.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !isLoadingLists && lists.length === 0 ? (
        <p className="text-gray-500 text-sm text-center px-2 py-4">No lists created yet. Click the '+' to start!</p>
      ) : (
        <div className="space-y-1.5 overflow-y-auto flex-grow">
          {lists.map(list => (
            <button
              key={list.id}
              className={`w-full flex items-center justify-between p-2.5 text-left rounded-md transition-colors
                        ${pathname === `/favorites/lists/${list.id}` || pathname === `/favorites/lists/${encodeURIComponent(list.name)}` 
                          ? 'bg-blue-500 text-white font-medium shadow-sm'
                          : 'hover:bg-gray-100 text-gray-600'}`}
              onClick={() => router.push(`/favorites/lists/${list.id}`)} 
            >
              <span className="font-inter text-[14px] truncate flex-1" title={list.name}>
                {list.name}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-2 ${ 
                pathname === `/favorites/lists/${list.id}` || pathname === `/favorites/lists/${encodeURIComponent(list.name)}`
                  ? 'bg-white/25 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {list.productIds.length}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}   