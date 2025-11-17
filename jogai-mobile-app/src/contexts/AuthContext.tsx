import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';
import { User, LoginRequest, RegisterRequest } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
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
   * Requirements: 9.1, 9.2
   * 
   * Checks for accessToken, refreshToken, and sessionId.
   * Loads user data if all three are present.
   * Sets isAuthenticated based on complete auth state.
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for all three required auth components
      const [accessToken, refreshToken, sessionId, userData] = await Promise.all([
        storageService.getAccessToken(),
        storageService.getRefreshToken(),
        storageService.getSessionId(),
        storageService.getUser(),
      ]);

      // All three tokens AND user data must be present for valid auth state
      if (accessToken && refreshToken && sessionId && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Incomplete auth state - clear everything silently
        if (accessToken || refreshToken || sessionId || userData) {
          // Some data exists but not all - clean up
          await storageService.clearAll();
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Don't block app on auth errors
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   * Requirements: 9.3
   * 
   * Calls authService.login, updates user state on success,
   * and propagates errors to UI.
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    
    try {
      // Call authService.login which handles token + sessionId storage
      const userData = await authService.login(credentials);
      
      // Update user state on success
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Propagate errors to UI for display
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   * Requirements: 7.4
   * 
   * Calls authService.register but does NOT update user state (no auto-login).
   * Returns success to allow navigation to login screen.
   */
  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      // Call authService.register - returns RegisterResponse, not User
      await authService.register(userData);
      
      // Do NOT update user state - no auto-login behavior
      // User must explicitly login after registration
      // This allows navigation to login screen with success message
    } catch (error) {
      // Propagate errors to UI for display
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   * Requirements: 9.4
   * 
   * Calls authService.logout, clears user state,
   * and handles errors gracefully.
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call authService.logout which handles API call and storage cleanup
      await authService.logout();
      
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Handle errors gracefully - even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      console.error('Request password reset error:', error);
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

  /**
   * Refresh authentication tokens
   * Requirements: 9.5
   * 
   * Calls authService.refreshTokens, clears user state on failure,
   * and keeps user state on success.
   */
  const refreshAuth = useCallback(async () => {
    try {
      // Call authService.refreshTokens which handles sessionId + refreshToken
      const success = await authService.refreshTokens();
      
      if (!success) {
        // Clear user state on failure
        setUser(null);
        setIsAuthenticated(false);
      }
      // On success, keep user state unchanged (tokens updated in storage)
    } catch (error) {
      console.error('Refresh auth error:', error);
      // Clear user state on error
      setUser(null);
      setIsAuthenticated(false);
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
    requestPasswordReset,
    refreshUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
