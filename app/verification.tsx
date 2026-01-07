import Button from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { View } from "react-native";

const VerificationScreen = () => {
  const { activeUser, markVerified } = useAuth();
  const router = useRouter();

  const onVerifyUser = async () => {
    await markVerified();
    router.replace("/(tabs)");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <ThemedText style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Verify your account
      </ThemedText>
      <ThemedText
        style={{ textAlign: "center", marginBottom: 24, color: "#4b5563" }}
      >
        {activeUser?.email
          ? `We still need to verify ${activeUser.email}.`
          : "We still need to verify your account."}
      </ThemedText>
      <Button title={"Verify user"} onPress={onVerifyUser} />
    </View>
  );
};

export default VerificationScreen;
