import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { SportGrid } from '../../components/sport/SportGrid';
import { SPORTS } from '../../constants/sports';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { storageService } from '../../services/storage.service';
import { authService } from '../../services/auth.service';
import { userApi } from '../../api/user.api';

interface SportSelectionScreenProps {
  navigation: any;
}

export const SportSelectionScreen: React.FC<SportSelectionScreenProps> = ({
  navigation,
}) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectSport = (sportKey: string) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportKey)) {
        // Remove sport if already selected
        return prev.filter((key) => key !== sportKey);
      } else {
        // Add sport to selection
        return [...prev, sportKey];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedSports.length === 0) {
      Alert.alert(
        'No Sports Selected',
        'Please select at least one sport to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Save preferences to backend
      await userApi.updatePreferences({
        sports: selectedSports,
        notificationsEnabled: true,
      });

      // Save preferences locally
      await storageService.savePreferences({
        sports: selectedSports,
        notificationsEnabled: true,
      });

      // Mark onboarding as completed
      await authService.completeOnboarding();

      // Navigation will be handled by root navigator
    } catch (error) {
      console.error('Error saving sport preferences:', error);
      Alert.alert(
        'Error',
        'Unable to save your preferences. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsSubmitting(true);

      // Mark onboarding as completed without saving preferences
      await authService.completeOnboarding();

      // Navigation will be handled by root navigator
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter sports based on search query
  const filteredSports = SPORTS.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Sports</Text>
        <Text style={styles.subtitle}>
          Select the sports you're interested in to personalize your experience
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sports..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {selectedSports.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      <View style={styles.gridContainer}>
        <SportGrid
          sports={filteredSports}
          selectedSports={selectedSports}
          onSelectSport={handleSelectSport}
          multiSelect={true}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={isSubmitting}
          disabled={isSubmitting || selectedSports.length === 0}
          fullWidth
          style={styles.continueButton}
        />

        <Button
          title="Skip for Now"
          onPress={handleSkip}
          variant="outline"
          disabled={isSubmitting}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
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
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  selectionInfo: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  selectionText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  continueButton: {
    marginBottom: spacing.md,
  },
});
