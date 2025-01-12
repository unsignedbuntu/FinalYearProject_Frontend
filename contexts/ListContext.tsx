"use client"
import { createContext, useContext, useState, ReactNode } from 'react'

interface List {
  id: number;
  name: string;
  productCount: number;
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
  }>;
}

interface ListContextType {
  lists: List[];
  currentList: string | null;
  addList: (name: string) => void;
  addProductToList: (listId: number, product: List['products'][0]) => void;
  setCurrentList: (listName: string) => void;
  deleteList: (listId: number) => void;
  removeProductFromList: (listId: number, productId: number) => void;
}

const ListContext = createContext<ListContextType | null>(null)

export function ListProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<List[]>([
    { 
      id: 1, 
      name: "vadv", 
      productCount: 1,
      products: []
    },
    { 
      id: 2, 
      name: "fawfwa", 
      productCount: 0,
      products: []
    }
  ])
  const [currentList, setCurrentList] = useState<string | null>(null)

  const addList = (name: string) => {
    const newList = {
      id: Date.now(),
      name,
      productCount: 0,
      products: []
    }
    setLists(prev => [...prev, newList])
  }

  const addProductToList = (listId: number, product: List['products'][0]) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          products: [...list.products, product],
          productCount: list.productCount + 1
        }
      }
      return list
    }))
  }

  const deleteList = (listId: number) => {
    setLists(prev => prev.filter(list => list.id !== listId))
  }

  const removeProductFromList = (listId: number, productId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          products: list.products.filter(p => p.id !== productId),
          productCount: list.productCount - 1
        }
      }
      return list
    }))
  }

  return (
    <ListContext.Provider 
      value={{ 
        lists, 
        currentList,
        addList, 
        addProductToList,
        setCurrentList: setCurrentList,
        deleteList,
        removeProductFromList
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export function useLists() {
  const context = useContext(ListContext)
  if (!context) {
    throw new Error('useLists must be used within a ListProvider')
  }
  return context
} 