import Button from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const LockScreen = () => {
  const router = useRouter();
  const { authenticateWithBiometrics, isBiometricAvailable, biometricType, activeUser } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleUnlock = async () => {
    if (isBiometricAvailable && activeUser?.faceIdEnabled) {
      setIsAuthenticating(true);
      const success = await authenticateWithBiometrics();
      setIsAuthenticating(false);
      if (success) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (isBiometricAvailable && activeUser?.faceIdEnabled) {
      handleUnlock();
    }
  }, [isBiometricAvailable, activeUser?.faceIdEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>App Locked</ThemedText>
        <ThemedText style={styles.subtitle}>
          The app was locked due to inactivity
        </ThemedText>
        <Button 
          title={isBiometricAvailable && activeUser?.faceIdEnabled ? `Unlock with ${biometricType}` : "Unlock"} 
          onPress={handleUnlock}
          isLoading={isAuthenticating}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 32,
  },
});

export default LockScreen;
