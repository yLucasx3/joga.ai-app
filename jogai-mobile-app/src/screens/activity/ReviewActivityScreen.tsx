/**
 * Review Activity Screen
 * 
 * Screen for reviewing activity details before creation
 * Allows editing each section before final submission
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { activityService } from '../../services/activity.service';
import { getSportByKey } from '../../constants/sports';
import { CreateStackParamList } from '../../navigation/types';
import { format, differenceInMinutes } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'ReviewActivity'>;
type ScreenRouteProp = RouteProp<CreateStackParamList, 'ReviewActivity'>;

const ReviewActivityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { activityData } = route.params;

  const [creating, setCreating] = useState(false);

  const sport = getSportByKey(activityData.sportKey);

  const calculateDuration = (): string => {
    const minutes = differenceInMinutes(activityData.endDate, activityData.startDate);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const handleEdit = (section: 'sport' | 'details' | 'datetime') => {
    if (section === 'sport') {
      // Navigate back to court selection
      navigation.navigate('SelectCourt');
    } else if (section === 'details' || section === 'datetime') {
      // Navigate back to create activity form
      navigation.navigate('CreateActivity', {
        courtId: activityData.courtId,
        sportKey: activityData.sportKey,
      });
    }
  };

  const handleCreateActivity = async () => {
    try {
      setCreating(true);

      const createRequest = {
        title: activityData.title,
        description: activityData.description,
        sportKey: activityData.sportKey,
        fieldId: activityData.fieldId,
        type: activityData.type,
        startDate: activityData.startDate.toISOString(),
        endDate: activityData.endDate.toISOString(),
        maxPlayers: activityData.maxPlayers,
        shareExpiresAt: activityData.shareExpiresAt?.toISOString(),
      };

      const newActivity = await activityService.createActivity(createRequest);

      Alert.alert(
        'Success!',
        'Your activity has been created successfully.',
        [
          {
            text: 'View Activity',
            onPress: () => {
              // Navigate to activity details
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'SelectCourt' },
                  {
                    name: 'SelectCourt',
                    params: undefined,
                  },
                ],
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating activity:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create activity. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Review Your Activity</Text>
        <Text style={styles.subtitle}>
          Review all details before creating your activity
        </Text>

        {/* Sport and Location Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sport & Location</Text>
            <TouchableOpacity onPress={() => handleEdit('sport')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.sportIcon}>{sport?.icon}</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sport</Text>
              <Text style={styles.infoValue}>{sport?.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🏟️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Court</Text>
              <Text style={styles.infoValue}>{activityData.courtName}</Text>
            </View>
          </View>
        </Card>

        {/* Activity Details Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity Details</Text>
            <TouchableOpacity onPress={() => handleEdit('details')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📝</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Title</Text>
              <Text style={styles.infoValue}>{activityData.title}</Text>
            </View>
          </View>

          {activityData.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.icon}>💬</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{activityData.description}</Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>
              {activityData.type === 'PUBLIC' ? '🌍' : '🔒'}
            </Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {activityData.type === 'PUBLIC' ? 'Public' : 'Private'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Date, Time, and Spots Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Date, Time & Spots</Text>
            <TouchableOpacity onPress={() => handleEdit('datetime')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {format(activityData.startDate, 'EEEE, MMMM d, yyyy')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {format(activityData.startDate, 'h:mm a')} -{' '}
                {format(activityData.endDate, 'h:mm a')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>⏱️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{calculateDuration()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.icon}>👥</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Maximum Players</Text>
              <Text style={styles.infoValue}>{activityData.maxPlayers} players</Text>
            </View>
          </View>

          {activityData.shareExpiresAt && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.icon}>🔗</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Share Link Expires</Text>
                  <Text style={styles.infoValue}>
                    {format(activityData.shareExpiresAt, 'MMM d, yyyy')}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Create Button */}
        <View style={styles.footer}>
          <Button
            title={creating ? 'Creating...' : 'Create Activity'}
            onPress={handleCreateActivity}
            fullWidth
            loading={creating}
            disabled={creating}
          />
        </View>
      </ScrollView>
    </ProtectedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  editButton: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  sportIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  footer: {
    marginTop: spacing.md,
  },
});

export default ReviewActivityScreen;
