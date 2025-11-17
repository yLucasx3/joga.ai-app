/**
 * Select Court Screen
 * 
 * Screen for browsing and selecting courts
 * Allows users to search and filter courts by location
 * Supports both map and list views
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Input } from '../../components/common/Input';
import { FieldCard } from '../../components/field/FieldCard';
import { EmptyState } from '../../components/common/EmptyState';
import { fieldService } from '../../services/field.service';
import { locationService } from '../../services/location.service';
import { useLocation } from '../../hooks/useLocation';
import { Field } from '../../types/activity.types';
import { CreateStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'SelectField'>;
type ScreenRouteProp = RouteProp<CreateStackParamList, 'SelectField'>;

type ViewMode = 'map' | 'list';

const SelectFieldScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { sportKey } = route.params;
  const { location, loading: locationLoading } = useLocation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  // Initialize map region based on user location
  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [location]);

  // Fetch fields
  const fetchFields = useCallback(async () => {
    try {
      setLoading(true);
      
      if (location) {
        // Fetch nearby fields filtered by sport
        const response = await fieldService.getNearbyFields(
          location.latitude,
          location.longitude,
          { 
            radiusInKm: 10, // 10km radius
            sportKey: sportKey // Filter by selected sport
          }
        );

        // Calculate distances
        const fieldsWithDistance = response.data.map((field) => {
          const fieldLocation = {
            latitude: field.establishment.address.latitude || location.latitude,
            longitude: field.establishment.address.longitude || location.longitude,
          };
          const distance = locationService.calculateDistance(location, fieldLocation);
          return { ...field, distance };
        });

        setFields(fieldsWithDistance);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location, sportKey]);

  // Search fields by address
  const searchFields = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchFields();
      return;
    }

    // For now, filter locally - API search can be added later
    if (location) {
      fetchFields();
    }
  }, [location, fetchFields]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchFields(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchFields]);

  const handleFieldSelect = (field: Field) => {
    navigation.navigate('CreateActivity', { 
      fieldId: field.id,
      sportKey: sportKey
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFields();
  };

  const renderFieldCard = ({ item }: { item: Field }) => (
    <FieldCard
      field={item}
      onPress={() => handleFieldSelect(item)}
      distance={(item as any).distance}
    />
  );

  const renderMapView = () => {
    if (!mapRegion) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {fields.map((field) => {
          const fieldLocation = {
            latitude: field.establishment.address.latitude || mapRegion.latitude,
            longitude: field.establishment.address.longitude || mapRegion.longitude,
          };

          return (
            <Marker
              key={field.id}
              coordinate={fieldLocation}
              title={field.name}
              description={field.establishment.name}
              onCalloutPress={() => handleFieldSelect(field)}
            />
          );
        })}
      </MapView>
    );
  };

  const renderListView = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading fields...</Text>
        </View>
      );
    }

    if (fields.length === 0) {
      return (
        <EmptyState
          icon="🏟️"
          title="No fields found"
          description={
            searchQuery
              ? 'Try adjusting your search'
              : 'No fields available in your area'
          }
        />
      );
    }

    return (
      <FlatList
        data={fields}
        renderItem={renderFieldCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search by address or area..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
            style={styles.searchInput}
          />
        </View>

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'list' && styles.toggleTextActive,
              ]}
            >
              📋 List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'map' && styles.toggleTextActive,
              ]}
            >
              🗺️ Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {viewMode === 'map' ? renderMapView() : renderListView()}
      </View>
    </ProtectedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchIcon: {
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    backgroundColor: colors.gray100,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.white,
  },
  map: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
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
});

export default SelectFieldScreen;
