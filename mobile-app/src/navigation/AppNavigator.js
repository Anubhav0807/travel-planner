import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TripsScreen from '../screens/TripsScreen';
import NewTripScreen from '../screens/NewTripScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Trips') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="NewTrip"
            component={NewTripScreen}
            options={{
              headerShown: true,
              title: 'Record Trip',
              headerStyle: { backgroundColor: COLORS.white },
              headerTintColor: COLORS.text,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="TripDetail"
            component={TripDetailScreen}
            options={{
              headerShown: true,
              title: 'Trip Details',
              headerStyle: { backgroundColor: COLORS.white },
              headerTintColor: COLORS.text,
              headerTitleStyle: { fontWeight: '700' },
              headerTransparent: true,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
