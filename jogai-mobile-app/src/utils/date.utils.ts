import { format, formatDistance, formatRelative, parseISO, isToday, isTomorrow, differenceInMinutes } from 'date-fns';

/**
 * Format date for display
 * @param date Date string or Date object
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format time for display
 * @param date Date string or Date object
 * @param formatStr Format string (default: 'HH:mm')
 */
export const formatTime = (date: string | Date, formatStr: string = 'HH:mm'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date and time for display
 * @param date Date string or Date object
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'HH:mm')}`;
  }
  
  return format(dateObj, 'MMM dd at HH:mm');
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date Date string or Date object
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format date range
 * @param startDate Start date
 * @param endDate End date
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  const startFormatted = formatDateTime(start);
  const endTime = format(end, 'HH:mm');
  
  return `${startFormatted} - ${endTime}`;
};

/**
 * Calculate duration between two dates in minutes
 * @param startDate Start date
 * @param endDate End date
 */
export const calculateDuration = (startDate: string | Date, endDate: string | Date): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return differenceInMinutes(end, start);
};

/**
 * Format duration in minutes to human-readable string
 * @param minutes Duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Check if date is in the past
 * @param date Date string or Date object
 */
export const isPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

/**
 * Check if date is today
 * @param date Date string or Date object
 */
export const isDateToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

/**
 * Check if date is tomorrow
 * @param date Date string or Date object
 */
export const isDateTomorrow = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isTomorrow(dateObj);
};
