// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  ACTIVITY_FULL = 'ACTIVITY_FULL',
  ALREADY_PARTICIPANT = 'ALREADY_PARTICIPANT',
}

// Authentication Types

/**
 * Login request payload
 * Endpoint: POST /api/v1/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response from backend
 * Endpoint: POST /api/v1/auth/login
 * Returns access token, refresh token, and session ID for managing user session
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

/**
 * Register request payload
 * Endpoint: POST /api/v1/auth/register
 * Note: phone and organizationName are optional fields
 */
export interface RegisterRequest {
  email: string;
  password: string;
  phone?: string | null;
  organizationName?: string | null;
}

/**
 * Register response from backend
 * Endpoint: POST /api/v1/auth/register
 * Returns user data including optional organization and membership IDs
 */
export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  organizationId?: string;
  membershipId?: string;
}

/**
 * Refresh token request payload
 * Endpoint: POST /api/v1/auth/refresh
 * Requires both sessionId and refreshToken to obtain new tokens
 */
export interface RefreshTokenRequest {
  sessionId: string;
  refreshToken: string;
}

/**
 * Refresh token response from backend
 * Endpoint: POST /api/v1/auth/refresh
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Logout request payload
 * Endpoint: POST /api/v1/auth/logout
 * Requires sessionId to invalidate the session on backend
 */
export interface LogoutRequest {
  sessionId: string;
}

/**
 * Request password reset payload
 * Endpoint: POST /api/v1/auth/password/request-reset
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Reset password payload
 * Endpoint: POST /api/v1/auth/password/reset
 * Requires token from email and new password
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // avatarUrl?: string;
  // preferences: UserPreferences;
  // createdAt: string;
  // updatedAt: string;
}

export interface UserPreferences {
  sports: string[];
  notificationsEnabled: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdatePreferencesRequest {
  sports?: string[];
  notificationsEnabled?: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cursor Pagination (para Fields)
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor?: string;
    hasMore: boolean;
    limit: number;
  };
}
