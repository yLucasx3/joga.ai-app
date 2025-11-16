export interface Sport {
  key: string;
  name: string;
  icon: string;
  imageUrl?: string;
}

export const SPORTS: Sport[] = [
  {
    key: 'soccer',
    name: 'Football',
    icon: '⚽',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  },
  {
    key: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  },
  {
    key: 'volleyball',
    name: 'Volleyball',
    icon: '🏐',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
  },
  {
    key: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  },
  {
    key: 'padel',
    name: 'Padel',
    icon: '🎾',
    imageUrl: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80',
  },
  {
    key: 'running',
    name: 'Running',
    icon: '🏃',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
  },
  {
    key: 'yoga',
    name: 'Yoga',
    icon: '🧘',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  },
  {
    key: 'swimming',
    name: 'Swimming',
    icon: '🏊',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
  },
  {
    key: 'futsal',
    name: 'Futsal',
    icon: '⚽',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  },
  {
    key: 'beach-volleyball',
    name: 'Beach Volleyball',
    icon: '🏐',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
  },
  {
    key: 'badminton',
    name: 'Badminton',
    icon: '🏸',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
  },
  {
    key: 'table-tennis',
    name: 'Table Tennis',
    icon: '🏓',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80',
  },
  {
    key: 'handball',
    name: 'Handball',
    icon: '🤾',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  },
  {
    key: 'rugby',
    name: 'Rugby',
    icon: '🏉',
    imageUrl: 'https://images.unsplash.com/photo-1512224805007-3a1b1b1e0f2f?w=800&q=80',
  },
  {
    key: 'baseball',
    name: 'Baseball',
    icon: '⚾',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
  },
  {
    key: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
  },
];

export const getSportByKey = (key: string): Sport | undefined => {
  return SPORTS.find((sport) => sport.key === key);
};

export const getSportsByKeys = (keys: string[]): Sport[] => {
  return SPORTS.filter((sport) => keys.includes(sport.key));
};
