import { useState } from "react";
import { StyleSheet, Switch } from "react-native";

import FaceIdSettings from "@/components/FaceIdSettings";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === "dark"
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>

      <ThemedView style={styles.settingItem}>
        <ThemedText type="defaultSemiBold">Enable Notifications</ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </ThemedView>

      <ThemedView style={styles.settingItem}>
        <ThemedText type="defaultSemiBold">Dark Mode</ThemedText>
        <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
      </ThemedView>
      {isSignedIn && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Security
          </ThemedText>
          <FaceIdSettings />
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">About</ThemedText>
        <ThemedText>Version 1.0.0</ThemedText>
        <ThemedText>Built with Expo Router</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  section: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
