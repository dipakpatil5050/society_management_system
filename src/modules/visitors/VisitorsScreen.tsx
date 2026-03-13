// ==========================================
// Visitors Screen (Admin / Resident)
// ==========================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useTheme } from '../../hooks';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { spacing, typography, borderRadius } from '../../theme';
import { visitorService } from '../../services/visitorService';
import { getVisitorStatusColor, formatFlat, formatDate, formatTime } from '../../utils/helpers';
import { Visitor, VisitorStatus } from '../../types';

type FilterType = 'all' | VisitorStatus;

export const VisitorsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ['visitors'],
    queryFn: visitorService.getAll,
  });

  const checkOutMutation = useMutation({
    mutationFn: visitorService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      Alert.alert('Success', 'Visitor checked out');
    },
  });

  const filtered = visitors.filter((v) => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'checked_in', label: 'Checked In' },
    { key: 'checked_out', label: 'Checked Out' },
  ];

  const renderVisitor = ({ item }: { item: Visitor }) => {
    const statusStyle = getVisitorStatusColor(item.status);

    return (
      <Card style={styles.card} variant="default">
        <View style={styles.cardTop}>
          <Avatar name={item.visitorName} size={44} />
          <View style={styles.cardInfo}>
            <Text style={[styles.visitorName, { color: colors.textPrimary }]}>
              {item.visitorName}
            </Text>
            <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
              {formatFlat(item.wing, item.flatNumber)} · {item.residentName}
            </Text>
          </View>
          <Badge
            label={statusStyle.label}
            color={statusStyle.text}
            backgroundColor={statusStyle.bg}
          />
        </View>

        <View style={[styles.detailsRow, { borderTopColor: colors.borderLight }]}>
          {item.purpose && (
            <View style={styles.detailItem}>
              <Ionicons name="document-text-outline" size={14} color={colors.textTertiary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.purpose}
              </Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatDate(item.visitDate)}
            </Text>
          </View>
          {item.entryTime && (
            <View style={styles.detailItem}>
              <Ionicons name="log-in-outline" size={14} color={colors.success} />
              <Text style={[styles.detailText, { color: colors.success }]}>
                In: {formatTime(item.entryTime)}
              </Text>
            </View>
          )}
          {item.exitTime && (
            <View style={styles.detailItem}>
              <Ionicons name="log-out-outline" size={14} color={colors.textTertiary} />
              <Text style={[styles.detailText, { color: colors.textTertiary }]}>
                Out: {formatTime(item.exitTime)}
              </Text>
            </View>
          )}
        </View>

        {/* OTP Display */}
        {item.status === 'scheduled' && (
          <View style={[styles.otpBar, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name="key-outline" size={16} color={colors.primary} />
            <Text style={[styles.otpLabel, { color: colors.primary }]}>OTP:</Text>
            <Text style={[styles.otpValue, { color: colors.primary }]}>{item.otp}</Text>
          </View>
        )}

        {/* Check out button */}
        {item.status === 'checked_in' && user?.role !== 'guard' && (
          <TouchableOpacity
            style={[styles.checkOutBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={() => {
              Alert.alert('Check Out', `Mark ${item.visitorName} as checked out?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => checkOutMutation.mutate(item.id) },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.checkOutText, { color: colors.textSecondary }]}>Check Out</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  if (isLoading) return <Loading message="Loading visitors..." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} />

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? colors.primary : colors.surfaceVariant,
                borderColor: filter === f.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.key ? '#FFF' : colors.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddVisitor')}
        >
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderVisitor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Visitors"
            description="No visitor records for the selected filter"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterText: { ...typography.labelSmall },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  list: { padding: spacing.base, paddingTop: 0 },
  card: { marginBottom: spacing.md, padding: spacing.base },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  visitorName: { ...typography.label, fontSize: 16 },
  cardMeta: { ...typography.bodySmall, marginTop: 2 },
  detailsRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { ...typography.bodySmall },
  otpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  otpLabel: { ...typography.label },
  otpValue: { ...typography.h3, letterSpacing: 4 },
  checkOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  checkOutText: { ...typography.label },
});
