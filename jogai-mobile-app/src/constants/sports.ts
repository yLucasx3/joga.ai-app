export interface Sport {
  key: string;
  name: string;
  icon: string;
  imageUrl?: string;
}

export const SPORTS: Sport[] = [
  {
    key: 'soccer',
    name: 'Soccer',
    icon: '⚽',
  },
  {
    key: 'basketball',
    name: 'Basketball',
    icon: '🏀',
  },
  {
    key: 'volleyball',
    name: 'Volleyball',
    icon: '🏐',
  },
  {
    key: 'tennis',
    name: 'Tennis',
    icon: '🎾',
  },
  {
    key: 'futsal',
    name: 'Futsal',
    icon: '⚽',
  },
  {
    key: 'beach-volleyball',
    name: 'Beach Volleyball',
    icon: '🏐',
  },
  {
    key: 'badminton',
    name: 'Badminton',
    icon: '🏸',
  },
  {
    key: 'table-tennis',
    name: 'Table Tennis',
    icon: '🏓',
  },
  {
    key: 'handball',
    name: 'Handball',
    icon: '🤾',
  },
  {
    key: 'rugby',
    name: 'Rugby',
    icon: '🏉',
  },
  {
    key: 'baseball',
    name: 'Baseball',
    icon: '⚾',
  },
  {
    key: 'cricket',
    name: 'Cricket',
    icon: '🏏',
  },
  {
    key: 'hockey',
    name: 'Hockey',
    icon: '🏒',
  },
  {
    key: 'golf',
    name: 'Golf',
    icon: '⛳',
  },
  {
    key: 'swimming',
    name: 'Swimming',
    icon: '🏊',
  },
  {
    key: 'running',
    name: 'Running',
    icon: '🏃',
  },
];

export const getSportByKey = (key: string): Sport | undefined => {
  return SPORTS.find((sport) => sport.key === key);
};

export const getSportsByKeys = (keys: string[]): Sport[] => {
  return SPORTS.filter((sport) => keys.includes(sport.key));
};
