import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { COLORS } from "@/constants/colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "@/types";

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const disableSubmit = !email || !password || !fullName;

  const inputBorder = useThemeColor({}, "border");
  const inputBg = useThemeColor(
    { light: "#ffffff", dark: "#18181b" },
    "background"
  );
  const inputText = useThemeColor({}, "text");

  const handleRegister = async () => {
    const newUser: User = {
      id: Date.now(),
      fullName,
      email,
      password,
      isAuthenticated: true,
      isVerified: false,
    };

    await signIn(newUser);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.title}>Create account</ThemedText>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          style={[
            styles.input,
            {
              borderColor: inputBorder,
              backgroundColor: inputBg,
              color: inputText,
            },
          ]}
          placeholderTextColor={COLORS.placeholder}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            {
              borderColor: inputBorder,
              backgroundColor: inputBg,
              color: inputText,
            },
          ]}
          placeholderTextColor={COLORS.placeholder}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={[
            styles.input,
            {
              borderColor: inputBorder,
              backgroundColor: inputBg,
              color: inputText,
            },
          ]}
          placeholderTextColor={COLORS.placeholder}
        />

        <TouchableOpacity
          style={[styles.primaryButton, disableSubmit && { opacity: 0.5 }]}
          onPress={handleRegister}
          activeOpacity={0.8}
          disabled={disableSubmit}
        >
          <ThemedText style={styles.primaryButtonLabel}>
            Create account
          </ThemedText>
        </TouchableOpacity>

        <Link href="/(auth)/login" replace asChild>
          <TouchableOpacity>
            <ThemedText style={styles.linkText}>
              Already registered? Sign in
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    marginHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    marginTop: 12,
    textAlign: "center",
    color: "#292D32",
    fontWeight: "500",
  },
});
