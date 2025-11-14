import { authApi } from '../api/auth.api';
import { storageService } from './storage.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types/api.types';

/**
 * Authentication service with business logic
 */
export const authService = {
  /**
   * Login user and store tokens
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await authApi.login(credentials);
      
      // Store tokens securely
      await storageService.saveTokens(response.accessToken, response.refreshToken);
      
      // Store user data
      await storageService.saveUser(response.user);
      
      // Store user preferences
      if (response.user.preferences) {
        await storageService.savePreferences(response.user.preferences);
      }

      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user and store tokens
   */
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await authApi.register(userData);
      
      // Store tokens securely
      await storageService.saveTokens(response.accessToken, response.refreshToken);
      
      // Store user data
      await storageService.saveUser(response.user);
      
      // Store user preferences (if any)
      if (response.user.preferences) {
        await storageService.savePreferences(response.user.preferences);
      }

      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout user and clear all data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate tokens on server
      await authApi.logout();
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear all local data
      await storageService.clearAll();
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await authApi.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await authApi.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await storageService.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storageService.getAccessToken();
      
      if (!token) {
        return false;
      }

      // Validate token with backend
      const isValid = await authApi.validateToken();
      
      if (!isValid) {
        // Clear invalid tokens
        await storageService.clearAll();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      
      if (!refreshToken) {
        return false;
      }

      const response = await authApi.refreshToken({ refreshToken });
      
      // Store new tokens
      await storageService.saveTokens(response.accessToken, response.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      await storageService.clearAll();
      return false;
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await authApi.verifyEmail(token);
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  /**
   * Check if onboarding is completed
   */
  async isOnboardingCompleted(): Promise<boolean> {
    return await storageService.isOnboardingCompleted();
  },

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(): Promise<void> {
    await storageService.setOnboardingCompleted(true);
  },
};
