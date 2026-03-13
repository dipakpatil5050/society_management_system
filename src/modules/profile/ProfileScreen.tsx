// ==========================================
// Profile Screen
// ==========================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useTheme } from '../../hooks';
import { useAppDispatch } from '../../store';
import { toggleTheme } from '../../store/uiSlice';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { spacing, typography, borderRadius } from '../../theme';
import { formatFlat } from '../../utils/helpers';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        },
      },
    ]);
  };

  const profileItems = [
    { icon: 'person-outline', label: 'Name', value: user?.name || 'N/A' },
    { icon: 'call-outline', label: 'Phone', value: user?.phone || 'N/A' },
    { icon: 'mail-outline', label: 'Email', value: user?.email || 'N/A' },
    { icon: 'home-outline', label: 'Flat', value: user?.flatNumber && user?.wing ? formatFlat(user.wing, user.flatNumber) : 'N/A' },
    { icon: 'shield-outline', label: 'Role', value: (user?.role || 'N/A').charAt(0).toUpperCase() + (user?.role || '').slice(1) },
  ];

  const menuItems = [
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon') },
    { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => Alert.alert('Coming Soon', 'Password change coming soon') },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Coming Soon', 'Help center coming soon') },
    { icon: 'information-circle-outline', label: 'About', onPress: () => Alert.alert('Society Management System', 'Version 1.0.0\n\nBuilt with ❤️ using React Native & Expo') },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={colors.statusBar as any} />

      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar name={user?.name || 'U'} size={88} />
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {user?.name || 'User'}
        </Text>
        <Badge
          label={(user?.role || 'user').toUpperCase()}
          color={colors.primary}
          backgroundColor={colors.primaryBg}
          size="medium"
        />
      </View>

      {/* User Info Card */}
      <Card style={styles.infoCard} variant="elevated">
        {profileItems.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.infoRow,
              index < profileItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.infoLeft}>
              <Ionicons name={item.icon as any} size={20} color={colors.textTertiary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </Card>

      {/* Dark Mode Toggle */}
      <Card style={styles.themeCard} variant="default">
        <View style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <View style={[styles.themeIcon, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2FF' }]}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={20}
                color={isDarkMode ? '#818CF8' : '#F59E0B'}
              />
            </View>
            <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={(_v: boolean) => { dispatch(toggleTheme()); }}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isDarkMode ? colors.primary : '#FFF'}
          />
        </View>
      </Card>

      {/* Menu Items */}
      <Card style={styles.menuCard} variant="default">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuRow,
              index < menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              },
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={22} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </Card>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: '#FEE2E2' }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  name: {
    ...typography.h2,
  },
  infoCard: { marginBottom: spacing.base },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoLabel: { ...typography.body },
  infoValue: { ...typography.label },
  themeCard: { marginBottom: spacing.base },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeLabel: { ...typography.label },
  menuCard: { marginBottom: spacing.xl },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: { ...typography.label },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});
