import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';
import { User, LoginRequest, RegisterRequest, ApiError } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  /**
   * Initialize authentication state on app start
   * Non-blocking - allows app to load even if not authenticated
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if user has valid tokens
      const isAuth = await authService.isAuthenticated();

      if (isAuth) {
        // Load user data from storage
        const userData = await storageService.getUser();
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data - clear everything silently
          await authService.logout();
          setIsAuthenticated(false);
        }
      } else {
        // Not authenticated - this is OK, user can browse freely
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Don't block app on auth errors
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    
    try {
      const userData = await authService.login(credentials);
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      const newUser = await authService.register(userData);
      
      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh user data from storage
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await storageService.getUser();
      
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
