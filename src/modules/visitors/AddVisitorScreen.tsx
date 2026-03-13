// ==========================================
// Add Visitor Screen (Schedule Visit)
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
import { useAuth, useTheme } from '../../hooks';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { spacing, typography, borderRadius } from '../../theme';
import { visitorService } from '../../services/visitorService';

const schema = yup.object().shape({
  visitorName: yup.string().required('Visitor name is required'),
  visitorPhone: yup.string().optional(),
  visitDate: yup.string().required('Visit date is required'),
  purpose: yup.string().optional(),
});

interface FormData {
  visitorName: string;
  visitorPhone?: string;
  visitDate: string;
  purpose?: string;
}

export const AddVisitorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      visitorName: '',
      visitorPhone: '',
      visitDate: new Date().toISOString().split('T')[0],
      purpose: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      visitorService.schedule({
        visitorName: data.visitorName,
        visitorPhone: data.visitorPhone,
        visitDate: data.visitDate,
        flatNumber: user?.flatNumber || '',
        wing: user?.wing || '',
        residentName: user?.name || '',
        purpose: data.purpose,
      }),
    onSuccess: (visitor) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      Alert.alert(
        'Visitor Scheduled! 🎉',
        `OTP for ${visitor.visitorName}: ${visitor.otp}\n\nShare this OTP with your visitor for entry.`,
        [{ text: 'Done', onPress: () => navigation.goBack() }]
      );
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Schedule Visitor</Text>
        <View style={{ width: 24 }} />
      </View>

      <Card style={styles.infoCard} variant="outlined">
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            An OTP will be generated and shared with the visitor for gate entry
          </Text>
        </View>
      </Card>

      <Controller
        control={control}
        name="visitorName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Visitor Name"
            placeholder="Enter visitor name"
            icon="person-outline"
            value={value}
            onChangeText={onChange}
            error={errors.visitorName?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="visitorPhone"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Visitor Phone"
            placeholder="Enter phone number (optional)"
            icon="call-outline"
            value={value || ''}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="visitDate"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Visit Date"
            placeholder="YYYY-MM-DD"
            icon="calendar-outline"
            value={value}
            onChangeText={onChange}
            error={errors.visitDate?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="purpose"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Purpose"
            placeholder="e.g. Family visit, Delivery"
            icon="document-text-outline"
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />

      <Button
        title="Schedule Visit"
        onPress={handleSubmit((data) => mutation.mutate(data))}
        fullWidth
        size="large"
        loading={mutation.isPending}
        icon="calendar-outline"
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
  infoCard: {
    marginBottom: spacing.xl,
    padding: spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    flex: 1,
  },
});
