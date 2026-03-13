// ==========================================
// Navigation — Auth Stack
// ==========================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../modules/auth/SplashScreen';
import { LoginScreen } from '../modules/auth/LoginScreen';
import { RoleSelectionScreen } from '../modules/auth/RoleSelectionScreen';
import { AuthStackParamList } from '../types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    </Stack.Navigator>
  );
};
