// ==========================================
// Complaints Screen
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
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { spacing, typography, borderRadius } from '../../theme';
import { complaintService } from '../../services/complaintService';
import { getComplaintStatusColor, formatFlat, getRelativeTime } from '../../utils/helpers';
import { Complaint, ComplaintStatus } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  plumbing: 'water',
  electrical: 'flash',
  cleanliness: 'leaf',
  noise: 'volume-high',
  parking: 'car',
  security: 'shield-checkmark',
  other: 'help-circle',
};

type FilterType = 'all' | ComplaintStatus;

export const ComplaintsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';
  const [filter, setFilter] = useState<FilterType>('all');
  const [statusModal, setStatusModal] = useState<Complaint | null>(null);

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ComplaintStatus }) =>
      complaintService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setStatusModal(null);
      Alert.alert('Success', 'Status updated');
    },
  });

  const filtered = complaints.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const statusStyle = getComplaintStatusColor(item.status);
    const iconName = CATEGORY_ICONS[item.category] || 'help-circle';

    return (
      <Card style={styles.card} variant="default">
        <View style={styles.cardTop}>
          <View style={[styles.categoryIcon, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name={iconName as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.category, { color: colors.textPrimary }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <Text style={[styles.cardMeta, { color: colors.textTertiary }]}>
              {formatFlat(item.wing, item.flatNumber)} · {getRelativeTime(item.createdAt)}
            </Text>
          </View>
          <Badge
            label={statusStyle.label}
            color={statusStyle.text}
            backgroundColor={statusStyle.bg}
          />
        </View>

        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
          <View style={styles.raisedBy}>
            <Avatar name={item.raisedByName} size={24} />
            <Text style={[styles.raisedByText, { color: colors.textSecondary }]}>
              {item.raisedByName}
            </Text>
          </View>
          {isAdmin && item.status !== 'resolved' && (
            <TouchableOpacity
              style={[styles.updateBtn, { backgroundColor: colors.primaryBg }]}
              onPress={() => setStatusModal(item)}
            >
              <Ionicons name="create-outline" size={14} color={colors.primary} />
              <Text style={[styles.updateText, { color: colors.primary }]}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  if (isLoading) return <Loading message="Loading complaints..." />;

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

        {!isAdmin && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddComplaint')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderComplaint}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No Complaints"
            description="All clear! No complaints for the selected filter."
          />
        }
      />

      {/* Status Update Modal */}
      <Modal
        visible={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Status"
      >
        {statusModal && (
          <View style={styles.modalContent}>
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              Change status for complaint by {statusModal.raisedByName}
            </Text>
            {(['open', 'in_progress', 'resolved'] as ComplaintStatus[]).map((status) => {
              const style = getComplaintStatusColor(status);
              const isActive = statusModal.status === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: isActive ? style.bg : colors.surfaceVariant,
                      borderColor: isActive ? style.text : colors.border,
                    },
                  ]}
                  onPress={() =>
                    statusMutation.mutate({ id: statusModal.id, status })
                  }
                  disabled={isActive}
                >
                  <View style={[styles.statusDot, { backgroundColor: style.text }]} />
                  <Text style={[styles.statusText, { color: isActive ? style.text : colors.textPrimary }]}>
                    {style.label}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark" size={18} color={style.text} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Modal>
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
  list: {
    padding: spacing.base,
    paddingTop: 0,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.base,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardInfo: { flex: 1 },
  category: { ...typography.label },
  cardMeta: { ...typography.caption, marginTop: 2 },
  description: {
    ...typography.body,
    marginTop: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  raisedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  raisedByText: { ...typography.bodySmall },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  updateText: { ...typography.labelSmall },
  modalContent: { gap: spacing.md },
  modalLabel: { ...typography.body, marginBottom: spacing.sm },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: { ...typography.label, flex: 1 },
});
