import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "react-native";

export default function UserDetailsScreen() {
  const { user } = useLocalSearchParams();
  const { push } = useRouter();

  const parsedUser = JSON.parse(user as string);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText>User Details</ThemedText>
      <ThemedText>Name: {parsedUser.fullName}</ThemedText>
      <ThemedText>Email: {parsedUser.email}</ThemedText>

      <Button
        title="View Role Details"
        onPress={() =>
          push({
            pathname: "/user/userRole",
            params: { user: JSON.stringify(parsedUser) },
          })
        }
      />
    </ThemedView>
  );
}
