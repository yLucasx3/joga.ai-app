import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../constants/config';
import { storageService } from '../services/storage.service';
import { ApiError, ErrorCode } from '../types/api.types';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Create API client for main app endpoints
 */
export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add authentication token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await storageService.getAccessToken();
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle network errors
      if (!error.response) {
        const apiError: ApiError = {
          code: ErrorCode.NETWORK_ERROR,
          message: 'Network error. Please check your internet connection.',
        };
        return Promise.reject(apiError);
      }

      // Handle 401 Unauthorized - Token refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue the request while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await storageService.getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Call refresh token endpoint
          const response = await authClient.post('/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Save new tokens
          await storageService.saveTokens(accessToken, newRefreshToken);

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          // Clear tokens and redirect to login
          await storageService.clearAll();
          
          const apiError: ApiError = {
            code: ErrorCode.UNAUTHORIZED,
            message: 'Session expired. Please login again.',
          };
          
          return Promise.reject(apiError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other errors
      return Promise.reject(parseApiError(error));
    }
  );

  return client;
};

/**
 * Create API client for authentication endpoints
 */
export const createAuthClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for auth client
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      console.error('[Auth Client] Error:', error);
      if (!error.response) {
        const apiError: ApiError = {
          code: ErrorCode.NETWORK_ERROR,
          message: 'Network error. Please check your internet connection.',
        };
        return Promise.reject(apiError);
      }
      
      return Promise.reject(parseApiError(error));
    }
  );

  return client;
};

/**
 * Parse API error response
 */
const parseApiError = (error: AxiosError): ApiError => {
  const response = error.response;

  if (!response) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network error occurred',
    };
  }

  console.log('[Auth Client] Response: ', response.data);
  const data = response.data as any;

  switch (response.status) {
    case 400:
      return {
        code: data?.code || ErrorCode.VALIDATION_ERROR,
        message: data?.message || 'Invalid request data',
        details: data?.details,
      };
    case 401:
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: data?.message || 'Authentication required',
      };
    case 403:
      return {
        code: ErrorCode.FORBIDDEN,
        message: data?.message || 'Access denied',
      };
    case 404:
      return {
        code: ErrorCode.NOT_FOUND,
        message: data?.message || 'Resource not found',
      };
    case 409:
      return {
        code: data?.code || ErrorCode.VALIDATION_ERROR,
        message: data?.message || 'Conflict occurred',
        details: data?.details,
      };
    case 500:
    case 502:
    case 503:
      return {
        code: ErrorCode.SERVER_ERROR,
        message: data?.message || 'Server error occurred',
      };
    default:
      return {
        code: data?.code || ErrorCode.SERVER_ERROR,
        message: data?.message || 'An unexpected error occurred',
        details: data?.details,
      };
  }
};

// Create client instances

export const apiClient = createApiClient(config.API_BASE_URL);
export const authClient = createAuthClient(config.API_AUTH_URL);
