/**
 * Select Sport Screen
 * 
 * Screen for selecting sport for activity creation
 * Displays only sports available for the selected court
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Input } from '../../components/common/Input';
import { SportGrid } from '../../components/sport/SportGrid';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { courtService } from '../../services/court.service';
import { Sport } from '../../types/activity.types';
import { CreateStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'SelectSport'>;
type ScreenRouteProp = RouteProp<CreateStackParamList, 'SelectSport'>;

const SelectSportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { courtId } = route.params;

  const [court, setCourt] = useState<any>(null);
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [filteredSports, setFilteredSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  useEffect(() => {
    fetchCourtDetails();
  }, [courtId]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = availableSports.filter((sport) =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSports(filtered);
    } else {
      setFilteredSports(availableSports);
    }
  }, [searchQuery, availableSports]);

  const fetchCourtDetails = async () => {
    try {
      setLoading(true);
      const courtData = await courtService.getCourtById(courtId);
      setCourt(courtData);
      setAvailableSports(courtData.sports);
      setFilteredSports(courtData.sports);
    } catch (error) {
      console.error('Error fetching court details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSportSelect = (sportKey: string) => {
    setSelectedSport(sportKey);
  };

  const handleContinue = () => {
    if (selectedSport && court) {
      navigation.navigate('CreateActivity', {
        courtId: court.id,
        sportKey: selectedSport,
      });
    }
  };

  if (loading) {
    return (
      <ProtectedScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading sports...</Text>
        </View>
      </ProtectedScreen>
    );
  }

  if (!court) {
    return (
      <ProtectedScreen>
        <EmptyState
          icon="❌"
          title="Court not found"
          description="Unable to load court details"
        />
      </ProtectedScreen>
    );
  }

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Court Info */}
          <View style={styles.courtInfo}>
            <Text style={styles.courtName}>{court.name}</Text>
            <Text style={styles.establishmentName}>{court.establishment.name}</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search sports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            />
          </View>

          {/* Activity Type Toggle */}
          <View style={styles.typeToggleContainer}>
            <Text style={styles.typeLabel}>Activity Type:</Text>
            <View style={styles.typeButtons}>
              <Button
                title="Public"
                onPress={() => setActivityType('PUBLIC')}
                variant={activityType === 'PUBLIC' ? 'primary' : 'outline'}
                size="small"
                style={styles.typeButton}
              />
              <Button
                title="Private"
                onPress={() => setActivityType('PRIVATE')}
                variant={activityType === 'PRIVATE' ? 'primary' : 'outline'}
                size="small"
                style={styles.typeButton}
              />
            </View>
          </View>

          {/* Sports Grid */}
          {filteredSports.length > 0 ? (
            <View style={styles.sportsContainer}>
              <Text style={styles.sectionTitle}>Select a Sport</Text>
              <SportGrid
                sports={filteredSports}
                selectedSports={selectedSport ? [selectedSport] : []}
                onSelectSport={handleSportSelect}
                multiSelect={false}
              />
            </View>
          ) : (
            <EmptyState
              icon="🔍"
              title="No sports found"
              description="Try adjusting your search"
            />
          )}
        </ScrollView>

        {/* Continue Button */}
        {selectedSport && (
          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              fullWidth
            />
          </View>
        )}
      </View>
    </ProtectedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
  courtInfo: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  courtName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  establishmentName: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchIcon: {
    fontSize: 18,
  },
  typeToggleContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  typeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
  },
  sportsContainer: {
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default SelectSportScreen;
