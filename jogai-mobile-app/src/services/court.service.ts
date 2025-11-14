import { courtApi } from '../api/court.api';
import { Court, CourtFilters, Establishment, Sport } from '../types/activity.types';
import { PaginatedResponse, PaginationParams } from '../types/api.types';

/**
 * Court service with business logic
 */
export const courtService = {
  /**
   * Get courts with filters
   */
  async getCourts(
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    try {
      return await courtApi.getCourts(filters, pagination);
    } catch (error) {
      console.error('Get courts error:', error);
      throw error;
    }
  },

  /**
   * Get court details by ID
   */
  async getCourtById(courtId: string): Promise<Court> {
    try {
      return await courtApi.getCourtById(courtId);
    } catch (error) {
      console.error('Get court by ID error:', error);
      throw error;
    }
  },

  /**
   * Search courts
   */
  async searchCourts(
    query: string,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    try {
      if (!query || query.trim().length === 0) {
        return await courtApi.getCourts(filters, pagination);
      }

      return await courtApi.searchCourts(query, filters, pagination);
    } catch (error) {
      console.error('Search courts error:', error);
      throw error;
    }
  },

  /**
   * Get nearby courts
   */
  async getNearbyCourts(
    latitude: number,
    longitude: number,
    radius: number = 10,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    try {
      return await courtApi.getNearbyCourts(latitude, longitude, radius, filters, pagination);
    } catch (error) {
      console.error('Get nearby courts error:', error);
      throw error;
    }
  },

  /**
   * Get courts by sport
   */
  async getCourtsBySport(
    sportKey: string,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    try {
      return await courtApi.getCourtsBySport(sportKey, filters, pagination);
    } catch (error) {
      console.error('Get courts by sport error:', error);
      throw error;
    }
  },

  /**
   * Get courts by establishment
   */
  async getCourtsByEstablishment(
    establishmentId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    try {
      return await courtApi.getCourtsByEstablishment(establishmentId, pagination);
    } catch (error) {
      console.error('Get courts by establishment error:', error);
      throw error;
    }
  },

  /**
   * Get establishment by ID
   */
  async getEstablishmentById(establishmentId: string): Promise<Establishment> {
    try {
      return await courtApi.getEstablishmentById(establishmentId);
    } catch (error) {
      console.error('Get establishment by ID error:', error);
      throw error;
    }
  },

  /**
   * Get all establishments
   */
  async getEstablishments(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Establishment>> {
    try {
      return await courtApi.getEstablishments(pagination);
    } catch (error) {
      console.error('Get establishments error:', error);
      throw error;
    }
  },

  /**
   * Search establishments
   */
  async searchEstablishments(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Establishment>> {
    try {
      if (!query || query.trim().length === 0) {
        return await courtApi.getEstablishments(pagination);
      }

      return await courtApi.searchEstablishments(query, pagination);
    } catch (error) {
      console.error('Search establishments error:', error);
      throw error;
    }
  },

  /**
   * Get nearby establishments
   */
  async getNearbyEstablishments(
    latitude: number,
    longitude: number,
    radius: number = 10,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Establishment>> {
    try {
      return await courtApi.getNearbyEstablishments(latitude, longitude, radius, pagination);
    } catch (error) {
      console.error('Get nearby establishments error:', error);
      throw error;
    }
  },

  /**
   * Check if court supports a specific sport
   */
  supportsSport(court: Court, sportKey: string): boolean {
    return court.sports.some((sport) => sport.key === sportKey);
  },

  /**
   * Get available sports for a court
   */
  getAvailableSports(court: Court): Sport[] {
    return court.sports;
  },

  /**
   * Check if court has a specific amenity
   */
  hasAmenity(court: Court, amenityKey: string): boolean {
    return court.amenities.some((amenity) => amenity.key === amenityKey);
  },

  /**
   * Filter courts by amenities
   */
  filterByAmenities(courts: Court[], amenityKeys: string[]): Court[] {
    if (!amenityKeys || amenityKeys.length === 0) {
      return courts;
    }

    return courts.filter((court) =>
      amenityKeys.every((key) => this.hasAmenity(court, key))
    );
  },

  /**
   * Filter courts by sport
   */
  filterBySport(courts: Court[], sportKey: string): Court[] {
    return courts.filter((court) => this.supportsSport(court, sportKey));
  },

  /**
   * Sort courts by distance
   */
  sortByDistance(courts: Court[], ascending: boolean = true): Court[] {
    return [...courts].sort((a, b) => {
      // Assuming distance is calculated and added to court object
      const distanceA = (a as any).distance || 0;
      const distanceB = (b as any).distance || 0;
      return ascending ? distanceA - distanceB : distanceB - distanceA;
    });
  },

  /**
   * Sort courts by capacity
   */
  sortByCapacity(courts: Court[], ascending: boolean = true): Court[] {
    return [...courts].sort((a, b) => {
      return ascending ? a.capacity - b.capacity : b.capacity - a.capacity;
    });
  },

  /**
   * Get court full address
   */
  getFullAddress(court: Court): string {
    const { address } = court.establishment;
    const parts = [
      address.street,
      address.number,
      address.complement,
      address.neighborhood,
      address.city,
      address.state,
    ].filter(Boolean);

    return parts.join(', ');
  },

  /**
   * Get court short address (street and neighborhood)
   */
  getShortAddress(court: Court): string {
    const { address } = court.establishment;
    return `${address.street}, ${address.neighborhood}`;
  },

  /**
   * Calculate price for a duration
   */
  calculatePrice(court: Court, durationMinutes: number, period: string = 'PEAK'): number {
    const pricingRule = court.pricingRules.find((rule) => rule.period === period);

    if (!pricingRule) {
      return 0;
    }

    const hours = durationMinutes / 60;
    return pricingRule.pricePerHour * hours;
  },

  /**
   * Get pricing range for a court
   */
  getPriceRange(court: Court): { min: number; max: number } {
    if (!court.pricingRules || court.pricingRules.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = court.pricingRules.map((rule) => rule.pricePerHour);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },

  /**
   * Format court dimensions
   */
  formatDimensions(court: Court): string | null {
    if (!court.dimensions) {
      return null;
    }

    const { length, width, unit } = court.dimensions;
    const unitLabel = unit === 'METERS' ? 'm' : 'ft';
    return `${length}${unitLabel} x ${width}${unitLabel}`;
  },
};
