/**
 * Confirm Participation Screen
 * 
 * Screen for confirming participation in an activity
 * Requires authentication to access
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { HomeStackParamList } from '../../navigation/types';
import { activityApi } from '../../api/activity.api';
import { Activity } from '../../types/activity.types';
import { getSportByKey } from '../../constants/sports';
import { formatDateTime } from '../../utils/date.utils';
import { useAuth } from '../../hooks/useAuth';

type ConfirmParticipationScreenRouteProp = RouteProp<HomeStackParamList, 'ConfirmParticipation'>;
type ConfirmParticipationScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ConfirmParticipation'
>;

const ConfirmParticipationScreen: React.FC = () => {
  const route = useRoute<ConfirmParticipationScreenRouteProp>();
  const navigation = useNavigation<ConfirmParticipationScreenNavigationProp>();
  const { activityId } = route.params;
  const { user } = useAuth();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const data = await activityApi.getActivityById(activityId);
      setActivity(data);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to load activity details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phone.trim().length < 10) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !activity) return;

    try {
      setSubmitting(true);

      await activityApi.joinActivity(activity.id, {
        name: name.trim(),
        phone: phone.trim(),
      });

      Alert.alert(
        'Success!',
        'You have successfully joined the activity',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ProtectedScreen>
    );
  }

  if (!activity) {
    return (
      <ProtectedScreen>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Activity not found</Text>
        </View>
      </ProtectedScreen>
    );
  }

  const sport = getSportByKey(activity.sportKey);
  const availableSpots = activity.maxPlayers - activity.currentPlayers;

  return (
    <ProtectedScreen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Confirm Participation</Text>
            <Text style={styles.headerSubtitle}>
              Please confirm your details to join this activity
            </Text>
          </View>

          {/* Activity Summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.sportIconContainer}>
                <Text style={styles.sportIcon}>{sport?.icon || '⚽'}</Text>
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>
                  {formatDateTime(activity.startDate)}
                </Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryInfo}>
              <View style={styles.summaryRow}>
                <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.summaryText}>
                  {activity.field.establishment.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.summaryText}>
                  {activity.currentPlayers}/{activity.maxPlayers} players
                </Text>
              </View>
            </View>

            {/* Spots Available */}
            {availableSpots > 0 && (
              <View style={styles.spotsContainer}>
                <Badge
                  label={`${availableSpots} spot${availableSpots !== 1 ? 's' : ''} left`}
                  variant={availableSpots <= 2 ? 'warning' : 'success'}
                />
              </View>
            )}
          </Card>

          {/* Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Your Information</Text>

            <Input
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              placeholder="Enter your full name"
              error={nameError}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError('');
              }}
              placeholder="Enter your phone number"
              error={phoneError}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={colors.info} />
              <Text style={styles.infoText}>
                Your contact information will be shared with the organizer
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Confirm & Join"
            onPress={handleSubmit}
            variant="primary"
            loading={submitting}
            style={styles.confirmButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ProtectedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sportIcon: {
    fontSize: 28,
  },
  summaryContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activitySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  summaryInfo: {
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  spotsContainer: {
    marginTop: spacing.md,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.badgeInfo,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.badgeInfoText,
    lineHeight: 20,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
    ...shadows.lg,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
});

export default ConfirmParticipationScreen;
