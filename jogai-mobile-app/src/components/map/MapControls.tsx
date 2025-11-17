import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
  userLocation: { latitude: number; longitude: number } | null;
}

/**
 * MapControls component for map interaction buttons
 */
export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onCenterOnUser,
  userLocation,
}) => {
  return (
    <View style={styles.container}>
      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        {/* Zoom In */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onZoomIn}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Zoom in"
          accessibilityRole="button"
          accessibilityHint="Double tap to zoom in on the map"
        >
          <Ionicons name="add" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Zoom Out */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onZoomOut}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Zoom out"
          accessibilityRole="button"
          accessibilityHint="Double tap to zoom out on the map"
        >
          <Ionicons name="remove" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Center on User Location */}
      {userLocation && (
        <TouchableOpacity
          style={[styles.controlButton, styles.locationButton]}
          onPress={onCenterOnUser}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Center on my location"
          accessibilityRole="button"
          accessibilityHint="Double tap to center the map on your current location"
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    alignItems: 'flex-end',
  },
  zoomControls: {
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  locationButton: {
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
