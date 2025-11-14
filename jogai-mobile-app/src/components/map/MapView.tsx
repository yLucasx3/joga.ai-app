import React, { useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapViewComponent, { Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Activity } from '../../types/activity.types';
import { Coordinate } from '../../services/location.service';
import { ActivityMarker } from './ActivityMarker';
import { colors } from '../../theme/colors';

interface MapViewProps {
  activities: Activity[];
  onMarkerPress: (activity: Activity) => void;
  onRegionChange?: (region: Region) => void;
  userLocation?: Coordinate | null;
  showUserLocation?: boolean;
  initialRegion?: Region;
}

const DEFAULT_DELTA = 0.05; // Zoom level

/**
 * Map view component for displaying activities
 */
export const MapView: React.FC<MapViewProps> = ({
  activities,
  onMarkerPress,
  onRegionChange,
  userLocation,
  showUserLocation = true,
  initialRegion,
}) => {
  const mapRef = useRef<MapViewComponent>(null);

  /**
   * Get initial region based on user location or default
   */
  const getInitialRegion = useCallback((): Region => {
    if (initialRegion) return initialRegion;

    const location = userLocation || {
      latitude: -23.5505,
      longitude: -46.6333,
    };

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    };
  }, [userLocation, initialRegion]);

  /**
   * Handle region change with debouncing
   */
  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (onRegionChange) {
        onRegionChange(region);
      }
    },
    [onRegionChange]
  );

  /**
   * Animate to user location
   */
  const animateToUserLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      });
    }
  }, [userLocation]);

  /**
   * Fit map to show all activities
   */
  const fitToActivities = useCallback(() => {
    if (activities.length > 0 && mapRef.current) {
      const coordinates = activities.map((activity) => ({
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  }, [activities]);

  /**
   * Memoize activity markers for performance
   */
  const activityMarkers = useMemo(() => {
    return activities.map((activity) => (
      <ActivityMarker
        key={activity.id}
        activity={activity}
        onPress={onMarkerPress}
      />
    ));
  }, [activities, onMarkerPress]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={getInitialRegion()}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
        loadingEnabled={true}
        loadingIndicatorColor={colors.primary}
        loadingBackgroundColor={colors.background}
        moveOnMarkerPress={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {activityMarkers}
      </MapViewComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
