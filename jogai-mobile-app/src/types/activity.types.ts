// Activity Types
export type ActivityType = 'PUBLIC' | 'PRIVATE';
export type ActivityStatus = 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';
export type ParticipantStatus = 'CONFIRMED' | 'CANCELLED';

export interface Activity {
  id: string;
  organizationId: string;
  fieldId: string;
  sportKey: string;
  organizerId: string;
  type: string;
  title: string;
  description?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  maxPlayers: number;
  currentPlayers: number;
  status: ActivityStatus;
  shareToken: string;
  shareExpiresAt: string;
  field: Field;
  sport: Sport;
  organizer: Organizer;
  organization: Organization;
  participants: Participant[]
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  status: ParticipantStatus;
  joinedAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: Address;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// Request Types
export interface CreateActivityRequest {
  title: string;
  description?: string;
  sportKey: string;
  fieldId: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  maxPlayers: number;
  shareExpiresAt?: string;
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxPlayers?: number;
  status?: ActivityStatus;
}

export interface ParticipationRequest {
  name: string;
  phone: string;
}

export interface ActivityFilters {
  sportKeys?: string[];
  type?: ActivityType;
  status?: ActivityStatus;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  search?: string;
}

// Field Types
export type FieldStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

export interface Field {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
  capacity: number;
  photos: string[]
  dimensions?: FieldDimensions;
  amenities: string[]; // Array of amenity keys
  status: FieldStatus;
  pricingRules?: PricingRule[];
  establishment: Establishment;
  createdAt: string;
  updatedAt: string;
}

export interface FieldDimensions {
  length: number;
  width: number;
  unit: 'METERS' | 'FEET';
}

export interface Sport {
  id: string;
  key: string;
  name: string;
  category?: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Amenity {
  key: string;
  name: string;
  icon: string;
}

export interface PricingRule {
  period: 'PEAK' | 'OFF_PEAK' | 'WEEKEND' | 'HOLIDAY';
  pricePerHour: number;
  currency: string;
  minDuration?: number;
  maxDuration?: number;
}

export interface FieldFilters {
  latitude: number;
  longitude: number;
  radiusInKm?: number;
  status?: FieldStatus;
  sportKey?: string;
  establishmentId?: string;
}

export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}
