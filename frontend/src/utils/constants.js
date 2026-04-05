import {
  IoWalk, IoBicycle, IoCarSport, IoCar, IoBus, IoTrain, IoSwapHorizontal,
  IoBriefcase, IoSchool, IoCart, IoGameController, IoMedkit, IoPeople,
  IoHome, IoClipboard,
} from 'react-icons/io5';

// Ionicon name strings — used to render <Icon /> in components that support it
export const TRAVEL_MODES = [
  { value: 'walk', label: 'Walk', icon: 'walk-outline' },
  { value: 'bicycle', label: 'Bicycle', icon: 'bicycle-outline' },
  { value: 'two_wheeler', label: 'Two Wheeler', icon: 'bicycle-outline' },
  { value: 'auto_rickshaw', label: 'Auto Rickshaw', icon: 'car-outline' },
  { value: 'car', label: 'Car', icon: 'car-sport-outline' },
  { value: 'taxi', label: 'Taxi', icon: 'car-outline' },
  { value: 'bus', label: 'Bus', icon: 'bus-outline' },
  { value: 'metro', label: 'Metro', icon: 'subway-outline' },
  { value: 'train', label: 'Train', icon: 'train-outline' },
  { value: 'other', label: 'Other', icon: 'swap-horizontal-outline' },
];

export const TRIP_PURPOSES = [
  { value: 'work', label: 'Work', icon: 'briefcase-outline' },
  { value: 'education', label: 'Education', icon: 'school-outline' },
  { value: 'shopping', label: 'Shopping', icon: 'cart-outline' },
  { value: 'recreation', label: 'Recreation', icon: 'game-controller-outline' },
  { value: 'medical', label: 'Medical', icon: 'medkit-outline' },
  { value: 'social', label: 'Social', icon: 'people-outline' },
  { value: 'religious', label: 'Religious', icon: 'home-outline' },
  { value: 'personal_business', label: 'Personal Business', icon: 'clipboard-outline' },
  { value: 'other', label: 'Other', icon: 'swap-horizontal-outline' },
];

export const CHART_COLORS = [
  '#3E92CC', '#0A2463', '#059669', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

// React-icon component map for inline rendering
export const IONICON_COMPONENTS = {
  'walk-outline': IoWalk,
  'bicycle-outline': IoBicycle,
  'car-sport-outline': IoCarSport,
  'car-outline': IoCar,
  'bus-outline': IoBus,
  'subway-outline': IoTrain,
  'train-outline': IoTrain,
  'swap-horizontal-outline': IoSwapHorizontal,
  'briefcase-outline': IoBriefcase,
  'school-outline': IoSchool,
  'cart-outline': IoCart,
  'game-controller-outline': IoGameController,
  'medkit-outline': IoMedkit,
  'people-outline': IoPeople,
  'home-outline': IoHome,
  'clipboard-outline': IoClipboard,
};
