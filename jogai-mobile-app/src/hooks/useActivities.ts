import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityApi } from '../api/activity.api';
import {
  Activity,
  ActivityFilters,
  CreateActivityRequest,
  ParticipationRequest,
} from '../types/activity.types';
import { PaginationParams } from '../types/api.types';

/**
 * Query keys for activities
 */
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters?: ActivityFilters) => [...activityKeys.lists(), filters] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
  nearby: (lat: number, lng: number, radius: number, filters?: ActivityFilters) =>
    [...activityKeys.all, 'nearby', lat, lng, radius, filters] as const,
  search: (query: string, filters?: ActivityFilters) =>
    [...activityKeys.all, 'search', query, filters] as const,
};

/**
 * Hook to fetch activities with filters
 */
export const useActivities = (
  filters?: ActivityFilters,
  pagination?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => activityApi.getActivities(filters, pagination),
    enabled,
  });
};

/**
 * Hook to fetch nearby activities
 */
export const useNearbyActivities = (
  latitude: number,
  longitude: number,
  radius: number = 10,
  filters?: ActivityFilters,
  pagination?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: activityKeys.nearby(latitude, longitude, radius, filters),
    queryFn: () =>
      activityApi.getNearbyActivities(latitude, longitude, radius, filters, pagination),
    enabled: enabled && !!latitude && !!longitude,
  });
};

/**
 * Hook to fetch activity by ID
 */
export const useActivity = (activityId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: activityKeys.detail(activityId),
    queryFn: () => activityApi.getActivityById(activityId),
    enabled: enabled && !!activityId,
  });
};

/**
 * Hook to search activities
 */
export const useSearchActivities = (
  query: string,
  filters?: ActivityFilters,
  pagination?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: activityKeys.search(query, filters),
    queryFn: () => activityApi.searchActivities(query, filters, pagination),
    enabled: enabled && query.length > 0,
  });
};

/**
 * Hook to create activity
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) => activityApi.createActivity(data),
    onSuccess: () => {
      // Invalidate activities list to refetch
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

/**
 * Hook to join activity
 */
export const useJoinActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityId,
      data,
    }: {
      activityId: string;
      data: ParticipationRequest;
    }) => activityApi.joinActivity(activityId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific activity and lists
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

/**
 * Hook to cancel participation
 */
export const useCancelParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityId,
      participantId,
    }: {
      activityId: string;
      participantId: string;
    }) => activityApi.cancelParticipation(activityId, participantId),
    onSuccess: (_, variables) => {
      // Invalidate specific activity and lists
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};

/**
 * Hook to cancel activity
 */
export const useCancelActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) => activityApi.cancelActivity(activityId),
    onSuccess: (_, activityId) => {
      // Invalidate specific activity and lists
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(activityId) });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
  });
};
