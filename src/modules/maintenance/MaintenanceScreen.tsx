// ==========================================
// Maintenance Screen
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
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { spacing, typography, borderRadius } from '../../theme';
import { maintenanceService } from '../../services/maintenanceService';
import { formatCurrency, formatFlat, getMaintenanceStatusColor, formatDate } from '../../utils/helpers';
import { MaintenanceBill, MaintenanceStatus } from '../../types';

type FilterType = 'all' | MaintenanceStatus;

export const MaintenanceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');
  const isAdmin = user?.role === 'admin';

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceService.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ['maintenance-stats'],
    queryFn: maintenanceService.getStats,
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => maintenanceService.updateStatus(id, 'paid'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-stats'] });
      Alert.alert('Success', 'Payment marked as received');
    },
  });

  const filteredBills = bills.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'overdue', label: 'Overdue' },
  ];

  const handlePay = (bill: MaintenanceBill) => {
    Alert.alert(
      'Confirm Payment',
      `Mark ₹${bill.amount} for ${formatFlat(bill.wing, bill.flatNumber)} as paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => payMutation.mutate(bill.id) },
      ]
    );
  };

  const renderBill = ({ item }: { item: MaintenanceBill }) => {
    const statusStyle = getMaintenanceStatusColor(item.status);
    return (
      <Card style={styles.billCard} variant="default">
        <View style={styles.billHeader}>
          <View style={styles.billLeft}>
            <Text style={[styles.billFlat, { color: colors.textPrimary }]}>
              {formatFlat(item.wing, item.flatNumber)}
            </Text>
            <Text style={[styles.billName, { color: colors.textSecondary }]}>
              {item.residentName}
            </Text>
          </View>
          <View style={styles.billRight}>
            <Text style={[styles.billAmount, { color: colors.textPrimary }]}>
              {formatCurrency(item.amount)}
            </Text>
            <Badge
              label={statusStyle.label}
              color={statusStyle.text}
              backgroundColor={statusStyle.bg}
            />
          </View>
        </View>

        <View style={[styles.billMeta, { borderTopColor: colors.borderLight }]}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {item.month}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              Due: {formatDate(item.dueDate)}
            </Text>
          </View>
        </View>

        {item.status !== 'paid' && (
          <Button
            title={isAdmin ? 'Mark as Paid' : 'Pay Now'}
            onPress={() => handlePay(item)}
            variant="secondary"
            size="small"
            icon="checkmark-circle"
            fullWidth
            style={{ marginTop: spacing.md }}
            loading={payMutation.isPending}
          />
        )}

        {item.status === 'paid' && item.paidDate && (
          <Text style={[styles.paidDate, { color: colors.success }]}>
            ✓ Paid on {formatDate(item.paidDate)}
          </Text>
        )}
      </Card>
    );
  };

  if (isLoading) return <Loading message="Loading bills..." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />

      {/* Stats Bar */}
      {stats && isAdmin && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {formatCurrency(stats.collectedAmount)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Collected</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {formatCurrency(stats.totalAmount - stats.collectedAmount)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
          </View>
        </View>
      )}

      {/* Filter */}
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

        {isAdmin && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddMaintenance')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredBills}
        renderItem={renderBill}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Bills Found"
            description="No maintenance bills for the selected filter"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.base,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    ...typography.bodySmall,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    ...typography.labelSmall,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  list: {
    padding: spacing.base,
    paddingTop: 0,
  },
  billCard: {
    marginBottom: spacing.md,
    padding: spacing.base,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billLeft: {},
  billFlat: {
    ...typography.h4,
  },
  billName: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  billRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  billAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  billMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.bodySmall,
  },
  paidDate: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
