// ==========================================
// Add Complaint Screen
// ==========================================

import React, { useState } from 'react';
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
import { useAuth, useTheme } from '../../hooks';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, borderRadius } from '../../theme';
import { complaintService } from '../../services/complaintService';
import { COMPLAINT_CATEGORIES } from '../../constants';
import { ComplaintCategory } from '../../types';

const schema = yup.object().shape({
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required').min(10, 'At least 10 characters'),
});

type FormData = yup.InferType<typeof schema>;

export const AddComplaintScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { category: '', description: '' },
  });

  const selectedCategory = watch('category');

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      complaintService.create({
        category: data.category as ComplaintCategory,
        description: data.description,
        status: 'open',
        raisedBy: user?.id || '',
        raisedByName: user?.name || '',
        flatNumber: user?.flatNumber || '',
        wing: user?.wing || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      Alert.alert('Success', 'Complaint submitted successfully');
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Raise Complaint</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Category *</Text>
      <View style={styles.categoryGrid}>
        {COMPLAINT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: isSelected ? colors.primaryBg : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setValue('category', cat.value)}
            >
              <View
                style={[
                  styles.categoryIconBg,
                  { backgroundColor: isSelected ? colors.primary : colors.surfaceVariant },
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={22}
                  color={isSelected ? '#FFF' : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  { color: isSelected ? colors.primary : colors.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.category && (
        <Text style={[styles.error, { color: colors.error }]}>{errors.category.message}</Text>
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Description"
            placeholder="Describe the issue in detail..."
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={5}
            containerStyle={{ marginTop: spacing.lg }}
            error={errors.description?.message}
            required
          />
        )}
      />

      {/* Image placeholder */}
      <TouchableOpacity style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name="camera-outline" size={28} color={colors.textTertiary} />
        <Text style={[styles.imageText, { color: colors.textTertiary }]}>
          Attach Photo (Coming Soon)
        </Text>
      </TouchableOpacity>

      <Button
        title="Submit Complaint"
        onPress={handleSubmit((data) => mutation.mutate(data))}
        fullWidth
        size="large"
        loading={mutation.isPending}
        icon="send"
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
  label: { ...typography.label, marginBottom: spacing.md },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '31%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  categoryIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    ...typography.labelSmall,
    textAlign: 'center',
  },
  error: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  imageText: {
    ...typography.bodySmall,
  },
});
