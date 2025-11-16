// Activity Types
export type ActivityType = 'PUBLIC' | 'PRIVATE';
export type ActivityStatus = 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';
export type ParticipantStatus = 'CONFIRMED' | 'CANCELLED';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  sportKey: string;
  type: ActivityType;
  status: ActivityStatus;
  startDate: string;
  endDate: string;
  maxPlayers: number;
  currentPlayers: number;
  shareToken?: string;
  shareExpiresAt?: string;
  organizer: Organizer;
  field: Field;
  participants: Participant[];
  location: Location;
  createdAt: string;
  updatedAt: string;
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

export interface Field {
  id: string;
  name: string;
  capacity: number;
  imageUrl?: string;
  establishment: Establishment;
  amenities: string[];
}

export interface Establishment {
  id: string;
  name: string;
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

// Court Types
export interface Court {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  dimensions?: FieldDimensions;
  imageUrl?: string;
  establishment: Establishment;
  sports: Sport[];
  amenities: Amenity[];
  pricingRules: PricingRule[];
}

export interface FieldDimensions {
  length: number;
  width: number;
  unit: 'METERS' | 'FEET';
}

export interface Sport {
  key: string;
  name: string;
  icon: string;
  imageUrl?: string;
}

export interface Amenity {
  key: string;
  name: string;
  icon: string;
}

export interface PricingRule {
  period: 'PEAK' | 'OFF_PEAK' | 'WEEKEND' | 'HOLIDAY';
  pricePerHour: number;
  minDuration: number;
  maxDuration: number;
}

export interface CourtFilters {
  sportKeys?: string[];
  latitude?: number;
  longitude?: number;
  radius?: number;
  search?: string;
  amenities?: string[];
}
