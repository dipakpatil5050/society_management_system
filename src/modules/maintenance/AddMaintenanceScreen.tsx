// ==========================================
// Add Maintenance Screen
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, borderRadius } from '../../theme';
import { maintenanceService } from '../../services/maintenanceService';
import { WINGS } from '../../constants';

const schema = yup.object().shape({
  flatNumber: yup.string().required('Flat number is required'),
  wing: yup.string().required('Wing is required'),
  amount: yup.number().required('Amount is required').positive('Must be positive'),
  month: yup.string().required('Month is required'),
  dueDate: yup.string().required('Due date is required'),
  residentName: yup.string().required('Resident name is required'),
});

type FormData = yup.InferType<typeof schema>;

export const AddMaintenanceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      flatNumber: '',
      wing: 'A',
      amount: 0,
      month: 'March 2026',
      dueDate: '2026-03-15',
      residentName: '',
    },
  });

  const selectedWing = watch('wing');

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      maintenanceService.create({
        ...data,
        amount: Number(data.amount),
        status: 'pending',
      } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      Alert.alert('Success', 'Bill created successfully');
      navigation.goBack();
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle={colors.statusBar as any} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Create Bill</Text>
        <View style={{ width: 24 }} />
      </View>

      <Controller
        control={control}
        name="residentName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Resident Name"
            placeholder="Enter resident name"
            icon="person-outline"
            value={value}
            onChangeText={onChange}
            error={errors.residentName?.message}
            required
          />
        )}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Wing *</Text>
      <View style={styles.chipRow}>
        {WINGS.map((w) => (
          <TouchableOpacity
            key={w}
            style={[
              styles.chip,
              {
                backgroundColor: selectedWing === w ? colors.primary : colors.surfaceVariant,
                borderColor: selectedWing === w ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setValue('wing', w)}
          >
            <Text style={[styles.chipText, { color: selectedWing === w ? '#FFF' : colors.textSecondary }]}>
              {w}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Controller
        control={control}
        name="flatNumber"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Flat Number"
            placeholder="e.g. 101"
            icon="home-outline"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            error={errors.flatNumber?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Amount (₹)"
            placeholder="Enter amount"
            icon="cash-outline"
            value={value ? String(value) : ''}
            onChangeText={(t) => onChange(Number(t) || 0)}
            keyboardType="numeric"
            error={errors.amount?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="month"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Month"
            placeholder="e.g. March 2026"
            icon="calendar-outline"
            value={value}
            onChangeText={onChange}
            error={errors.month?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Due Date"
            placeholder="YYYY-MM-DD"
            icon="time-outline"
            value={value}
            onChangeText={onChange}
            error={errors.dueDate?.message}
            required
          />
        )}
      />

      <Button
        title="Create Bill"
        onPress={handleSubmit((data) => mutation.mutate(data))}
        fullWidth
        size="large"
        loading={mutation.isPending}
        icon="receipt"
        style={{ marginTop: spacing.xl }}
      />

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h3 },
  label: { ...typography.label, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.base },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  chipText: { ...typography.label, fontSize: 14 },
});
