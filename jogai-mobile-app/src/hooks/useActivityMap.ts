import { useState, useCallback, useMemo } from 'react';
import { Activity } from '../types/activity.types';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapState {
  center: Coordinate;
  zoom: number;
  selectedMarkerId: string | null;
  visibleMarkerIds: string[];
  isUserInteracting: boolean;
}

export interface UseActivityMapReturn {
  mapState: MapState;
  setMapCenter: (center: Coordinate) => void;
  setMapZoom: (zoom: number) => void;
  selectMarker: (activityId: string | null) => void;
  updateVisibleMarkers: (activityIds: string[]) => void;
  centerOnActivity: (activity: Activity) => void;
  centerOnUser: () => void;
  setUserInteracting: (interacting: boolean) => void;
}

const DEFAULT_ZOOM = 13;

/**
 * Custom hook to manage map state and synchronization with activity list
 * 
 * @param activities - List of activities to display on map
 * @param userLocation - Current user location
 * @returns Map state and methods to manipulate map
 * 
 * @example
 * const { mapState, centerOnActivity, selectMarker } = useActivityMap(activities, userLocation);
 */
export function useActivityMap(
  activities: Activity[],
  userLocation: Coordinate | null
): UseActivityMapReturn {
  const [mapState, setMapState] = useState<MapState>({
    center: userLocation || { latitude: -23.5505, longitude: -46.6333 }, // São Paulo default
    zoom: DEFAULT_ZOOM,
    selectedMarkerId: null,
    visibleMarkerIds: [],
    isUserInteracting: false,
  });

  /**
   * Update map center
   */
  const setMapCenter = useCallback((center: Coordinate) => {
    setMapState((prev) => ({
      ...prev,
      center,
    }));
  }, []);

  /**
   * Update map zoom level
   */
  const setMapZoom = useCallback((zoom: number) => {
    setMapState((prev) => ({
      ...prev,
      zoom,
    }));
  }, []);

  /**
   * Select a marker on the map
   */
  const selectMarker = useCallback((activityId: string | null) => {
    setMapState((prev) => ({
      ...prev,
      selectedMarkerId: activityId,
    }));
  }, []);

  /**
   * Update the list of visible markers in the current viewport
   */
  const updateVisibleMarkers = useCallback((activityIds: string[]) => {
    setMapState((prev) => ({
      ...prev,
      visibleMarkerIds: activityIds,
    }));
  }, []);

  /**
   * Center map on a specific activity
   */
  const centerOnActivity = useCallback((activity: Activity) => {
    setMapState((prev) => ({
      ...prev,
      center: activity.location,
      selectedMarkerId: activity.id,
    }));
  }, []);

  /**
   * Center map on user's current location
   */
  const centerOnUser = useCallback(() => {
    if (userLocation) {
      setMapState((prev) => ({
        ...prev,
        center: userLocation,
        selectedMarkerId: null,
      }));
    }
  }, [userLocation]);

  /**
   * Set whether user is currently interacting with the map
   */
  const setUserInteracting = useCallback((interacting: boolean) => {
    setMapState((prev) => ({
      ...prev,
      isUserInteracting: interacting,
    }));
  }, []);

  return {
    mapState,
    setMapCenter,
    setMapZoom,
    selectMarker,
    updateVisibleMarkers,
    centerOnActivity,
    centerOnUser,
    setUserInteracting,
  };
}
