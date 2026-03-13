// ==========================================
// Root Navigator — Flat structure
// ==========================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../modules/auth/SplashScreen';
import { LoginScreen } from '../modules/auth/LoginScreen';
import { RoleSelectionScreen } from '../modules/auth/RoleSelectionScreen';
import { AppStack } from './AppStack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  RoleSelection: { email: string; password: string };
  AppStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>
  );
};
