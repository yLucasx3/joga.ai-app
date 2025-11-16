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
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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
