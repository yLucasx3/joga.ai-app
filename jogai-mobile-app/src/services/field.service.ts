import { fieldApi } from '../api/field.api';
import { Field, FieldStatus, Sport } from '../types/activity.types';
import { CursorPaginatedResponse, CursorPaginationParams } from '../types/api.types';

/**
 * Field service with business logic
 */
export const fieldService = {
  /**
   * Get nearby fields
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
    try {
      return await fieldApi.getNearbyFields(latitude, longitude, filters, pagination);
    } catch (error) {
      console.error('Get nearby fields error:', error);
      throw error;
    }
  },

  /**
   * Get field by ID
   */
  async getFieldById(fieldId: string): Promise<Field> {
    try {
      return await fieldApi.getFieldById(fieldId);
    } catch (error) {
      console.error('Get field by ID error:', error);
      throw error;
    }
  },

  /**
   * Get available sports for a field (from establishment)
   * Note: Sports should come from the establishment in the API response
   */
  getAvailableSports(field: Field): Sport[] {
    // TODO: Update Establishment type to include sports array
    return (field.establishment as any)?.sports || [];
  },

  /**
   * Check if field has amenity
   */
  hasAmenity(field: Field, amenityKey: string): boolean {
    // Amenities are strings in the API
    return field.amenities.includes(amenityKey);
  },

  /**
   * Get field full address
   */
  getFullAddress(field: Field): string {
    const { address } = field.establishment;
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
   * Get field short address
   */
  getShortAddress(field: Field): string {
    const { address } = field.establishment;
    return `${address.street}, ${address.neighborhood}`;
  },

  /**
   * Calculate price for duration
   */
  calculatePrice(
    field: Field,
    durationMinutes: number,
    period: 'PEAK' | 'OFF_PEAK' | 'WEEKEND' | 'HOLIDAY' = 'PEAK'
  ): number {
    const rule = field.pricingRules?.find((r) => r.period === period);
    if (!rule) return 0;

    const hours = durationMinutes / 60;
    return rule.pricePerHour * hours;
  },

  /**
   * Get pricing range for a field
   */
  getPriceRange(field: Field): { min: number; max: number; currency: string } | null {
    if (!field.pricingRules || field.pricingRules.length === 0) {
      return null;
    }

    const prices = field.pricingRules.map((rule) => rule.pricePerHour);
    const currency = field.pricingRules[0].currency;

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency,
    };
  },

  /**
   * Format field dimensions
   */
  formatDimensions(field: Field): string | null {
    if (!field.dimensions) {
      return null;
    }

    const { length, width, unit } = field.dimensions;
    const unitLabel = unit === 'METERS' ? 'm' : 'ft';
    return `${length}${unitLabel} x ${width}${unitLabel}`;
  },

  /**
   * Check if field is active
   */
  isActive(field: Field): boolean {
    return field.status === 'ACTIVE';
  },
};
