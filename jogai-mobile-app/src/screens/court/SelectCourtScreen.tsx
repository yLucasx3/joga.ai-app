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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';
import { Input } from '../../components/common/Input';
import { CourtCard } from '../../components/court/CourtCard';
import { EmptyState } from '../../components/common/EmptyState';
import { courtService } from '../../services/court.service';
import { locationService } from '../../services/location.service';
import { useLocation } from '../../hooks/useLocation';
import { Court } from '../../types/activity.types';
import { CreateStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<CreateStackParamList, 'SelectCourt'>;

type ViewMode = 'map' | 'list';

const SelectCourtScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { location, loading: locationLoading } = useLocation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [courts, setCourts] = useState<Court[]>([]);
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

  // Fetch courts
  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true);
      
      if (location) {
        // Fetch nearby courts
        const response = await courtService.getNearbyCourts(
          location.latitude,
          location.longitude,
          10, // 10km radius
          undefined,
          { page: 1, limit: 50 }
        );

        // Calculate distances
        const courtsWithDistance = response.data.map((court) => {
          const courtLocation = {
            latitude: court.establishment.address.latitude || location.latitude,
            longitude: court.establishment.address.longitude || location.longitude,
          };
          const distance = locationService.calculateDistance(location, courtLocation);
          return { ...court, distance };
        });

        setCourts(courtsWithDistance);
      } else {
        // Fetch all courts if location not available
        const response = await courtService.getCourts(undefined, { page: 1, limit: 50 });
        setCourts(response.data);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  // Search courts
  const searchCourts = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchCourts();
      return;
    }

    try {
      setLoading(true);
      const response = await courtService.searchCourts(
        query,
        undefined,
        { page: 1, limit: 50 }
      );

      // Calculate distances if location available
      if (location) {
        const courtsWithDistance = response.data.map((court) => {
          const courtLocation = {
            latitude: court.establishment.address.latitude || location.latitude,
            longitude: court.establishment.address.longitude || location.longitude,
          };
          const distance = locationService.calculateDistance(location, courtLocation);
          return { ...court, distance };
        });
        setCourts(courtsWithDistance);
      } else {
        setCourts(response.data);
      }
    } catch (error) {
      console.error('Error searching courts:', error);
    } finally {
      setLoading(false);
    }
  }, [location, fetchCourts]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCourts(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchCourts]);

  const handleCourtSelect = (court: Court) => {
    navigation.navigate('SelectSport', { courtId: court.id });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCourts();
  };

  const renderCourtCard = ({ item }: { item: Court }) => (
    <CourtCard
      court={item}
      onPress={() => handleCourtSelect(item)}
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
        {courts.map((court) => {
          const courtLocation = {
            latitude: court.establishment.address.latitude || mapRegion.latitude,
            longitude: court.establishment.address.longitude || mapRegion.longitude,
          };

          return (
            <Marker
              key={court.id}
              coordinate={courtLocation}
              title={court.name}
              description={court.establishment.name}
              onCalloutPress={() => handleCourtSelect(court)}
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
          <Text style={styles.loadingText}>Loading courts...</Text>
        </View>
      );
    }

    if (courts.length === 0) {
      return (
        <EmptyState
          icon="🏟️"
          title="No courts found"
          description={
            searchQuery
              ? 'Try adjusting your search'
              : 'No courts available in your area'
          }
        />
      );
    }

    return (
      <FlatList
        data={courts}
        renderItem={renderCourtCard}
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

export default SelectCourtScreen;
