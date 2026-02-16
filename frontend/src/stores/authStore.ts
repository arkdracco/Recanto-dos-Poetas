import { create } from 'zustand';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'reader' | 'author' | 'admin';
  emailVerified: boolean;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (userStr && accessToken) {
      const user = JSON.parse(userStr);
      set({ user, accessToken, refreshToken, isAuthenticated: true });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data;

      get().setUser(user);
      get().setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      get().setUser(user);
      get().setTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data;
      get().setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      get().logout();
    }
  },
}));
