import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Activity } from '../../types/activity.types';
import { colors } from '../../theme/colors';
import { getSportByKey } from '../../constants/sports';

interface ActivityMarkerProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

/**
 * Custom marker for activities on the map
 */
export const ActivityMarker: React.FC<ActivityMarkerProps> = ({ activity, onPress }) => {
  const sport = getSportByKey(activity.sportKey);
  const isFull = activity.currentPlayers >= activity.maxPlayers;
  const isCancelled = activity.status === 'CANCELLED';

  const getMarkerColor = () => {
    if (isCancelled) return colors.statusCancelled;
    if (isFull) return colors.statusFull;
    return colors.statusOpen;
  };

  console.log('[ActivityMarker] activity: ', activity)
  return (
    <Marker
      coordinate={{
        latitude: activity.field.establishment.latitude,
        longitude: activity.field.establishment.longitude,
      }}
      onPress={() => onPress(activity)}
      tracksViewChanges={false}
    >
      <View style={[styles.markerContainer, { backgroundColor: getMarkerColor() }]}>
        <Text style={styles.markerIcon}>{sport?.icon || '⚽'}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
});
