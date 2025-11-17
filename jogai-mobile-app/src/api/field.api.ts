import { apiClient } from './client';
import { Field, FieldFilters, FieldStatus } from '../types/activity.types';
import { CursorPaginatedResponse, CursorPaginationParams } from '../types/api.types';

/**
 * Field API endpoints
 */
export const fieldApi = {
  /**
   * Get nearby fields with cursor pagination
   */
  async getNearbyFields(
    latitude: number,
    longitude: number,
    filters?: {
      radiusInKm?: number;
      status?: FieldStatus;
      sportKey?: string;
      establishmentId?: string;
    },
    pagination?: CursorPaginationParams
  ): Promise<CursorPaginatedResponse<Field>> {
    const params = {
      latitude,
      longitude,
      radiusInKm: filters?.radiusInKm || 10,
      status: filters?.status,
      sportKey: filters?.sportKey,
      establishmentId: filters?.establishmentId,
      cursor: pagination?.cursor,
      limit: pagination?.limit || 20,
    };

    const response = await apiClient.get<CursorPaginatedResponse<Field>>(
      '/app/fields/nearby',
      { params }
    );

    return response.data;
  },

  /**
   * Get field by ID (if endpoint exists)
   */
  async getFieldById(fieldId: string): Promise<Field> {
    const response = await apiClient.get<Field>(`/app/fields/${fieldId}`);
    return response.data;
  },
};
