import { activityApi } from '../api/activity.api';
import {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ParticipationRequest,
  ActivityFilters,
  ActivityStatus,
} from '../types/activity.types';
import { PaginatedResponse, PaginationParams } from '../types/api.types';

/**
 * Activity service with business logic
 */
export const activityService = {
  /**
   * Get activities with filters
   */
  async getActivities(
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    try {
      return await activityApi.getActivities(filters, pagination);
    } catch (error) {
      console.error('Get activities error:', error);
      throw error;
    }
  },

  /**
   * Get activity details by ID
   */
  async getActivityById(activityId: string): Promise<Activity> {
    try {
      return await activityApi.getActivityById(activityId);
    } catch (error) {
      console.error('Get activity by ID error:', error);
      throw error;
    }
  },

  /**
   * Get activity by share token
   */
  async getActivityByShareToken(shareToken: string): Promise<Activity> {
    try {
      return await activityApi.getActivityByShareToken(shareToken);
    } catch (error) {
      console.error('Get activity by share token error:', error);
      throw error;
    }
  },

  /**
   * Create a new activity
   */
  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    try {
      // Validate dates
      const startDate = new Date(activityData.startDate);
      const endDate = new Date(activityData.endDate);

      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }

      if (startDate < new Date()) {
        throw new Error('Start date must be in the future');
      }

      // Validate max players
      if (activityData.maxPlayers < 2) {
        throw new Error('Activity must allow at least 2 players');
      }

      return await activityApi.createActivity(activityData);
    } catch (error) {
      console.error('Create activity error:', error);
      throw error;
    }
  },

  /**
   * Update an activity
   */
  async updateActivity(
    activityId: string,
    updates: UpdateActivityRequest
  ): Promise<Activity> {
    try {
      // Validate dates if provided
      if (updates.startDate && updates.endDate) {
        const startDate = new Date(updates.startDate);
        const endDate = new Date(updates.endDate);

        if (startDate >= endDate) {
          throw new Error('End date must be after start date');
        }
      }

      return await activityApi.updateActivity(activityId, updates);
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  },

  /**
   * Delete an activity
   */
  async deleteActivity(activityId: string): Promise<void> {
    try {
      await activityApi.deleteActivity(activityId);
    } catch (error) {
      console.error('Delete activity error:', error);
      throw error;
    }
  },

  /**
   * Cancel an activity
   */
  async cancelActivity(activityId: string): Promise<Activity> {
    try {
      return await activityApi.cancelActivity(activityId);
    } catch (error) {
      console.error('Cancel activity error:', error);
      throw error;
    }
  },

  /**
   * Join an activity
   */
  async joinActivity(
    activityId: string,
    participationData: ParticipationRequest
  ): Promise<Activity> {
    try {
      // Validate participation data
      if (!participationData.name || participationData.name.trim().length === 0) {
        throw new Error('Name is required');
      }

      if (!participationData.phone || participationData.phone.trim().length === 0) {
        throw new Error('Phone number is required');
      }

      return await activityApi.joinActivity(activityId, participationData);
    } catch (error) {
      console.error('Join activity error:', error);
      throw error;
    }
  },

  /**
   * Cancel participation
   */
  async cancelParticipation(activityId: string, participantId: string): Promise<Activity> {
    try {
      return await activityApi.cancelParticipation(activityId, participantId);
    } catch (error) {
      console.error('Cancel participation error:', error);
      throw error;
    }
  },

  /**
   * Get user's organized activities
   */
  async getOrganizedActivities(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    try {
      return await activityApi.getOrganizedActivities(userId, pagination);
    } catch (error) {
      console.error('Get organized activities error:', error);
      throw error;
    }
  },

  /**
   * Get user's participating activities
   */
  async getParticipatingActivities(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    try {
      return await activityApi.getParticipatingActivities(userId, pagination);
    } catch (error) {
      console.error('Get participating activities error:', error);
      throw error;
    }
  },

  /**
   * Search activities
   */
  async searchActivities(
    query: string,
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    try {
      if (!query || query.trim().length === 0) {
        return await activityApi.getActivities(filters, pagination);
      }

      return await activityApi.searchActivities(query, filters, pagination);
    } catch (error) {
      console.error('Search activities error:', error);
      throw error;
    }
  },

  /**
   * Get nearby activities
   */
  async getNearbyActivities(
    latitude: number,
    longitude: number,
    radius: number = 10,
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    try {
      return await activityApi.getNearbyActivities(
        latitude,
        longitude,
        radius,
        filters,
        pagination
      );
    } catch (error) {
      console.error('Get nearby activities error:', error);
      throw error;
    }
  },

  /**
   * Check if activity is full
   */
  isFull(activity: Activity): boolean {
    return activity.currentPlayers >= activity.maxPlayers || activity.status === 'FULL';
  },

  /**
   * Check if activity is active
   */
  isActive(activity: Activity): boolean {
    return activity.status === 'ACTIVE';
  },

  /**
   * Check if activity is cancelled
   */
  isCancelled(activity: Activity): boolean {
    return activity.status === 'CANCELLED';
  },

  /**
   * Check if user is participant
   */
  isUserParticipant(activity: Activity, userId: string): boolean {
    return activity.participants.some(
      (p) => p.id === userId && p.status === 'CONFIRMED'
    );
  },

  /**
   * Check if user is organizer
   */
  isUserOrganizer(activity: Activity, userId: string): boolean {
    return activity.organizer.id === userId;
  },

  /**
   * Get available spots
   */
  getAvailableSpots(activity: Activity): number {
    return Math.max(0, activity.maxPlayers - activity.currentPlayers);
  },

  /**
   * Calculate activity duration in minutes
   */
  getDuration(activity: Activity): number {
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  },

  /**
   * Check if share link is expired
   */
  isShareLinkExpired(activity: Activity): boolean {
    if (!activity.shareExpiresAt) {
      return false;
    }

    return new Date(activity.shareExpiresAt) < new Date();
  },

  /**
   * Filter activities by sport
   */
  filterBySport(activities: Activity[], sportKeys: string[]): Activity[] {
    if (!sportKeys || sportKeys.length === 0) {
      return activities;
    }

    return activities.filter((activity) => sportKeys.includes(activity.sportKey));
  },

  /**
   * Filter activities by status
   */
  filterByStatus(activities: Activity[], status: ActivityStatus): Activity[] {
    return activities.filter((activity) => activity.status === status);
  },

  /**
   * Sort activities by date
   */
  sortByDate(activities: Activity[], ascending: boolean = true): Activity[] {
    return [...activities].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  },

  /**
   * Sort activities by distance
   */
  sortByDistance(activities: Activity[], ascending: boolean = true): Activity[] {
    return [...activities].sort((a, b) => {
      // Assuming distance is calculated and added to activity object
      const distanceA = (a as any).distance || 0;
      const distanceB = (b as any).distance || 0;
      return ascending ? distanceA - distanceB : distanceB - distanceA;
    });
  },
};
