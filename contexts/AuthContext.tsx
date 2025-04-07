'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/API_Service'; // Import the configured Axios instance
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Import JwtPayload

// Define the structure of the JWT payload based on your backend
interface CustomJwtPayload extends JwtPayload {
  // Standard claims (like sub, exp are already in JwtPayload)
  // Add custom claims from your token (adjust based on your backend)
  email?: string;
  fullName?: string; // Corrected: Use fullName to match backend claim
  // Add other claims like roles if needed: roles?: string[];
}

interface User {
  id: string; // JWT 'sub' is typically a string
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

// Match this with your backend's RegisterDto
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string; // Re-added: Required by backend DTO validation
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        // Check if token is expired (optional but recommended)
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired");
          localStorage.removeItem('token');
          setIsLoading(false);
          return;
        }

        // Set user data from decoded token - Use fullName
        if (decoded.sub && decoded.email && decoded.fullName) { // Corrected: Check for fullName
          setUser({
            id: decoded.sub,
            email: decoded.email,
            fullName: decoded.fullName, // Corrected: Use fullName
          });
          setIsAuthenticated(true);
        } else {
          console.error("Token missing required claims (sub, email, fullName)"); // Updated error message
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); // Finish initial loading check
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use the imported 'api' instance and the correct full path from Swagger
      const response = await api.post('/api/Auth/login', { email, password }); // Corrected path
      const { token } = response.data; // Assuming backend returns { token: "..." }
      localStorage.setItem('token', token);

      const decoded = jwtDecode<CustomJwtPayload>(token);
      // Use fullName after login as well
      if (decoded.sub && decoded.email && decoded.fullName) { // Corrected: Check for fullName
        setUser({
          id: decoded.sub,
          email: decoded.email,
          fullName: decoded.fullName, // Corrected: Use fullName
        });
        setIsAuthenticated(true);
      } else {
        throw new Error("Login successful, but token missing required claims.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Clear any potential leftover state on failure
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw error to be caught in the component
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Send the complete userData, including confirmPassword, as backend expects it
      await api.post('/api/Auth/register', userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw error to be caught in the component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Optionally redirect to login page
    // window.location.href = '/signin'; // Could use router.push if needed
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {!isLoading && children} {/* Render children only when loading is complete */}
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