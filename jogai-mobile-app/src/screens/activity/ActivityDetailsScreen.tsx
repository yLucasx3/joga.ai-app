/**
 * Activity Details Screen
 * 
 * Screen for viewing detailed activity information
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { ParticipantList } from '../../components/activity/ParticipantList';
import { HomeStackParamList } from '../../navigation/types';
import { activityApi } from '../../api/activity.api';
import { Activity, ActivityStatus } from '../../types/activity.types';
import { getSportByKey } from '../../constants/sports';
import { formatDateTime, formatDuration, calculateDuration } from '../../utils/date.utils';
import { useAuth } from '../../hooks/useAuth';

type ActivityDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'ActivityDetails'>;
type ActivityDetailsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'ActivityDetails'>;

const ActivityDetailsScreen: React.FC = () => {
  const route = useRoute<ActivityDetailsScreenRouteProp>();
  const navigation = useNavigation<ActivityDetailsScreenNavigationProp>();
  const { activityId } = route.params;
  const { user, isAuthenticated } = useAuth();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingParticipation, setCancellingParticipation] = useState(false);

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  useEffect(() => {
    // Add share button to header
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, activity]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityApi.getActivityById(activityId);
      data.participants = [];
      
      setActivity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load activity');
      Alert.alert('Error', 'Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: ActivityStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'FULL':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ActivityStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Open';
      case 'FULL':
        return 'Full';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const isUserParticipant = () => {
    if (!user || !activity) return false;
    return activity.participants.some(
      (p) => p.id === user.id && p.status === 'CONFIRMED'
    );
  };

  const getUserParticipantId = () => {
    if (!user || !activity) return null;
    const participant = activity.participants.find(
      (p) => p.id === user.id && p.status === 'CONFIRMED'
    );
    return participant?.id || null;
  };

  const handleJoinPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to join activities',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('ConfirmParticipation', { activityId: activity!.id });
  };

  const handleCancelParticipation = async () => {
    if (!activity || !user) return;

    const participantId = getUserParticipantId();
    if (!participantId) return;

    Alert.alert(
      'Cancel Participation',
      'Are you sure you want to cancel your participation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingParticipation(true);
              const updatedActivity = await activityApi.cancelParticipation(
                activity.id,
                participantId
              );
              setActivity(updatedActivity);
              Alert.alert('Success', 'Your participation has been cancelled');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to cancel participation');
            } finally {
              setCancellingParticipation(false);
            }
          },
        },
      ]
    );
  };

  const canJoinActivity = () => {
    if (!activity) return false;
    return (
      activity.status === 'ACTIVE' &&
      activity.currentPlayers < activity.maxPlayers &&
      !isUserParticipant()
    );
  };

  const handleShare = async () => {
    if (!activity) return;

    try {
      const sport = getSportByKey(activity.sportKey);
      const shareUrl = activity.shareToken
        ? `https://jogai.app/activities/${activity.shareToken}`
        : `https://jogai.app/activities/${activity.id}`;

      const message = `Join me for ${sport?.name || activity.sportKey}!\n\n${activity.title}\n${formatDateTime(activity.startDate)}\n${activity.field.establishment.name}\n\n${shareUrl}`;

      const result = await Share.share(
        {
          message,
          url: shareUrl,
          title: activity.title,
        },
        {
          dialogTitle: 'Share Activity',
          subject: `Join me for ${activity.title}`,
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
          console.log('Shared via:', result.activityType);
        } else {
          // Shared
          console.log('Activity shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share activity');
      console.error('Share error:', error);
    }
  };

  const renderActionButton = () => {
    if (!activity) return null;

    if (activity.status === 'CANCELLED' || activity.status === 'COMPLETED') {
      return null;
    }

    if (isUserParticipant()) {
      return (
        <Button
          title="Cancel Participation"
          onPress={handleCancelParticipation}
          variant="outline"
          loading={cancellingParticipation}
          fullWidth
        />
      );
    }

    if (activity.status === 'FULL') {
      return (
        <Button
          title="Activity Full"
          onPress={() => {}}
          variant="secondary"
          disabled
          fullWidth
        />
      );
    }

    if (canJoinActivity()) {
      return (
        <Button
          title="Join Activity"
          onPress={handleJoinPress}
          variant="primary"
          fullWidth
        />
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !activity) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={styles.errorText}>{error || 'Activity not found'}</Text>
        <TouchableOpacity onPress={loadActivity} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sport = getSportByKey(activity.sportKey);
  const duration = calculateDuration(activity.startDate, activity.endDate);
  const address = `${activity.field.establishment.address.street}, ${activity.field.establishment.address.number} - ${activity.field.establishment.address.neighborhood}, ${activity.field.establishment.address.city}`;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        {activity.field.photos.length ? (
          <Image source={{ uri: activity.field.photos[0] }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImage, styles.placeholderImage]}>
            <MaterialCommunityIcons name="soccer-field" size={64} color={colors.gray400} />
          </View>
        )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Status */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{activity.title}</Text>
            <Badge
              label={getStatusLabel(activity.status)}
              variant={getStatusBadgeVariant(activity.status)}
            />
          </View>
          {activity.description && (
            <Text style={styles.description}>{activity.description}</Text>
          )}
        </View>

        {/* Sport */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.sportIcon}>{sport?.icon || '⚽'}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sport</Text>
              <Text style={styles.infoValue}>{sport?.name || activity.sportKey}</Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{formatDateTime(activity.startDate)}</Text>
              <Text style={styles.infoSubvalue}>
                Duration: {formatDuration(duration)}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{activity.field.establishment.name}</Text>
              <Text style={styles.infoSubvalue}>{address}</Text>
            </View>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: activity.field.establishment.latitude,
                longitude: activity.field.establishment.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: activity.field.establishment.latitude,
                  longitude: activity.field.establishment.longitude,
                }}
                title={activity.field.establishment.name}
              />
            </MapView>
          </View>
        </View>

        {/* Organizer */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Avatar
              imageUri={activity.organizer.avatarUrl}
              name={activity.organizer.name}
              size="medium"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Organized by</Text>
              <Text style={styles.infoValue}>{activity.organizer.name}</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.section}>
          <ParticipantList
            participants={activity.participants}
            maxPlayers={activity.maxPlayers}
            currentPlayers={activity.currentPlayers}
          />
        </View>

        {/* Bottom spacing for action button */}
        <View style={{ height: 80 }} />
      </View>
      </ScrollView>

      {/* Action Button */}
      {renderActionButton() && (
        <View style={styles.actionBar}>
          {renderActionButton()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.gray200,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sportIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoSubvalue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  mapContainer: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  map: {
    width: '100%',
    height: 200,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  headerButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
});

export default ActivityDetailsScreen;
