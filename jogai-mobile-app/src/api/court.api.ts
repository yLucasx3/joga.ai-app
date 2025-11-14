import { apiClient } from './client';
import { Court, CourtFilters, Establishment } from '../types/activity.types';
import { PaginatedResponse, PaginationParams } from '../types/api.types';

/**
 * Court API endpoints
 */
export const courtApi = {
  /**
   * Get all courts with optional filters and pagination
   */
  async getCourts(
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Court>>('/courts', {
      params,
    });

    return response.data;
  },

  /**
   * Get court by ID
   */
  async getCourtById(courtId: string): Promise<Court> {
    const response = await apiClient.get<Court>(`/courts/${courtId}`);
    return response.data;
  },

  /**
   * Search courts by query
   */
  async searchCourts(
    query: string,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    const params = {
      search: query,
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Court>>('/courts/search', {
      params,
    });

    return response.data;
  },

  /**
   * Get nearby courts based on location
   */
  async getNearbyCourts(
    latitude: number,
    longitude: number,
    radius: number = 10,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    const params = {
      latitude,
      longitude,
      radius,
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Court>>('/courts/nearby', {
      params,
    });

    return response.data;
  },

  /**
   * Get courts by sport
   */
  async getCourtsBySport(
    sportKey: string,
    filters?: CourtFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    const params = {
      sportKeys: [sportKey],
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Court>>('/courts', {
      params,
    });

    return response.data;
  },

  /**
   * Get courts by establishment
   */
  async getCourtsByEstablishment(
    establishmentId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Court>> {
    const response = await apiClient.get<PaginatedResponse<Court>>(
      `/establishments/${establishmentId}/courts`,
      { params: pagination }
    );

    return response.data;
  },

  /**
   * Get establishment by ID
   */
  async getEstablishmentById(establishmentId: string): Promise<Establishment> {
    const response = await apiClient.get<Establishment>(`/establishments/${establishmentId}`);
    return response.data;
  },

  /**
   * Get all establishments with pagination
   */
  async getEstablishments(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Establishment>> {
    const response = await apiClient.get<PaginatedResponse<Establishment>>(
      '/establishments',
      { params: pagination }
    );

    return response.data;
  },

  /**
   * Search establishments by query
   */
  async searchEstablishments(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Establishment>> {
    const params = {
      search: query,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Establishment>>(
      '/establishments/search',
      { params }
    );

    return response.data;
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
    const params = {
      latitude,
      longitude,
      radius,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Establishment>>(
      '/establishments/nearby',
      { params }
    );

    return response.data;
  },
};
