import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { COLORS } from "@/constants/colors";
import { getUsers } from "@/helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "@/types";

export default function LoginScreen() {
  const {
    signIn,
    // authenticateWithBiometrics,
    // isBiometricAvailable,
    // biometricType,
    activeUser,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const disableSubmit = !email || !password;

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [showBiometricOption, setShowBiometricOption] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await getUsers();
      setUsers(storedUsers || []);

      // Check if there's a user with Face ID enabled
      // const userWithBiometrics = storedUsers?.find(
      //   (user: User) => user.faceIdEnabled
      // );
      // setShowBiometricOption(
      //   Boolean(userWithBiometrics && isBiometricAvailable)
      // );
    };
    loadUsers();
  }, []);

  const inputBorder = useThemeColor({}, "border");
  const inputBg = useThemeColor(
    { light: "#ffffff", dark: "#18181b" },
    "background"
  );
  const inputText = useThemeColor({}, "text");

  const handleSubmit = async () => {
    setError("");

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    await signIn(user);
  };

  // const handleBiometricLogin = async () => {
  //   setError("");

  //   try {
  //     const success = await authenticateWithBiometrics();
  //     if (success) {
  //       // Find the user with Face ID enabled and sign them in
  //       const userWithBiometrics = users.find(
  //         (user: User) => user.faceIdEnabled
  //       );
  //       if (userWithBiometrics) {
  //         await signIn(userWithBiometrics);
  //       }
  //     } else {
  //       Alert.alert(
  //         "Authentication Failed",
  //         `${biometricType} authentication was cancelled or failed.`,
  //         [{ text: "OK" }]
  //       );
  //     }
  //   } catch (error) {
  //     Alert.alert(
  //       "Error",
  //       "An error occurred during biometric authentication.",
  //       [{ text: "OK" }]
  //     );
  //   }
  // };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.title}>Static auth demo</ThemedText>
        {/* <ThemedText style={styles.title}>
          Dummy commit text for EAS build submit to App Store testflight
        </ThemedText> */}

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
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
          secureTextEntry
          placeholder="Password"
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

        {error ? (
          <ThemedText style={{ color: "red", marginBottom: 6 }}>
            {error}
          </ThemedText>
        ) : null}

        <TouchableOpacity
          style={[styles.primaryButton, disableSubmit && { opacity: 0.5 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={disableSubmit}
        >
          <ThemedText style={styles.primaryButtonLabel}>Continue</ThemedText>
        </TouchableOpacity>

        {/* {showBiometricOption && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#2563eb"
            />
            <ThemedText style={styles.biometricButtonLabel}>
              Sign in with {biometricType}
            </ThemedText>
          </TouchableOpacity>
        )} */}

        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <ThemedText style={styles.linkText}>
            Need an account? Create one
          </ThemedText>
        </TouchableOpacity>
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
    backgroundColor: "#292D32",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  biometricButton: {
    marginTop: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  biometricButtonLabel: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    marginTop: 12,
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "500",
  },
});
