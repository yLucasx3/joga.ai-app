import { authClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterResponse,
} from '../types/api.types';

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await authClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await authClient.post<RegisterResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await authClient.post<RefreshTokenResponse>('/auth/refresh', request);
    return response.data;
  },

  /**
   * Logout (invalidate tokens)
   */
  async logout(): Promise<void> {
    await authClient.post('/auth/logout');
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await authClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await authClient.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await authClient.post('/auth/verify-email', { token });
  },

  /**
   * Validate current token
   */
  async validateToken(): Promise<boolean> {
    try {
      await authClient.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },
};
