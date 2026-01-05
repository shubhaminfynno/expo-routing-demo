import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams } from "expo-router";

export default function UserRoleScreen() {
  const { user } = useLocalSearchParams();
  const parsedUser = JSON.parse(user as string);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText>User Role Screen</ThemedText>
      <ThemedText>Name: {parsedUser.fullName}</ThemedText>
      <ThemedText>Email: {parsedUser.email}</ThemedText>
    </ThemedView>
  );
}
