import { useState, useEffect, useCallback } from 'react';
import { locationService, Coordinate, LocationPermissionStatus } from '../services/location.service';
import * as Location from 'expo-location';

interface UseLocationReturn {
  location: Coordinate | null;
  loading: boolean;
  error: string | null;
  permissionStatus: LocationPermissionStatus | null;
  requestPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  calculateDistance: (to: Coordinate) => number | null;
}

/**
 * Custom hook for managing user location
 */
export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);

  /**
   * Request location permissions
   */
  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await locationService.requestPermissions();
      setPermissionStatus(status);

      if (status.granted) {
        await refreshLocation();
      } else {
        setError('Location permission denied');
        // Use default location as fallback
        setLocation(locationService.getDefaultLocation());
      }
    } catch (err) {
      setError('Failed to request location permission');
      console.error('Error requesting permission:', err);
      setLocation(locationService.getDefaultLocation());
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh current location
   */
  const refreshLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLocation = await locationService.getCurrentLocation(false);
      
      if (currentLocation) {
        setLocation(currentLocation);
      } else {
        setError('Unable to get current location');
        setLocation(locationService.getDefaultLocation());
      }
    } catch (err) {
      setError('Failed to get location');
      console.error('Error getting location:', err);
      setLocation(locationService.getDefaultLocation());
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Calculate distance from current location to target
   */
  const calculateDistance = useCallback(
    (to: Coordinate): number | null => {
      if (!location) return null;
      return locationService.calculateDistance(location, to);
    },
    [location]
  );

  /**
   * Initialize location on mount
   */
  useEffect(() => {
    const initLocation = async () => {
      try {
        setLoading(true);
        
        // Check existing permissions
        const status = await locationService.checkPermissions();
        setPermissionStatus(status);

        if (status.granted) {
          // Get current location
          const currentLocation = await locationService.getCurrentLocation(true);
          if (currentLocation) {
            setLocation(currentLocation);
          } else {
            setLocation(locationService.getDefaultLocation());
          }
        } else {
          // Use default location
          setLocation(locationService.getDefaultLocation());
        }
      } catch (err) {
        console.error('Error initializing location:', err);
        setError('Failed to initialize location');
        setLocation(locationService.getDefaultLocation());
      } finally {
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
    calculateDistance,
  };
};

/**
 * Custom hook for watching location changes
 */
export const useLocationWatch = (
  enabled: boolean = true
): {
  location: Coordinate | null;
  error: string | null;
} => {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        subscription = await locationService.watchLocation((newLocation) => {
          setLocation(newLocation);
        });
      } catch (err) {
        console.error('Error watching location:', err);
        setError('Failed to watch location');
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled]);

  return { location, error };
};
