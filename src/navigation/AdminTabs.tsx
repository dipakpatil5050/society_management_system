// ==========================================
// Navigation — Admin Tabs
// ==========================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { DashboardScreen } from '../modules/dashboard/DashboardScreen';
import { MembersScreen } from '../modules/members/MembersScreen';
import { MaintenanceScreen } from '../modules/maintenance/MaintenanceScreen';
import { ComplaintsScreen } from '../modules/complaints/ComplaintsScreen';
import { VisitorsScreen } from '../modules/visitors/VisitorsScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { AdminTabParamList } from '../types';
import { spacing } from '../theme';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Dashboard': iconName = focused ? 'grid' : 'grid-outline'; break;
            case 'Members': iconName = focused ? 'people' : 'people-outline'; break;
            case 'Maintenance': iconName = focused ? 'receipt' : 'receipt-outline'; break;
            case 'Complaints': iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'; break;
            case 'Visitors': iconName = focused ? 'walk' : 'walk-outline'; break;
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerTitle: 'Dashboard' }} />
      <Tab.Screen name="Members" component={MembersScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsScreen} />
      <Tab.Screen name="Visitors" component={VisitorsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
