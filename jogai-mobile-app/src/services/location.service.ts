import * as Location from 'expo-location';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Location Service
 * Handles geolocation, permissions, and distance calculations
 */
class LocationService {
  private currentLocation: Coordinate | null = null;

  /**
   * Request location permissions from the user
   * @returns Permission status
   */
  async requestPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
      };
    }
  }

  /**
   * Check if location permissions are granted
   * @returns Permission status
   */
  async checkPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
      };
    }
  }

  /**
   * Get the current user location
   * @param useCache If true, returns cached location if available
   * @returns Current coordinate or null if unavailable
   */
  async getCurrentLocation(useCache: boolean = false): Promise<Coordinate | null> {
    try {
      // Return cached location if requested and available
      if (useCache && this.currentLocation) {
        return this.currentLocation;
      }

      // Check permissions first
      const { granted } = await this.checkPermissions();
      if (!granted) {
        console.warn('Location permissions not granted');
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coordinate: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Cache the location
      this.currentLocation = coordinate;

      return coordinate;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param from Starting coordinate
   * @param to Destination coordinate
   * @returns Distance in kilometers
   */
  calculateDistance(from: Coordinate, to: Coordinate): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(to.latitude - from.latitude);
    const dLon = this.toRadians(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(from.latitude)) *
        Math.cos(this.toRadians(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   * @param distance Distance in kilometers
   * @returns Formatted string (e.g., "1.5 km" or "500 m")
   */
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  }

  /**
   * Get default location (fallback when user location is unavailable)
   * Using São Paulo, Brazil as default
   */
  getDefaultLocation(): Coordinate {
    return {
      latitude: -23.5505,
      longitude: -46.6333,
    };
  }

  /**
   * Clear cached location
   */
  clearCache(): void {
    this.currentLocation = null;
  }

  /**
   * Watch user location for continuous updates
   * @param callback Function to call with new location
   * @returns Subscription object to remove the listener
   */
  async watchLocation(
    callback: (location: Coordinate) => void
  ): Promise<Location.LocationSubscription | null> {
    try {
      const { granted } = await this.checkPermissions();
      if (!granted) {
        console.warn('Location permissions not granted');
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 100, // Or when moved 100 meters
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          this.currentLocation = coordinate;
          callback(coordinate);
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
