// ==========================================
// Guard Visitor Entry Screen
// ==========================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { spacing, typography, borderRadius } from '../../theme';
import { visitorService } from '../../services/visitorService';
import { Visitor } from '../../types';
import { formatFlat, getVisitorStatusColor } from '../../utils/helpers';

export const GuardEntryScreen: React.FC = () => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState('');
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [verifying, setVerifying] = useState(false);

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP');
      return;
    }
    setVerifying(true);
    try {
      const found = await visitorService.verifyOTP(otp);
      if (found) {
        setVisitor(found);
      } else {
        Alert.alert('OTP Not Found', 'No visitor found with this OTP');
        setVisitor(null);
      }
    } catch {
      Alert.alert('Error', 'Verification failed');
    }
    setVerifying(false);
  };

  const checkInMutation = useMutation({
    mutationFn: (id: string) => visitorService.checkIn(id),
    onSuccess: (v) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      setVisitor(v);
      Alert.alert('✅ Entry Approved', `${v.visitorName} has been checked in`);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => visitorService.checkOut(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      setVisitor(null);
      setOtp('');
      Alert.alert('Exit Logged', 'Visitor has been checked out');
    },
  });

  const reset = () => {
    setOtp('');
    setVisitor(null);
  };

  const statusStyle = visitor ? getVisitorStatusColor(visitor.status) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} />

      <View style={styles.content}>
        {/* OTP Input */}
        <View style={styles.otpSection}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>
            Visitor Verification
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter the visitor's 4-digit OTP to verify
          </Text>

          <Input
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
            containerStyle={styles.otpInput}
          />

          <View style={styles.actionRow}>
            <Button
              title="Verify OTP"
              onPress={verifyOTP}
              loading={verifying}
              icon="search"
              size="large"
              style={{ flex: 1 }}
            />
            {visitor && (
              <Button
                title="Reset"
                onPress={reset}
                variant="outline"
                size="large"
                style={{ flex: 0.5 }}
              />
            )}
          </View>
        </View>

        {/* Visitor Card */}
        {visitor && (
          <Card style={styles.visitorCard} variant="elevated">
            <View style={styles.visitorHeader}>
              <Avatar name={visitor.visitorName} size={52} />
              <View style={styles.visitorInfo}>
                <Text style={[styles.visitorName, { color: colors.textPrimary }]}>
                  {visitor.visitorName}
                </Text>
                <Text style={[styles.visitorMeta, { color: colors.textSecondary }]}>
                  Going to: {formatFlat(visitor.wing, visitor.flatNumber)}
                </Text>
                <Text style={[styles.visitorMeta, { color: colors.textSecondary }]}>
                  Resident: {visitor.residentName}
                </Text>
              </View>
              {statusStyle && (
                <Badge
                  label={statusStyle.label}
                  color={statusStyle.text}
                  backgroundColor={statusStyle.bg}
                  size="medium"
                />
              )}
            </View>

            {visitor.purpose && (
              <View style={[styles.purposeRow, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.purposeText, { color: colors.textSecondary }]}>
                  {visitor.purpose}
                </Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              {visitor.status === 'scheduled' && (
                <Button
                  title="Approve Entry"
                  onPress={() => checkInMutation.mutate(visitor.id)}
                  loading={checkInMutation.isPending}
                  icon="checkmark-circle"
                  fullWidth
                  size="large"
                />
              )}
              {visitor.status === 'checked_in' && (
                <Button
                  title="Log Exit"
                  onPress={() => checkOutMutation.mutate(visitor.id)}
                  loading={checkOutMutation.isPending}
                  variant="outline"
                  icon="log-out-outline"
                  fullWidth
                  size="large"
                />
              )}
            </View>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, flex: 1, justifyContent: 'center' },
  otpSection: { alignItems: 'center', marginBottom: spacing.xl },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heading: { ...typography.h2, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl },
  otpInput: { width: '100%', marginBottom: spacing.base },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  visitorCard: { padding: spacing.lg },
  visitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitorInfo: { flex: 1, marginLeft: spacing.md },
  visitorName: { ...typography.h4 },
  visitorMeta: { ...typography.bodySmall, marginTop: 2 },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  purposeText: { ...typography.body },
  actionButtons: { marginTop: spacing.lg },
});
