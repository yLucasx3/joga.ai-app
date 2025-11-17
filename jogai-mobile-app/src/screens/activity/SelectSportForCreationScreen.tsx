/**
 * Select Sport For Creation Screen
 * 
 * Initial screen for activity creation flow
 * User selects sport first, then proceeds to field selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Input } from '../../components/common/Input';
import { SportGrid } from '../../components/sport/SportGrid';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { SPORTS, Sport as SportConstant } from '../../constants/sports';
import { CreateStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'SelectSport'>;

const SelectSportForCreationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [availableSports, setAvailableSports] = useState<SportConstant[]>(SPORTS);
  const [filteredSports, setFilteredSports] = useState<SportConstant[]>(SPORTS);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSportSelect = (sportKey: string) => {
    setSelectedSport(sportKey);
  };

  const handleContinue = () => {
    if (selectedSport) {
      navigation.navigate('SelectField', {
        sportKey: selectedSport,
      });
    }
  };

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>What sport do you want to play?</Text>
            <Text style={styles.subtitle}>
              Select a sport to find available fields
            </Text>
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

          {/* Sports Grid */}
          {filteredSports.length > 0 ? (
            <View style={styles.sportsContainer}>
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
              title="Find Fields"
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
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchIcon: {
    fontSize: 18,
  },
  sportsContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default SelectSportForCreationScreen;
