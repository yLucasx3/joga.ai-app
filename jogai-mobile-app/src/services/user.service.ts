import { userApi } from '../api/user.api';
import { storageService } from './storage.service';
import { User, UpdateUserRequest, UpdatePreferencesRequest } from '../types/api.types';

/**
 * User service with business logic
 */
export const userService = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const user = await userApi.getCurrentUser();
      
      // Update cached user data
      await storageService.saveUser(user);
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      return await userApi.getUserById(userId);
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    try {
      // Validate updates
      if (updates.name !== undefined && updates.name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }

      if (updates.phone !== undefined && updates.phone.trim().length === 0) {
        throw new Error('Phone number cannot be empty');
      }

      const user = await userApi.updateProfile(updates);
      
      // Update cached user data
      await storageService.saveUser(user);
      
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: UpdatePreferencesRequest): Promise<User> {
    try {
      const user = await userApi.updatePreferences(preferences);
      
      // Update cached user data
      await storageService.saveUser(user);
      
      // Update cached preferences
      if (user.preferences) {
        await storageService.savePreferences(user.preferences);
      }
      
      return user;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(imageUri: string): Promise<string> {
    try {
      const result = await userApi.uploadAvatar(imageUri);
      
      // Update user profile with new avatar URL
      const user = await this.getCurrentUser();
      
      return result.avatarUrl;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },

  /**
   * Delete profile avatar
   */
  async deleteAvatar(): Promise<void> {
    try {
      await userApi.deleteAvatar();
      
      // Update cached user data
      await this.getCurrentUser();
    } catch (error) {
      console.error('Delete avatar error:', error);
      throw error;
    }
  },

  /**
   * Update notification token
   */
  async updateNotificationToken(token: string, platform: 'ios' | 'android'): Promise<void> {
    try {
      await userApi.updateNotificationToken(token, platform);
    } catch (error) {
      console.error('Update notification token error:', error);
      throw error;
    }
  },

  /**
   * Remove notification token
   */
  async removeNotificationToken(token: string): Promise<void> {
    try {
      await userApi.removeNotificationToken(token);
    } catch (error) {
      console.error('Remove notification token error:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    organizedCount: number;
    participatedCount: number;
    completedCount: number;
  }> {
    try {
      return await userApi.getUserStats(userId);
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      await userApi.deleteAccount();
      
      // Clear all local data
      await storageService.clearAll();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  /**
   * Add sport to user preferences
   */
  async addSportPreference(sportKey: string): Promise<User> {
    try {
      const user = await storageService.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      const currentSports = user.preferences?.sports || [];
      
      if (currentSports.includes(sportKey)) {
        return user;
      }

      const updatedSports = [...currentSports, sportKey];
      
      return await this.updatePreferences({ sports: updatedSports });
    } catch (error) {
      console.error('Add sport preference error:', error);
      throw error;
    }
  },

  /**
   * Remove sport from user preferences
   */
  async removeSportPreference(sportKey: string): Promise<User> {
    try {
      const user = await storageService.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      const currentSports = user.preferences?.sports || [];
      const updatedSports = currentSports.filter((key: string) => key !== sportKey);
      
      return await this.updatePreferences({ sports: updatedSports });
    } catch (error) {
      console.error('Remove sport preference error:', error);
      throw error;
    }
  },

  /**
   * Set multiple sport preferences
   */
  async setSportPreferences(sportKeys: string[]): Promise<User> {
    try {
      return await this.updatePreferences({ sports: sportKeys });
    } catch (error) {
      console.error('Set sport preferences error:', error);
      throw error;
    }
  },

  /**
   * Toggle notification preferences
   */
  async toggleNotifications(enabled: boolean): Promise<User> {
    try {
      return await this.updatePreferences({ notificationsEnabled: enabled });
    } catch (error) {
      console.error('Toggle notifications error:', error);
      throw error;
    }
  },

  /**
   * Get cached user data
   */
  async getCachedUser(): Promise<User | null> {
    try {
      return await storageService.getUser();
    } catch (error) {
      console.error('Get cached user error:', error);
      return null;
    }
  },

  /**
   * Get cached preferences
   */
  async getCachedPreferences(): Promise<any | null> {
    try {
      return await storageService.getPreferences();
    } catch (error) {
      console.error('Get cached preferences error:', error);
      return null;
    }
  },

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    // Basic phone validation - adjust regex based on requirements
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    // Remove non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX for Brazilian numbers
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    
    // Format as (XX) XXXX-XXXX for landlines
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  /**
   * Get user initials for avatar fallback
   */
  getUserInitials(user: User): string {
    const names = user.name.trim().split(' ');
    
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  },

  /**
   * Get user display name (first name)
   */
  getDisplayName(user: User): string {
    return user.name.split(' ')[0];
  },

  /**
   * Get user full name
   */
  getFullName(user: User): string {
    return user.name;
  },
};
