import { sportApi, SportCategory } from '../api/sport.api';
import { Sport } from '../types/activity.types';

/**
 * Sport service with business logic
 */
export const sportService = {
  /**
   * Get all sports
   */
  async listSports(category?: SportCategory): Promise<Sport[]> {
    try {
      const sports = await sportApi.listSports(category);
      // Filter only active sports
      return sports.filter((sport) => sport.isActive);
    } catch (error) {
      console.error('List sports error:', error);
      throw error;
    }
  },

  /**
   * Get sport by key
   */
  getSportByKey(sports: Sport[], key: string): Sport | undefined {
    return sports.find((sport) => sport.key === key);
  },

  /**
   * Search sports by name
   */
  searchSports(sports: Sport[], query: string): Sport[] {
    if (!query || query.trim().length === 0) {
      return sports;
    }

    const lowerQuery = query.toLowerCase();
    return sports.filter((sport) =>
      sport.name.toLowerCase().includes(lowerQuery) ||
      sport.key.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter sports by category
   */
  filterByCategory(sports: Sport[], category: SportCategory): Sport[] {
    return sports.filter((sport) => sport.category === category);
  },
};
