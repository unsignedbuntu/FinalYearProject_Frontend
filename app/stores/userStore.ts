import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getAuthMe } from '@/services/API_Service'

export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber?: string | null
  // Backend'den gelen diğer alanlar eklenebilir
}

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  hasCheckedAuth: boolean
  actions: {
    setUser: (user: User | null) => void
    fetchUser: () => Promise<void>
    logout: () => void
    // login: (credentials) => Promise<void>
  }
}

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  hasCheckedAuth: false,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      actions: {
        setUser: (user) => set({ user, isLoading: false, error: null, hasCheckedAuth: true }),

        fetchUser: async () => {
          if (get().hasCheckedAuth || get().isLoading) return
          
          set({ isLoading: true, error: null })
          try {
            const userData = await getAuthMe()
            if (userData) {
              set({ user: userData, isLoading: false, error: null, hasCheckedAuth: true })
              console.log("Kullanıcı oturumu doğrulandı:", userData)
            } else {
              set({ user: null, isLoading: false, error: null, hasCheckedAuth: true })
               console.log("Aktif kullanıcı oturumu bulunamadı.")
            }
          } catch (error: any) {
            console.error('Kullanıcı bilgisi alınırken hata:', error)
            set({ user: null, isLoading: false, error: 'Oturum bilgisi alınamadı.', hasCheckedAuth: true })
          }
        },

        logout: () => {
          set(initialState)
          set({ hasCheckedAuth: true })
           console.log("Kullanıcı çıkış yaptı, state temizlendi.")
        },
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export const useUserActions = () => useUserStore((state) => state.actions) 