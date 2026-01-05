import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import "react-native-reanimated";

import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { queryClient } from "@/providers/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RootStack />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootStack() {
  const { isSignedIn, isLoaded, isVerified } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!isLoaded) return;
    if (!navigationState?.key) return;

    if (!isSignedIn) {
      router.replace("/(auth)/login");
    } else if (!isVerified) {
      router.replace("/(auth)/verification");
    } else {
      router.replace("/");
    }
  }, [isLoaded, navigationState?.key, isSignedIn, isVerified]);

  if (!isLoaded || !navigationState?.key) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: true }}
      />
      <Stack.Screen name="(auth)" />
      <Stack.Screen
        name="tictactoe"
        options={{
          headerShown: true,
          title: "Tic Tac Toe",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="countryQuiz"
        options={{
          headerShown: true,
          title: "Country Quiz",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="postDetails"
        options={{
          headerShown: true,
          title: "Post Details",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="animeDetails"
        options={{
          headerShown: true,
          title: "Anime Details",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="graphqlZero"
        options={{
          headerShown: true,
          title: "GraphQL Demo",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="flashList"
        options={{
          headerShown: true,
          title: "FlashList Demo",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
