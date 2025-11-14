import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Sport } from '../../constants/sports';
import { SportCard } from './SportCard';
import { spacing } from '../../theme/spacing';

interface SportGridProps {
  sports: Sport[];
  selectedSports: string[];
  onSelectSport: (sportKey: string) => void;
  multiSelect?: boolean;
}

export const SportGrid: React.FC<SportGridProps> = ({
  sports,
  selectedSports,
  onSelectSport,
  multiSelect = true,
}) => {
  const handleSportPress = (sportKey: string) => {
    onSelectSport(sportKey);
  };

  const renderSportCard = ({ item }: { item: Sport }) => {
    const isSelected = selectedSports.includes(item.key);

    return (
      <View style={styles.cardWrapper}>
        <SportCard
          sport={item}
          isSelected={isSelected}
          onPress={() => handleSportPress(item.key)}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={sports}
      renderItem={renderSportCard}
      keyExtractor={(item) => item.key}
      numColumns={3}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
