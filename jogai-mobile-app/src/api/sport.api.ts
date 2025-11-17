import { apiClient } from './client';
import { Sport } from '../types/activity.types';

export type SportCategory =
  | 'BALL_SPORTS'
  | 'INDIVIDUAL'
  | 'GROUP'
  | 'WATER_SPORTS'
  | 'COMBAT'
  | 'FITNESS'
  | 'OTHER';

/**
 * Sport API endpoints
 */
export const sportApi = {
  /**
   * Get all sports
   */
  async listSports(category?: SportCategory): Promise<Sport[]> {
    const params = category ? { category } : undefined;

    const response = await apiClient.get<Sport[]>('/app/sports', { params });

    return response.data;
  },
};
