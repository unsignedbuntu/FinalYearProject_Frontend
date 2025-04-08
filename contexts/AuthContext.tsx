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
}

// Define the structure for registration data
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Create the context with a default undefined value to check for provider presence
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  useEffect(() => {
    // Check authentication status when the app loads
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Call the /me endpoint to verify the cookie
        const response = await api.get('/api/Auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // No user data means not authenticated
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Check if it's an Axios error and has a response (like 401)
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

    checkAuth();
  }, []);

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

  const register = async (data: RegisterData) => {
    try {
      // Register endpoint doesn't automatically log in or set a cookie
      await api.post('/api/Auth/register', data);
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
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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