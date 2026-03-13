// ==========================================
// Role Selection Screen
// ==========================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth, useTheme } from '../../hooks';
import { ROLES } from '../../constants';
import { UserRole } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

export const RoleSelectionScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const { email, password } = route.params || {
    email: 'admin@societyms.com',
    password: 'password123',
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      await login(email, password, role);
      navigation.reset({ index: 0, routes: [{ name: 'AppStack' }] });
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Select Your Role
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose how you want to access the app
        </Text>
      </View>

      <View style={styles.roles}>
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.key;
          const isLoading = isSelected && loading;

          return (
            <TouchableOpacity
              key={role.key}
              activeOpacity={0.8}
              onPress={() => handleRoleSelect(role.key)}
              disabled={loading}
              style={styles.roleCard}
            >
              <LinearGradient
                colors={role.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.roleGradient,
                  isSelected && styles.roleSelected,
                  loading && !isSelected && styles.roleDisabled,
                ]}
              >
                <View style={styles.roleIcon}>
                  <Ionicons
                    name={role.icon as any}
                    size={32}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.roleContent}>
                  <Text style={styles.roleLabel}>{role.label}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>
                <Ionicons
                  name={
                    isLoading
                      ? 'hourglass-outline'
                      : 'chevron-forward'
                  }
                  size={24}
                  color="rgba(255,255,255,0.8)"
                />
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        Each role shows different features & navigation
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    marginTop: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
  },
  roles: {
    gap: spacing.base,
  },
  roleCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  roleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  roleSelected: {
    opacity: 0.8,
  },
  roleDisabled: {
    opacity: 0.4,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  roleContent: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  hint: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing['3xl'],
  },
});
