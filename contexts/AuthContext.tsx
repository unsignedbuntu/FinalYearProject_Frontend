'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/API_Service'; // Import configured Axios instance
import axios, { AxiosError } from 'axios'; // Import axios for isAxiosError check

// Define the structure for the user object based on backend response
interface User {
  id: number; // Or string depending on your backend ID type
  email: string;
  fullName: string;
  // Add other relevant user properties if needed (e.g., roles)
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To track initial auth check
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Define the structure for registration data
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; // Opsiyonel yaptık, çünkü sign-up formunda da opsiyonel
  password: string;
  confirmPassword: string;
  // Doğum tarihi için sign-up formundan gelen alanlar
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
}

// Create the context with a default undefined value to check for provider presence
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  const checkAuth = async () => {
    console.log('[AuthContext] checkAuth called');
    setIsLoading(true);
    try {
      const response = await api.get(`/api/Auth/me?timestamp=${Date.now()}`);
      console.log('[AuthContext] /api/Auth/me response user data:', response.data.user);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
         console.log(`Auth check failed: ${error.response.status}`);
      } else {
        console.error("Error checking auth status:", error);
      }
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = async () => {
    console.log("[AuthContext] refreshUser called");
    console.log("[AuthContext] Refreshing user data...");
    await checkAuth();
  };

  const login = async (email: string, password: string) => {
    try {
      // Backend now sets the HttpOnly cookie on successful login
      const response = await api.post('/api/Auth/login', { email, password });

      if (response.data && response.data.user) {
        // Update user state with data returned from login endpoint
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log("Login successful, user state updated.");
      } else {
        // Handle unexpected response format
        throw new Error("Login response did not contain user data.");
      }
      // No need to handle token in frontend anymore

    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      if (axios.isAxiosError(error) && error.response) {
        // Use the error message from the backend if available
        throw new Error(error.response.data?.message || 'Login failed'); // Match backend message property (lowercase message)
      } else if (error instanceof Error) {
        throw new Error(error.message || 'An unexpected error occurred during login.');
      } else {
         throw new Error('An unexpected error occurred during login.');
      }
    }
  };

  const register = async (signUpFormData: RegisterData) => {
    try {
      let dateOfBirthString: string | null = null;

      if (signUpFormData.birthDay && signUpFormData.birthMonth && signUpFormData.birthYear) {
        const monthMap: { [key: string]: number } = {
            "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
            "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
        };
        const monthNumber = monthMap[signUpFormData.birthMonth];

        if (monthNumber) {
            const day = parseInt(signUpFormData.birthDay, 10);
            const year = parseInt(signUpFormData.birthYear, 10);
            if (!isNaN(day) && !isNaN(year)) {
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
        // confirmPassword backend DTO'sunda yoksa gönderilmesine gerek yok,
        // backend zaten Password ve ConfirmPassword eşleşmesini RegisterDto içinde [Compare] attribute ile yapıyor.
        // Eğer backend DTO'nuzda ConfirmPassword yoksa bu satırı kaldırabilirsiniz.
        // Şimdilik backend DTO'nuzda olduğunu varsayarak bırakıyorum, RegisterDto.cs'i kontrol edin.
         confirmPassword: signUpFormData.confirmPassword, 
        dateOfBirth: dateOfBirthString,
      };

      console.log("[AuthContext] Register payload to API:", payload); // API'ye giden payload'ı logla

      // Register endpoint doesn't automatically log in or set a cookie
      await api.post('/api/Auth/register', payload);
       console.log("Registration successful.");
      // Optionally redirect to login or show success message
      // No state change needed here as register doesn't log the user in
    } catch (error) {
      console.error("Registration failed:", error);
       if (axios.isAxiosError(error) && error.response) {
           // Use the error message from the backend if available
           const backendErrors = error.response.data?.errors; // Check for specific validation errors
           const errorMessage = error.response.data?.message || 'Registration failed';
           if(backendErrors){
             // You might want to format multiple validation errors here
             const errorMessages = Object.values(backendErrors).flat().join(', ');
             throw new Error(errorMessages || errorMessage);
           } else {
             throw new Error(errorMessage);
           }
       } else if (error instanceof Error) {
         throw new Error(error.message || 'An unexpected error occurred during registration.');
       } else {
           throw new Error('An unexpected error occurred during registration.');
       }
    }
  };

  const logout = async () => {
    console.log("Logout function called! Timestamp:", new Date().toISOString());
    try {
      // Call the backend logout endpoint to clear the HttpOnly cookie
      await api.post('/api/Auth/logout');
      setUser(null);
      setIsAuthenticated(false);
       console.log("Logout successful.");
    } catch (error) {
      console.error("Logout failed:", error);
       // Even if backend call fails, clear frontend state
       setUser(null);
       setIsAuthenticated(false);
       // Consider how to handle logout errors - usually, just logging out the frontend is sufficient
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 