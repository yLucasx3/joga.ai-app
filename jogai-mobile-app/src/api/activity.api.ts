import { apiClient } from './client';
import {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ParticipationRequest,
  ActivityFilters,
} from '../types/activity.types';
import { PaginatedResponse, PaginationParams } from '../types/api.types';

/**
 * Activity API endpoints
 */
export const activityApi = {
  /**
   * Get all activities with optional filters and pagination
   */
  async getActivities(
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Activity>>('/activities', {
      params,
    });

    return response.data;
  },

  /**
   * Get activity by ID
   */
  async getActivityById(activityId: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/activities/${activityId}`);
    return response.data;
  },

  /**
   * Get activity by share token (public access)
   */
  async getActivityByShareToken(shareToken: string): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/activities/share/${shareToken}`);
    return response.data;
  },

  /**
   * Create a new activity
   */
  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    const response = await apiClient.post<Activity>('/activities', activityData);
    return response.data;
  },

  /**
   * Update an existing activity
   */
  async updateActivity(
    activityId: string,
    updates: UpdateActivityRequest
  ): Promise<Activity> {
    const response = await apiClient.patch<Activity>(`/activities/${activityId}`, updates);
    return response.data;
  },

  /**
   * Delete an activity
   */
  async deleteActivity(activityId: string): Promise<void> {
    await apiClient.delete(`/activities/${activityId}`);
  },

  /**
   * Cancel an activity
   */
  async cancelActivity(activityId: string): Promise<Activity> {
    const response = await apiClient.post<Activity>(`/activities/${activityId}/cancel`);
    return response.data;
  },

  /**
   * Join an activity (create participation)
   */
  async joinActivity(
    activityId: string,
    participationData: ParticipationRequest
  ): Promise<Activity> {
    const response = await apiClient.post<Activity>(
      `/activities/${activityId}/participants`,
      participationData
    );
    return response.data;
  },

  /**
   * Cancel participation in an activity
   */
  async cancelParticipation(activityId: string, participantId: string): Promise<Activity> {
    const response = await apiClient.delete<Activity>(
      `/activities/${activityId}/participants/${participantId}`
    );
    return response.data;
  },

  /**
   * Get user's organized activities
   */
  async getOrganizedActivities(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const response = await apiClient.get<PaginatedResponse<Activity>>(
      `/users/${userId}/organized-activities`,
      { params: pagination }
    );
    return response.data;
  },

  /**
   * Get user's participating activities
   */
  async getParticipatingActivities(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const response = await apiClient.get<PaginatedResponse<Activity>>(
      `/users/${userId}/participating-activities`,
      { params: pagination }
    );
    return response.data;
  },

  /**
   * Search activities by query
   */
  async searchActivities(
    query: string,
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const params = {
      search: query,
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Activity>>('/activities/search', {
      params,
    });

    return response.data;
  },

  /**
   * Get nearby activities based on location
   */
  async getNearbyActivities(
    latitude: number,
    longitude: number,
    radiusInKm: number = 10,
    filters?: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<{ activities: Activity[], total: number }> {
    const params: Record<string, any> = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radiusInKm: radiusInKm.toString(),
    };

    // Add optional filters
    if (filters?.type) params.type = filters.type;
    if (filters?.sportKeys && filters.sportKeys.length > 0) {
      params.sportKey = filters.sportKeys[0]; // API accepts single sportKey
    }
    if (filters?.status) params.status = filters.status;

    const response = await apiClient.get<{
      activities: Activity[];
      total: number;
    }>('/activities/nearby/list', { params });

    return response.data;
  },
};
