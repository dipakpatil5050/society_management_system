// ==========================================
// Add / Edit Member Screen
// ==========================================

import React, { useEffect, useState } from 'react';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { spacing, typography, borderRadius } from '../../theme';
import { memberService } from '../../services/memberService';
import { WINGS } from '../../constants';
import { Member } from '../../types';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name too short'),
  phone: yup.string().required('Phone is required').min(10, 'Invalid phone number'),
  email: yup.string().required('Email is required').email('Invalid email'),
  flatNumber: yup.string().required('Flat number is required'),
  wing: yup.string().required('Wing is required'),
  ownerOrTenant: yup.string().oneOf(['owner', 'tenant']).required('Select owner or tenant'),
  moveInDate: yup.string().required('Move-in date is required'),
});

type FormData = yup.InferType<typeof schema>;

export const AddEditMemberScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const memberId = route.params?.memberId;
  const isEdit = !!memberId;

  const { data: existingMember, isLoading: loadingMember } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => memberService.getById(memberId),
    enabled: isEdit,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      flatNumber: '',
      wing: 'A',
      ownerOrTenant: 'owner',
      moveInDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedWing = watch('wing');
  const selectedType = watch('ownerOrTenant');

  useEffect(() => {
    if (existingMember) {
      setValue('name', existingMember.name);
      setValue('phone', existingMember.phone);
      setValue('email', existingMember.email);
      setValue('flatNumber', existingMember.flatNumber);
      setValue('wing', existingMember.wing);
      setValue('ownerOrTenant', existingMember.ownerOrTenant);
      setValue('moveInDate', existingMember.moveInDate);
    }
  }, [existingMember]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (isEdit) {
        return memberService.update(memberId, data as Partial<Member>);
      }
      return memberService.create(data as Omit<Member, 'id'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      Alert.alert('Success', `Member ${isEdit ? 'updated' : 'added'} successfully`);
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Error', 'Something went wrong');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (isEdit && loadingMember) return <Loading message="Loading member..." />;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {isEdit ? 'Edit Member' : 'Add Member'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Full Name"
            placeholder="Enter full name"
            icon="person-outline"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            icon="call-outline"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phone?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email Address"
            placeholder="Enter email"
            icon="mail-outline"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
            required
          />
        )}
      />

      {/* Wing Selection */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>Wing *</Text>
      <View style={styles.chipRow}>
        {WINGS.map((wing) => (
          <TouchableOpacity
            key={wing}
            style={[
              styles.chip,
              {
                backgroundColor: selectedWing === wing ? colors.primary : colors.surfaceVariant,
                borderColor: selectedWing === wing ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setValue('wing', wing)}
          >
            <Text
              style={[
                styles.chipText,
                { color: selectedWing === wing ? '#FFF' : colors.textSecondary },
              ]}
            >
              {wing}
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
            placeholder="e.g. 101, 202"
            icon="home-outline"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            error={errors.flatNumber?.message}
            required
          />
        )}
      />

      {/* Owner / Tenant toggle */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>Type *</Text>
      <View style={styles.toggleRow}>
        {(['owner', 'tenant'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: selectedType === type ? colors.primary : colors.surfaceVariant,
                borderColor: selectedType === type ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setValue('ownerOrTenant', type)}
          >
            <Ionicons
              name={type === 'owner' ? 'key' : 'document-text'}
              size={18}
              color={selectedType === type ? '#FFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.toggleText,
                { color: selectedType === type ? '#FFF' : colors.textSecondary },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Controller
        control={control}
        name="moveInDate"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Move-in Date"
            placeholder="YYYY-MM-DD"
            icon="calendar-outline"
            value={value}
            onChangeText={onChange}
            error={errors.moveInDate?.message}
            required
          />
        )}
      />

      <Button
        title={isEdit ? 'Update Member' : 'Add Member'}
        onPress={handleSubmit(onSubmit)}
        fullWidth
        size="large"
        loading={mutation.isPending}
        icon={isEdit ? 'checkmark' : 'person-add'}
        style={{ marginTop: spacing.xl }}
      />

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h3,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  chipText: {
    ...typography.label,
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  toggleText: {
    ...typography.label,
  },
});
