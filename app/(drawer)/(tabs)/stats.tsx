import Button from "@/components/button/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import useStatsStore from "@/providers/statsStore";
import { GlobalStyles } from "@/styles/globalStyles";
import React, { useMemo } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const borderColor = useThemeColor({}, "border");

  return (
    <View style={[styles.statCard, { borderColor }]}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={[GlobalStyles.mdSemibold, styles.statValue]}>
        {value}
      </ThemedText>
    </View>
  );
};

const SectionTitle = ({ text }: { text: string }) => (
  <ThemedText
    type="subtitle"
    style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}
  >
    {text}
  </ThemedText>
);

const StatsScreen = () => {
  const {
    quizStats,
    ticTacToeStats,
    resetQuizStats,
    resetTicTacToeStats,
    resetAllStats,
  } = useStatsStore();

  const topPlayers = useMemo(
    () =>
      Object.values(ticTacToeStats.playerStats)
        .sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          return b.games - a.games;
        })
        .slice(0, 5),
    [ticTacToeStats.playerStats]
  );

  const averageScore =
    quizStats.totalGames > 0
      ? (quizStats.totalScore / quizStats.totalRounds).toFixed(1)
      : "0";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/progress.png")}
          style={{
            height: 180,
            width: 200,
            bottom: 0,
            position: "absolute",
          }}
        />
      }
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}
          >
            Player Stats
          </ThemedText>
        </ThemedView>

        {/* Tic Tac Toe Stats */}
        <View style={styles.section}>
          <SectionTitle text="🎮 Tic Tac Toe" />
          {topPlayers.length > 0 ? (
            <>
              <View style={styles.statsGrid}>
                {topPlayers.map((player, index) => (
                  <StatCard
                    key={player.id}
                    label={`#${index + 1} ${player.name}`}
                    value={`${player.wins}W • ${player.draws}D`}
                  />
                ))}
              </View>
            </>
          ) : (
            <ThemedText style={styles.emptyText}>
              No games played yet
            </ThemedText>
          )}

          <View style={styles.statsGrid}>
            <StatCard label="Total Games" value={ticTacToeStats.totalGames} />
            <StatCard label="Total Draws" value={ticTacToeStats.totalDraws} />
          </View>

          {ticTacToeStats.totalGames > 0 && (
            <Button
              title="Reset Tic Tac Toe Stats"
              onPress={resetTicTacToeStats}
              variant="outlined"
            />
          )}
        </View>

        {(quizStats.totalGames > 0 || ticTacToeStats.totalGames > 0) && (
          <Button title="Reset All Stats" onPress={resetAllStats} />
        )}

        {/* Quiz Stats */}
        <View style={styles.section}>
          <SectionTitle text="🧠 Country Quiz" />
          <View style={styles.statsGrid}>
            <StatCard label="Total Games" value={quizStats.totalGames} />
            <StatCard label="Total Score" value={quizStats.totalScore} />
            <StatCard label="Best Streak" value={quizStats.bestStreak} />
            <StatCard label="Avg Score / Round" value={averageScore} />
          </View>

          <View style={styles.subsection}>
            <ThemedText style={styles.subsectionTitle}>Flag Guesser</ThemedText>
            <View style={styles.statsGrid}>
              <StatCard label="Games" value={quizStats.flagGames} />
              <StatCard label="Best Score" value={quizStats.flagBestScore} />
              <StatCard label="Best Streak" value={quizStats.flagBestStreak} />
            </View>
          </View>

          <View style={styles.subsection}>
            <ThemedText style={styles.subsectionTitle}>
              Fill in the Blanks
            </ThemedText>
            <View style={styles.statsGrid}>
              <StatCard label="Games" value={quizStats.fillGames} />
              <StatCard label="Best Score" value={quizStats.fillBestScore} />
              <StatCard label="Best Streak" value={quizStats.fillBestStreak} />
            </View>
          </View>

          {quizStats.totalGames > 0 && (
            <Button
              title="Reset Quiz Stats"
              onPress={resetQuizStats}
              variant="outlined"
            />
          )}
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 40,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 30,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  subsection: {
    gap: 12,
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
  },
  emptyText: {
    opacity: 0.6,
    fontStyle: "italic",
    padding: 16,
  },
});
