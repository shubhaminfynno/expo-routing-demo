import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import ButtonComponent from "@/components/Button";
import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import useStatsStore from "@/providers/statsStore";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { quizStats, ticTacToeStats } = useStatsStore();
  const borderColor = useThemeColor({}, "border");

  const bestQuizScore = useMemo(() => {
    return Math.max(quizStats.flagBestScore, quizStats.fillBestScore || 0);
  }, [quizStats.flagBestScore, quizStats.fillBestScore]);

  const topGamesPlayed = useMemo(() => {
    const totalGames = ticTacToeStats.totalGames + quizStats.totalGames;
    return totalGames;
  }, [ticTacToeStats.totalGames, quizStats.totalGames]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <View style={{ flex: 1 }}>
          <ThemedText type="title">Arcade Demo Hub</ThemedText>
          <ThemedText style={styles.subtitle}>
            A small playground showing auth, routing, games, stats & GraphQL.
          </ThemedText>
        </View>
        <HelloWave />
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="subtitle">Quick Overview</ThemedText>
        <View style={styles.row}>
          <View style={[styles.statCard, { borderColor }]}>
            <ThemedText style={styles.statLabel}>Games Played</ThemedText>
            <ThemedText style={styles.statValue}>{topGamesPlayed}</ThemedText>
          </View>
          <View style={[styles.statCard, { borderColor }]}>
            <ThemedText style={styles.statLabel}>Best Quiz Score</ThemedText>
            <ThemedText style={styles.statValue}>{bestQuizScore}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Explore the Demo</ThemedText>

        <View style={[styles.card, { borderColor }]}>
          <ThemedText style={styles.cardTitle}>🎮 Games</ThemedText>
          <ThemedText style={styles.cardBody}>
            Play Tic Tac Toe against friends or the computer, and challenge
            yourself with a two-mode Country Quiz powered by a GraphQL API.
          </ThemedText>
          <ButtonComponent
            title="Open Game Hub"
            onPress={() => router.push("/(tabs)/game")}
          />
        </View>

        <View style={[styles.card, { borderColor }]}>
          <ThemedText style={styles.cardTitle}>📊 Player Stats</ThemedText>
          <ThemedText style={styles.cardBody}>
            Inspect global stats like top Tic Tac Toe players, total games, and
            detailed quiz performance across both quiz modes.
          </ThemedText>
          <ButtonComponent
            title="View Stats"
            onPress={() => router.push("/(tabs)/stats")}
          />
        </View>

        <View style={[styles.card, { borderColor }]}>
          <ThemedText style={styles.cardTitle}>🎬 Anime (GraphQL)</ThemedText>
          <ThemedText style={styles.cardBody}>
            Browse a list of top anime from AniList via GraphQL and trigger a
            sample Like mutation on any title.
          </ThemedText>
          <ButtonComponent
            title="Browse Anime"
            onPress={() => router.push("/(tabs)/anime")}
          />
        </View>

        <View style={[styles.card, { borderColor }]}>
          <ThemedText style={styles.cardTitle}>👤 Auth & Account</ThemedText>
          <ThemedText style={styles.cardBody}>
            Log in with a demo user, navigate to user details/roles, and try
            account actions like signing out or clearing local data.
          </ThemedText>
          <ButtonComponent
            title="Go to Account"
            onPress={() => router.push("/(tabs)/account")}
            variant="secondary"
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    gap: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardBody: {
    fontSize: 13,
    opacity: 0.8,
  },
});
