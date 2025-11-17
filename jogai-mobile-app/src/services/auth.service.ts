import { authApi } from '../api/auth.api';
import { storageService } from './storage.service';
import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types/api.types';

/**
 * Authentication service with business logic
 */
export const authService = {
  /**
   * Login user and store tokens + sessionId
   * Requirements: 1.2, 2.1, 3.1, 3.2, 6.1
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      // Call login API
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, sessionId } = response;
      
      // Store tokens and sessionId
      await storageService.saveTokens(accessToken, refreshToken);
      await storageService.saveSessionId(sessionId);
      
      // Fetch user data with the new token
      const { userApi } = await import('../api/user.api');
      const user = await userApi.getCurrentUser();
      
      // Store user data
      await storageService.saveUser(user);

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Register new user (does NOT auto-login)
   * Requirements: 1.3, 7.2, 7.3, 7.4, 7.5
   * 
   * @param userData - Registration data with email, password, and optional phone/organizationName
   * @returns RegisterResponse with user data (id, name, email, optional organizationId/membershipId)
   * @throws {Error} Validation errors or registration failures with user-friendly messages
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Validate optional fields if provided
      if (userData.phone !== undefined && userData.phone !== null && userData.phone.trim() === '') {
        throw new Error('Telefone não pode ser vazio se fornecido');
      }
      
      if (userData.organizationName !== undefined && userData.organizationName !== null && userData.organizationName.trim() === '') {
        throw new Error('Nome da organização não pode ser vazio se fornecido');
      }
      
      // Call register API
      const response = await authApi.register(userData);
      
      // Return response directly - NO auto-login behavior
      // User must explicitly login after registration
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Logout user and clear all data
   * Requirements: 1.5, 2.3, 2.5
   * 
   * Retrieves sessionId from storage and calls logout API to invalidate the session.
   * Always clears all local data even if the API call fails.
   */
  async logout(): Promise<void> {
    try {
      // Retrieve sessionId from storage
      const sessionId = await storageService.getSessionId();
      
      if (sessionId) {
        // Call logout API with sessionId to invalidate session on backend
        await authApi.logout({ sessionId });
      } else {
        // Log warning if sessionId is missing but continue with local logout
        console.warn('Logout: sessionId not found in storage');
      }
    } catch (error) {
      // Continue with local logout even if API call fails
      // This ensures user can always logout locally
      console.error('Logout API error:', error);
    } finally {
      // Always clear all local data (tokens, sessionId, user data)
      // This happens regardless of API call success/failure
      await storageService.clearAll();
    }
  },

  /**
   * Request password reset email
   * Requirements: 8.1, 8.2
   * 
   * Sends a password reset email to the user with a reset token.
   * Uses endpoint: POST /auth/password/request-reset
   * 
   * @param email - User's email address
   * @throws {Error} User-friendly error messages for various failure scenarios
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await authApi.requestPasswordReset({ email });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Reset password with token from email
   * Requirements: 8.3, 8.4, 8.5
   * 
   * Resets user's password using the token received via email.
   * Uses endpoint: POST /auth/password/reset
   * 
   * @param token - Reset token from email
   * @param password - New password (must meet validation requirements)
   * @throws {Error} User-friendly error messages for invalid/expired tokens or validation errors
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await authApi.resetPassword({ token, password });
    } catch (error) {
      throw this.handleError(error);
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
      const user = await storageService.getUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },

  /**
   * Refresh authentication tokens using sessionId
   * Requirements: 1.4, 2.2, 4.2, 4.3, 4.4
   * 
   * @returns boolean indicating success (true) or failure (false)
   * @description Retrieves both refreshToken and sessionId from storage,
   * calls refresh API with both parameters, updates stored tokens on success,
   * and clears all data on failure.
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      const sessionId = await storageService.getSessionId();
      
      // Both refreshToken and sessionId are required
      if (!refreshToken || !sessionId) {
        console.warn('Refresh tokens: Missing refreshToken or sessionId');
        return false;
      }

      // Call refresh API with both sessionId and refreshToken
      const response = await authApi.refreshToken({ 
        sessionId, 
        refreshToken 
      });
      
      // Update stored tokens on success (sessionId remains the same)
      await storageService.saveTokens(response.accessToken, response.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear all data on refresh failure
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
      throw this.handleError(error);
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

  /**
   * Centralized error handling with user-friendly messages
   * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
   */
  handleError(error: any): Error {
    // Handle axios/HTTP errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          // Validation error - use backend message if available
          return new Error(message || 'Dados inválidos. Verifique os campos');
        case 401:
          // Authentication error
          return new Error('Email ou senha inválidos');
        case 429:
          // Rate limit error
          return new Error('Muitas tentativas. Tente novamente mais tarde');
        case 500:
          // Server error - don't expose technical details
          return new Error('Erro no servidor. Tente novamente');
        default:
          return new Error(message || 'Erro desconhecido. Tente novamente');
      }
    }
    
    // Handle network errors
    if (error.request) {
      return new Error('Erro de conexão. Verifique sua internet');
    }
    
    // Return original error if it's already an Error object
    return error instanceof Error ? error : new Error('Erro desconhecido');
  },
};
