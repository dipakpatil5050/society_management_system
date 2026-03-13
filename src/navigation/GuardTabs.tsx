// ==========================================
// Navigation — Guard Tabs
// ==========================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { GuardEntryScreen } from '../modules/visitors/GuardEntryScreen';
import { GuardHistoryScreen } from '../modules/visitors/GuardHistoryScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { GuardTabParamList } from '../types';
import { spacing } from '../theme';

const Tab = createBottomTabNavigator<GuardTabParamList>();

export const GuardTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'VisitorEntry': iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline'; break;
            case 'VisitorHistory': iconName = focused ? 'time' : 'time-outline'; break;
            case 'Profile': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: spacing.sm,
          paddingTop: spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="VisitorEntry"
        component={GuardEntryScreen}
        options={{ headerTitle: 'Visitor Entry', tabBarLabel: 'Gate Entry' }}
      />
      <Tab.Screen
        name="VisitorHistory"
        component={GuardHistoryScreen}
        options={{ headerTitle: 'Visitor History', tabBarLabel: 'History' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
