'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/API_Service'; 
import axios from 'axios'; 
import Cookies from 'js-cookie'; // Çerez yönetimi eklendi

interface User {
  id: number; 
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; 
  password: string;
  confirmPassword: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Çerezde token yoksa boşuna backend'e gitme
      const token = Cookies.get('authToken');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Token varsa Backend'e kim olduğunu sor (Header içine Token'ı garanti olsun diye ekliyoruz)
      const response = await api.get(`/api/Auth/me?timestamp=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = async () => {
    await checkAuth();
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/Auth/login', { email, password });

      // Backend'den Token ve User bilgisi geldiyse
      if (response.data && response.data.token && response.data.user) {
        // 1. Token'ı JS Cookie ile tarayıcıya kaydet
        Cookies.set('authToken', response.data.token, { expires: 7 }); 
        
        // 2. State'i güncelle (Bu sayede Navbar anında değişecek!)
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log("Login successful, user state updated.");
      } else {
        throw new Error("Login response did not contain user data or token.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);

      if(axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  };

  const register = async (signUpFormData: RegisterData) => {
    // Register mantığın aynı kalıyor, dokunmadım
    try {
      let dateOfBirthString: string | null = null;
      if (signUpFormData.birthDay && signUpFormData.birthMonth && signUpFormData.birthYear) {
        const monthMap: { [key: string]: number } = {
            "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
            "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
        };
        const monthNumber = monthMap[signUpFormData.birthMonth];
        if (monthNumber) {
            const day = Number.parseInt(signUpFormData.birthDay, 10);
            const year = Number.parseInt(signUpFormData.birthYear, 10);
            if (!Number.isNaN(day) && !Number.isNaN(year)) {
                dateOfBirthString = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
      }

      const payload = {
        firstName: signUpFormData.firstName,
        lastName: signUpFormData.lastName,
        email: signUpFormData.email,
        phoneNumber: signUpFormData.phoneNumber || null,
        password: signUpFormData.password,
        confirmPassword: signUpFormData.confirmPassword, 
        dateOfBirth: dateOfBirthString,
      };

      await api.post('/api/Auth/register', payload);
    } catch (error) {
       if(axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
       } throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      // 1. Tarayıcıdan Cookie'yi sil
      Cookies.remove('authToken');
      
      // 2. Context state'ini sıfırla (Navbar eski haline dönecek)
      setUser(null);
      setIsAuthenticated(false);
      
      // 3. Backend'e çıkış bilgisini ver
      await api.post('/api/Auth/logout');
    } catch (error) {
       console.error("Logout failed:", error);
       Cookies.remove('authToken');
       setUser(null);
       setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};