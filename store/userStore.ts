import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ user: null, isAuthenticated: false }),
  }))
);
