// ==========================================
// Members Screen
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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { spacing, typography, borderRadius } from '../../theme';
import { memberService } from '../../services/memberService';
import { formatFlat } from '../../utils/helpers';
import { Member } from '../../types';

export const MembersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: members = [], isLoading, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: memberService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.flatNumber.includes(q) ||
      m.wing.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const handleDelete = (member: Member) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(member.id),
        },
      ]
    );
  };

  const renderMember = ({ item }: { item: Member }) => (
    <Card style={styles.memberCard} variant="default">
      <View style={styles.memberTop}>
        <Avatar name={item.name} size={48} />
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.memberFlat, { color: colors.textSecondary }]}>
            {formatFlat(item.wing, item.flatNumber)}
          </Text>
        </View>
        <Badge
          label={item.ownerOrTenant === 'owner' ? 'Owner' : 'Tenant'}
          color={item.ownerOrTenant === 'owner' ? '#4F46E5' : '#D97706'}
          backgroundColor={item.ownerOrTenant === 'owner' ? '#EEF2FF' : '#FEF3C7'}
        />
      </View>

      <View style={[styles.memberDetails, { borderTopColor: colors.borderLight }]}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.phone}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>

      <View style={styles.memberActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primaryBg }]}
          onPress={() => navigation.navigate('EditMember', { memberId: item.id })}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={[styles.actionText, { color: '#DC2626' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) return <Loading message="Loading members..." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search members..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddMember')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Members Found"
            description={
              searchQuery
                ? 'Try a different search term'
                : 'Add your first society member'
            }
            actionLabel={!searchQuery ? 'Add Member' : undefined}
            onAction={!searchQuery ? () => navigation.navigate('AddMember') : undefined}
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
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.base,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    marginLeft: spacing.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.base,
    paddingTop: 0,
  },
  memberCard: {
    marginBottom: spacing.md,
    padding: spacing.base,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memberName: {
    ...typography.label,
    fontSize: 16,
  },
  memberFlat: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  memberDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.bodySmall,
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  actionText: {
    ...typography.labelSmall,
  },
});
