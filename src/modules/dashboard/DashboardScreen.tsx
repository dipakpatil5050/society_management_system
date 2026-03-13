// ==========================================
// Dashboard Screen
// ==========================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useTheme } from '../../hooks';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { spacing, typography, borderRadius } from '../../theme';
import { mockDashboardSummary, mockComplaints, mockVisitors, mockMaintenanceBills } from '../../utils/mockData';
import { getComplaintStatusColor, getMaintenanceStatusColor, formatCurrency, formatFlat, getRelativeTime } from '../../utils/helpers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      await delay(600);
      return mockDashboardSummary;
    },
  });

  const dashboardCards = [
    {
      title: 'Total Members',
      value: summary?.totalMembers?.toString() || '0',
      icon: 'people' as const,
      color: '#4F46E5',
      bg: '#EEF2FF',
    },
    {
      title: 'Pending Bills',
      value: summary?.pendingMaintenance?.toString() || '0',
      icon: 'receipt' as const,
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      title: 'Open Complaints',
      value: summary?.openComplaints?.toString() || '0',
      icon: 'alert-circle' as const,
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    {
      title: 'Visitors Today',
      value: summary?.visitorsToday?.toString() || '0',
      icon: 'walk' as const,
      color: '#059669',
      bg: '#D1FAE5',
    },
  ];

  const recentComplaints = mockComplaints.slice(0, 3);
  const recentBills = mockMaintenanceBills.filter(b => b.status !== 'paid').slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[colors.primary]} />
      }
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />

      {/* Greeting */}
      <View style={styles.greeting}>
        <View style={styles.greetingLeft}>
          <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.greetingName, { color: colors.textPrimary }]}>
            {user?.name || 'User'} 👋
          </Text>
          <View style={styles.roleTag}>
            <Badge
              label={user?.role || 'admin'}
              color={colors.primary}
              backgroundColor={colors.primaryBg}
              size="medium"
            />
          </View>
        </View>
        <Avatar name={user?.name || 'U'} size={52} />
      </View>

      {/* Summary Cards */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Overview
      </Text>
      <View style={styles.cardGrid}>
        {dashboardCards.map((card, index) => (
          <Card key={index} style={styles.summaryCard} variant="elevated">
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: card.bg },
              ]}
            >
              <Ionicons name={card.icon} size={22} color={card.color} />
            </View>
            <Text style={[styles.cardValue, { color: colors.textPrimary }]}>
              {card.value}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              {card.title}
            </Text>
          </Card>
        ))}
      </View>

      {/* Recent Complaints */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: spacing.xl }]}>
        Recent Complaints
      </Text>
      {recentComplaints.map((complaint) => {
        const statusStyle = getComplaintStatusColor(complaint.status);
        return (
          <Card key={complaint.id} style={styles.listCard} variant="default">
            <View style={styles.listCardHeader}>
              <View style={styles.listCardLeft}>
                <View style={[styles.categoryDot, { backgroundColor: statusStyle.text }]} />
                <View>
                  <Text style={[styles.listCardTitle, { color: colors.textPrimary }]}>
                    {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                  </Text>
                  <Text style={[styles.listCardSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    {complaint.description}
                  </Text>
                </View>
              </View>
              <Badge
                label={statusStyle.label}
                color={statusStyle.text}
                backgroundColor={statusStyle.bg}
              />
            </View>
            <View style={styles.listCardFooter}>
              <Text style={[styles.listCardMeta, { color: colors.textTertiary }]}>
                {formatFlat(complaint.wing, complaint.flatNumber)} · {getRelativeTime(complaint.createdAt)}
              </Text>
            </View>
          </Card>
        );
      })}

      {/* Pending Bills */}
      {user?.role === 'admin' && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: spacing.xl }]}>
            Pending Bills
          </Text>
          {recentBills.map((bill) => {
            const statusStyle = getMaintenanceStatusColor(bill.status);
            return (
              <Card key={bill.id} style={styles.listCard} variant="default">
                <View style={styles.listCardHeader}>
                  <View>
                    <Text style={[styles.listCardTitle, { color: colors.textPrimary }]}>
                      {formatFlat(bill.wing, bill.flatNumber)} — {bill.residentName}
                    </Text>
                    <Text style={[styles.listCardSubtitle, { color: colors.textSecondary }]}>
                      {bill.month} · Due: {bill.dueDate}
                    </Text>
                  </View>
                  <View style={styles.billRight}>
                    <Text style={[styles.billAmount, { color: colors.textPrimary }]}>
                      {formatCurrency(bill.amount)}
                    </Text>
                    <Badge
                      label={statusStyle.label}
                      color={statusStyle.text}
                      backgroundColor={statusStyle.bg}
                    />
                  </View>
                </View>
              </Card>
            );
          })}
        </>
      )}

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  greetingLeft: {
    flex: 1,
  },
  greetingLabel: {
    ...typography.body,
  },
  greetingName: {
    ...typography.h2,
    marginTop: 2,
  },
  roleTag: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryCard: {
    width: '47.5%',
    padding: spacing.base,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardLabel: {
    ...typography.bodySmall,
  },
  listCard: {
    marginBottom: spacing.sm,
    padding: spacing.base,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: spacing.sm,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  listCardTitle: {
    ...typography.label,
    marginBottom: 2,
  },
  listCardSubtitle: {
    ...typography.bodySmall,
    maxWidth: 200,
  },
  listCardFooter: {
    marginTop: spacing.sm,
  },
  listCardMeta: {
    ...typography.caption,
  },
  billRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  billAmount: {
    ...typography.label,
    fontSize: 16,
    fontWeight: '700',
  },
});
