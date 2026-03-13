// ==========================================
// Guard Visitor History Screen
// ==========================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { spacing, typography } from '../../theme';
import { visitorService } from '../../services/visitorService';
import { getVisitorStatusColor, formatFlat, formatDate, formatTime } from '../../utils/helpers';
import { Visitor } from '../../types';

export const GuardHistoryScreen: React.FC = () => {
  const { colors } = useTheme();

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ['visitors'],
    queryFn: visitorService.getAll,
  });

  const renderVisitor = ({ item }: { item: Visitor }) => {
    const statusStyle = getVisitorStatusColor(item.status);

    return (
      <Card style={styles.card} variant="default">
        <View style={styles.row}>
          <Avatar name={item.visitorName} size={40} />
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {item.visitorName}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatFlat(item.wing, item.flatNumber)} · {formatDate(item.visitDate)}
            </Text>
          </View>
          <Badge
            label={statusStyle.label}
            color={statusStyle.text}
            backgroundColor={statusStyle.bg}
          />
        </View>
        {(item.entryTime || item.exitTime) && (
          <View style={[styles.timeRow, { borderTopColor: colors.borderLight }]}>
            {item.entryTime && (
              <View style={styles.timeItem}>
                <Ionicons name="log-in-outline" size={14} color={colors.success} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  Entry: {formatTime(item.entryTime)}
                </Text>
              </View>
            )}
            {item.exitTime && (
              <View style={styles.timeItem}>
                <Ionicons name="log-out-outline" size={14} color={colors.textTertiary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  Exit: {formatTime(item.exitTime)}
                </Text>
              </View>
            )}
          </View>
        )}
      </Card>
    );
  };

  if (isLoading) return <Loading message="Loading history..." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} />
      <FlatList
        data={visitors}
        renderItem={renderVisitor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No History"
            description="Visitor history will appear here"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.base },
  card: { marginBottom: spacing.md, padding: spacing.base },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...typography.label },
  meta: { ...typography.bodySmall, marginTop: 2 },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { ...typography.bodySmall },
});
