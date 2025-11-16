import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { SportImageCard } from '../../components/sport/SportImageCard';
import { SPORTS } from '../../constants/sports';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
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
      // await userApi.updatePreferences({
      //   sports: selectedSports,
      //   notificationsEnabled: true,
      // });

      // Save preferences locally
      await storageService.savePreferences({
        sports: selectedSports,
        notificationsEnabled: true,
      });

      // Mark onboarding as completed
      await authService.completeOnboarding();

      // Navigate to main app
      navigation.replace('Main');
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

      // Navigate to main app
      navigation.replace('Main');
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>What do you play?</Text>
          <TouchableOpacity onPress={handleSkip} disabled={isSubmitting}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Select one or more to personalize your experience.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a sport..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Sports Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredSports.map((sport) => (
            <View key={sport.key} style={styles.cardWrapper}>
              <SportImageCard
                sport={sport}
                isSelected={selectedSports.includes(sport.key)}
                onPress={() => handleSelectSport(sport.key)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer with Continue Button */}
      {selectedSports.length > 0 && (
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          />
        </View>
      )}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  skipButton: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
