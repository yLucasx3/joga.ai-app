/**
 * Create Activity Screen
 * 
 * Form for creating a new activity with all required details
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { DatePicker } from '../../components/forms/DatePicker';
import { TimePicker } from '../../components/forms/TimePicker';
import { Slider } from '../../components/forms/Slider';
import { fieldService } from '../../services/field.service';
import { getSportByKey } from '../../constants/sports';
import { CreateStackParamList, CreateActivityData } from '../../navigation/types';
import { addDays, setHours, setMinutes } from 'date-fns';
import { Field } from '../../types/activity.types';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'CreateActivity'>;
type ScreenRouteProp = RouteProp<CreateStackParamList, 'CreateActivity'>;

const CreateActivityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { fieldId, sportKey } = route.params;

  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(setHours(setMinutes(new Date(), 0), 18)); // Default 6 PM
  const [endTime, setEndTime] = useState(setHours(setMinutes(new Date(), 0), 20)); // Default 8 PM
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [shareExpiresAt, setShareExpiresAt] = useState(addDays(new Date(), 7)); // Default 7 days

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sport = getSportByKey(sportKey);

  useEffect(() => {
    fetchFieldDetails();
  }, [fieldId]);

  const fetchFieldDetails = async () => {
    try {
      setLoading(true);
      const fieldData = await fieldService.getFieldById(fieldId);
      setField(fieldData);
      
      // Set default title
      if (sport) {
        setTitle(`${sport.name} Game`);
      }
    } catch (error) {
      console.error('Error fetching field details:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (maxPlayers < 2) {
      newErrors.maxPlayers = 'Minimum 2 players required';
    }

    if (field?.capacity && maxPlayers > field.capacity) {
      newErrors.maxPlayers = `Maximum ${field.capacity} players allowed`;
    }

    // Validate time range
    const start = new Date(startDate);
    start.setHours(startTime.getHours(), startTime.getMinutes());
    
    const end = new Date(startDate);
    end.setHours(endTime.getHours(), endTime.getMinutes());

    if (end <= start) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    // Combine date and time
    const start = new Date(startDate);
    start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const end = new Date(startDate);
    end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    const activityData: CreateActivityData = {
      title: title.trim(),
      description: description.trim() || undefined,
      sportKey,
      fieldId: field!.id,
      fieldName: field!.name,
      type: activityType,
      startDate: start,
      endDate: end,
      maxPlayers,
      shareExpiresAt: activityType === 'PUBLIC' ? shareExpiresAt : undefined,
    };

    navigation.navigate('ReviewActivity', { activityData });
  };

  if (loading) {
    return (
      <ProtectedScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ProtectedScreen>
    );
  }

  return (
    <ProtectedScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Info */}
        <View style={styles.header}>
          <Text style={styles.sportIcon}>{sport?.icon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.sportName}>{sport?.name}</Text>
            <Text style={styles.fieldName}>{field?.name}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <Input
            label="Activity Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Evening Soccer Game"
            error={errors.title}
          />

          {/* Description */}
          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about your activity..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {/* Activity Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Activity Type *</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  activityType === 'PUBLIC' && styles.typeButtonActive,
                ]}
                onPress={() => setActivityType('PUBLIC')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    activityType === 'PUBLIC' && styles.typeButtonTextActive,
                  ]}
                >
                  🌍 Public
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  activityType === 'PRIVATE' && styles.typeButtonActive,
                ]}
                onPress={() => setActivityType('PRIVATE')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    activityType === 'PRIVATE' && styles.typeButtonTextActive,
                  ]}
                >
                  🔒 Private
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <DatePicker
            label="Date *"
            value={startDate}
            onChange={setStartDate}
            minimumDate={new Date()}
          />

          {/* Time Range */}
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <TimePicker
                label="Start Time *"
                value={startTime}
                onChange={setStartTime}
              />
            </View>
            <View style={styles.timeField}>
              <TimePicker
                label="End Time *"
                value={endTime}
                onChange={setEndTime}
                error={errors.endTime}
              />
            </View>
          </View>

          {/* Max Players */}
          <Slider
            label="Maximum Players *"
            value={maxPlayers}
            onChange={setMaxPlayers}
            min={2}
            max={field?.capacity || 50}
            step={1}
            error={errors.maxPlayers}
            helperText={`Field capacity: ${field?.capacity || 'N/A'} players`}
          />

          {/* Share Link Expiration (Public only) */}
          {activityType === 'PUBLIC' && (
            <DatePicker
              label="Share Link Expires On"
              value={shareExpiresAt}
              onChange={setShareExpiresAt}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title="Review Activity"
            onPress={handleContinue}
            fullWidth
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
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sportIcon: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  sportName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  fieldName: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  form: {
    padding: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeField: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
  },
});

export default CreateActivityScreen;
