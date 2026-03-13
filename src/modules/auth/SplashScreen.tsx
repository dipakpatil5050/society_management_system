// ==========================================
// Splash Screen
// ==========================================

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useTheme } from "../../hooks";

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { restoreSession, isAuthenticated, isLoading } = useAuth();

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    restoreSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        if (isAuthenticated) {
          navigation.reset({ index: 0, routes: [{ name: "AppStack" }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: "#4F46E5" }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="business" size={64} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>SOCIETY</Text>
        <Text style={styles.subtitle}>MANAGEMENT SYSTEM</Text>
        <View style={styles.loader}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotDelay1]} />
          <View style={[styles.dot, styles.dotDelay2]} />
        </View>
      </Animated.View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 4,
    marginTop: 8,
  },
  loader: {
    flexDirection: "row",
    marginTop: 48,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dotDelay1: {
    opacity: 0.8,
  },
  dotDelay2: {
    opacity: 0.5,
  },
  version: {
    position: "absolute",
    bottom: 40,
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontWeight: "500",
  },
});
