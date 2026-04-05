// Travel modes available in the app
export const TRAVEL_MODES = [
  { value: 'walk', label: '🚶 Walk', icon: 'walk' },
  { value: 'bicycle', label: '🚲 Bicycle', icon: 'bicycle' },
  { value: 'two_wheeler', label: '🛵 Two Wheeler', icon: 'motorbike' },
  { value: 'auto_rickshaw', label: '🛺 Auto Rickshaw', icon: 'car-alt' },
  { value: 'car', label: '🚗 Car', icon: 'car' },
  { value: 'taxi', label: '🚕 Taxi', icon: 'taxi' },
  { value: 'bus', label: '🚌 Bus', icon: 'bus-alt' },
  { value: 'metro', label: '🚇 Metro', icon: 'subway' },
  { value: 'train', label: '🚆 Train', icon: 'train' },
  { value: 'other', label: '🔄 Other', icon: 'ellipsis-h' },
];

// Trip purposes
export const TRIP_PURPOSES = [
  { value: 'work', label: '💼 Work' },
  { value: 'education', label: '🎓 Education' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'recreation', label: '🎭 Recreation' },
  { value: 'medical', label: '🏥 Medical' },
  { value: 'social', label: '👥 Social' },
  { value: 'religious', label: '🛕 Religious' },
  { value: 'personal_business', label: '📋 Personal Business' },
  { value: 'other', label: '🔄 Other' },
];

// Trip frequencies
export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'one_time', label: 'One Time' },
];

// App colors (consistent theme)
export const COLORS = {
  primary: '#0A2463',
  primaryLight: '#1E3A8A',
  accent: '#3E92CC',
  accentLight: '#7EC8E3',
  success: '#059669',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
  background: '#F0F4F8',
  card: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.08)',
  gradient1: '#0A2463',
  gradient2: '#3E92CC',
  mapOverlay: 'rgba(10, 36, 99, 0.85)',
};
