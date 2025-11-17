import { authClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterResponse,
  LogoutRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '../types/api.types';

/**
 * Authentication API endpoints
 * All endpoints are aligned with backend implementation
 */
export const authApi = {
  /**
   * Login with email and password
   * Endpoint: POST /api/v1/auth/login
   * Returns: accessToken, refreshToken, and sessionId
   * @throws {Error} 401 for invalid credentials, 429 for rate limit
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Register a new user
   * Endpoint: POST /api/v1/auth/register
   * Returns: User data including id, name, email, and optional organizationId/membershipId
   * @throws {Error} 400 for validation errors, 409 for duplicate email
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await authClient.post<RegisterResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token and session ID
   * Endpoint: POST /api/v1/auth/refresh
   * Requires: sessionId and refreshToken
   * Returns: New accessToken and refreshToken
   * @throws {Error} 401 for invalid/expired refresh token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await authClient.post<RefreshTokenResponse>('/auth/refresh', request);
      return response.data;
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Logout and invalidate session
   * Endpoint: POST /api/v1/auth/logout
   * Requires: sessionId to invalidate the session on backend
   * @throws {Error} 401 for invalid session
   */
  async logout(request: LogoutRequest): Promise<void> {
    try {
      await authClient.post('/auth/logout', request);
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Request password reset email
   * Endpoint: POST /api/v1/auth/password/request-reset
   * Sends reset token to user's email
   * @throws {Error} 404 if email not found, 429 for rate limit
   */
  async requestPasswordReset(request: RequestPasswordResetRequest): Promise<void> {
    try {
      await authClient.post('/auth/password/request-reset', request);
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Reset password with token from email
   * Endpoint: POST /api/v1/auth/password/reset
   * Requires: token from email and new password
   * @throws {Error} 400 for invalid/expired token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      await authClient.post('/auth/password/reset', request);
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Send email verification
   * Endpoint: POST /api/v1/auth/email/send-verification
   * Sends verification token to user's email
   * @throws {Error} 429 for rate limit
   */
  async sendEmailVerification(email: string): Promise<void> {
    try {
      await authClient.post('/auth/email/send-verification', { email });
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Verify email with token
   * Endpoint: POST /api/v1/auth/email/verify
   * Verifies user's email address
   * @throws {Error} 400 for invalid/expired token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await authClient.post('/auth/email/verify', { token });
    } catch (error) {
      // Re-throw to allow service layer to handle
      throw error;
    }
  },

  /**
   * Validate current token
   * Note: This endpoint may not exist in backend - kept for backward compatibility
   * Consider removing if not implemented in backend
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
