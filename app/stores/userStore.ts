import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: {
    id: string | null
    email: string | null
    name: string | null
    role: 'user' | 'admin' | null
  } | null
  isAuthenticated: boolean
  setUser: (user: UserState['user']) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
) 