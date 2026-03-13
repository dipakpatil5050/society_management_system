// ==========================================
// Navigation — App Stack (Post-Auth)
// ==========================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store';
import { AdminTabs } from './AdminTabs';
import { ResidentTabs } from './ResidentTabs';
import { GuardTabs } from './GuardTabs';
import { AddEditMemberScreen } from '../modules/members/AddEditMemberScreen';
import { AddMaintenanceScreen } from '../modules/maintenance/AddMaintenanceScreen';
import { AddComplaintScreen } from '../modules/complaints/AddComplaintScreen';
import { AddVisitorScreen } from '../modules/visitors/AddVisitorScreen';
import { AppStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

const Stack = createStackNavigator<AppStackParamList>();

const RoleBasedTabs: React.FC = () => {
  const role = useAppSelector((state) => state.auth.user?.role);

  switch (role) {
    case 'admin':
      return <AdminTabs />;
    case 'resident':
      return <ResidentTabs />;
    case 'guard':
      return <GuardTabs />;
    default:
      return <AdminTabs />;
  }
};

export const AppStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={RoleBasedTabs} />
      <Stack.Screen
        name="AddMember"
        component={AddEditMemberScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditMember"
        component={AddEditMemberScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMaintenance"
        component={AddMaintenanceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddComplaint"
        component={AddComplaintScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddVisitor"
        component={AddVisitorScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
