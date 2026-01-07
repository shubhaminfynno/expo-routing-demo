import Button from "@/components/button/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import useStatsStore from "@/providers/statsStore";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, View } from "react-native";

const StatCard = ({ label, value }: { label: string; value: string }) => {
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{label}</ThemedText>
      <ThemedText style={{ fontSize: 20, fontWeight: "600", marginTop: 4 }}>
        {value}
      </ThemedText>
    </View>
  );
};

const GameHubScreen = () => {
  const router = useRouter();
  const quizStats = useStatsStore((state) => state.quizStats);
  const ticTacToeStats = useStatsStore((state) => state.ticTacToeStats);

  const bestQuizScore = Math.max(
    quizStats.flagBestScore,
    quizStats.fillBestScore
  );
  const topPlayer = useMemo(() => {
    const players = Object.values(ticTacToeStats.playerStats);
    if (!players.length) return null;
    return [...players].sort((a, b) => b.wins - a.wins)[0];
  }, [ticTacToeStats.playerStats]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/game.png")}
          style={{
            height: 178,
            width: 290,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <View style={{ marginTop: 40, gap: 20 }}>
        <ThemedText type="title">Choose a Game</ThemedText>

        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <StatCard
            label="Tic Tac Toe Games"
            value={`${ticTacToeStats.totalGames}`}
          />
          <StatCard
            label="Top Player"
            value={
              topPlayer
                ? `${topPlayer.name} (${topPlayer.wins}W)`
                : "No games yet"
            }
          />
          <StatCard label="Best Quiz Score" value={`${bestQuizScore}`} />
        </View>

        <Button
          title="🎯 Tic Tac Toe"
          onPress={() => router.push("/tictactoe")}
        />

        <Button
          title="🧠 Country Quiz"
          onPress={() => router.push("/countryQuiz")}
        />
      </View>
    </ParallaxScrollView>
  );
};

export default GameHubScreen;
