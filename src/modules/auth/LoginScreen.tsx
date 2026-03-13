import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { spacing, typography, borderRadius } from "../../theme";

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("admin@societyms.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      navigation.navigate("RoleSelection", { email, password });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar
          barStyle={colors.statusBar as any}
          backgroundColor={colors.background}
        />

        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: colors.primaryBg },
            ]}
          >
            <Ionicons name="business" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
            Welcome Back
          </Text>
          <Text
            style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}
          >
            Sign in to manage your society
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password}
            required
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text
              style={[styles.forgotPasswordText, { color: colors.primary }]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Continue"
            onPress={handleLogin}
            fullWidth
            size="large"
            icon="arrow-forward"
            iconPosition="right"
            style={{ marginTop: spacing.lg }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Demo credentials are pre-filled
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...typography.body,
    textAlign: "center",
  },
  form: {
    marginBottom: spacing["2xl"],
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    ...typography.labelSmall,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.bodySmall,
  },
});
