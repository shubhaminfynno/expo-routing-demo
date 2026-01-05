import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="userDetails" options={{ title: "User Details" }} />
      <Stack.Screen name="userRole" options={{ title: "User Role" }} />
    </Stack>
  );
}
