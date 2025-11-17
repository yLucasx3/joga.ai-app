import { apiClient } from './client';
import { User, UpdateUserRequest, UpdatePreferencesRequest } from '../types/api.types';

/**
 * User API endpoints
 */
export const userApi = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<User>('/users/me', updates);
    return response.data;
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: UpdatePreferencesRequest): Promise<User> {
    const response = await apiClient.patch<User>('/users/me/preferences', preferences);
    return response.data;
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(imageUri: string): Promise<{ avatarUrl: string }> {
    // Create form data for image upload
    const formData = new FormData();
    
    // Extract file info from URI
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<{ avatarUrl: string }>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Delete profile avatar
   */
  async deleteAvatar(): Promise<void> {
    await apiClient.delete('/users/me/avatar');
  },

  /**
   * Update notification token (for push notifications)
   */
  async updateNotificationToken(token: string, platform: 'ios' | 'android'): Promise<void> {
    await apiClient.post('/users/me/notification-token', {
      token,
      platform,
    });
  },

  /**
   * Remove notification token
   */
  async removeNotificationToken(token: string): Promise<void> {
    await apiClient.delete('/users/me/notification-token', {
      data: { token },
    });
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    organizedCount: number;
    participatedCount: number;
    completedCount: number;
  }> {
    const response = await apiClient.get(`/users/${userId}/stats`);
    return response.data;
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/me');
  },
};
