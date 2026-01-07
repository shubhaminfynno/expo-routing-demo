import Button from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

const LockScreen = () => {
  const router = useRouter();

  const handleUnlock = () => {
    // Navigate back to the previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>App Locked</ThemedText>
        <ThemedText style={styles.subtitle}>
          The app was locked due to inactivity
        </ThemedText>
        <Button title="Unlock" onPress={handleUnlock} />
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
