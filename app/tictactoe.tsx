import Box from "@/components/box/Box";
import Button from "@/components/button/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import {
  calculateStatus,
  calculateTurns,
  calculateWinner,
  getComputerMove,
} from "@/helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import useGameStore from "@/providers/gameStore";
import useStatsStore from "@/providers/statsStore";
import { GlobalStyles } from "@/styles/globalStyles";
import { SquareValue } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, TextInput, View } from "react-native";
import { styles } from "../styles/GameStyles";

const HEADER_IMAGE = (
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
);

const Wrapper = React.memo(({ children }: { children: React.ReactNode }) => (
  <ParallaxScrollView
    headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    headerImage={HEADER_IMAGE}
  >
    {children}
  </ParallaxScrollView>
));

const Title = ({ text }: { text: string }) => (
  <ThemedText type="title">{text}</ThemedText>
);

const CenterText = ({ text }: { text: string }) => (
  <ThemedText type="subtitle">{text}</ThemedText>
);

const SelectMode = ({ onSelect }: any) => (
  <View style={{ gap: 16, marginTop: 30 }}>
    <Title text="TIC TAC TOE" />
    <CenterText text="Choose Game Mode" />
    <Button title="Player vs Player" onPress={() => onSelect("player")} />
    <Button
      title="Player vs Computer"
      onPress={() => onSelect("computer")}
      variant="secondary"
    />
  </View>
);

const SelectDifficulty = ({ selected, onSelectDiff, goBack }: any) => (
  <View style={{ gap: 16, marginTop: 30 }}>
    <Title text="TIC TAC TOE" />
    <CenterText text="Choose Difficulty" />

    {["easy", "medium", "hard"].map((d) => (
      <Button
        key={d}
        title={d.charAt(0).toUpperCase() + d.slice(1)}
        onPress={() => onSelectDiff(d)}
        variant={selected === d ? "primary" : "outlined"}
      />
    ))}

    <Button title="Back" onPress={goBack} variant="outlined" />
  </View>
);

const SelectStarter = ({ selected, onChoose, goBack }: any) => (
  <View style={{ gap: 16, marginTop: 30 }}>
    <Title text="TIC TAC TOE" />
    <CenterText text="Who Should Start?" />

    <Button
      title="I'll Start (X)"
      onPress={() => onChoose("player")}
      variant={selected === "player" ? "primary" : "outlined"}
    />
    <Button
      title="Computer Starts (X)"
      onPress={() => onChoose("computer")}
      variant={selected === "computer" ? "primary" : "outlined"}
    />

    <Button title="Back" onPress={goBack} variant="outlined" />
  </View>
);

const EnterPlayers = ({
  gameMode,
  p1,
  p2,
  setP1,
  setP2,
  onConfirm,
  goBack,
}: any) => {
  const color = useThemeColor({}, "text");

  return (
    <View style={{ gap: 16, marginTop: 30 }}>
      <Title text="TIC TAC TOE" />

      <CenterText
        text={
          gameMode === "computer" ? "Enter Your Name" : "Enter Player Names"
        }
      />

      <TextInput
        style={[styles.input, GlobalStyles.p16]}
        placeholder={gameMode === "computer" ? "Your Name" : "Player 1"}
        value={p1}
        onChangeText={setP1}
        placeholderTextColor={color}
      />

      {gameMode === "player" && (
        <TextInput
          style={[styles.input, GlobalStyles.p16]}
          placeholder="Player 2"
          value={p2}
          onChangeText={setP2}
          placeholderTextColor={color}
        />
      )}

      <Button
        title="Start Game"
        onPress={onConfirm}
        disabled={gameMode === "computer" ? !p1 : !p1 || !p2}
      />

      <Button title="Back" onPress={goBack} variant="outlined" />
    </View>
  );
};

const StatBadge = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
    }}
  >
    <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{label}</ThemedText>
    <ThemedText style={[GlobalStyles.mdSemibold, { marginTop: 4 }]}>
      {value}
    </ThemedText>
  </View>
);

const TicTacToe = () => {
  const {
    activePlayers,
    addWin,
    addPlayersAndStart,
    history,
    players,
    setHistory,
    xIsNext,
    setXIsNext,
    newGame,
    restartGame,
    undoMove,
    isComputerMode,
    difficulty,
    computerStartsFirst,
  } = useGameStore();
  const recordTicTacToeResult = useStatsStore(
    (state) => state.recordTicTacToeResult
  );
  const ticTacToeStats = useStatsStore((state) => state.ticTacToeStats);

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [gameMode, setGameMode] = useState<
    "select" | "player" | "computer" | "difficulty" | "starter"
  >("select");

  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");

  const [selectedStarter, setSelectedStarter] = useState<"player" | "computer">(
    "player"
  );

  const currentSquares = history[history.length - 1];
  const [resultRecorded, setResultRecorded] = useState(false);

  const turns = useMemo(
    () => calculateTurns(currentSquares as SquareValue[]),
    [currentSquares]
  );

  const currentMark = xIsNext ? "X" : "O";

  const { player: winnerMark, line } = useMemo(
    () => calculateWinner(currentSquares as SquareValue[]),
    [currentSquares]
  );

  const { status, gameStatus } = useMemo(
    () => calculateStatus(winnerMark, turns, currentMark),
    [winnerMark, turns, currentMark]
  );

  const playerX = players.find((p) => p.id === activePlayers[0]);
  const playerO = players.find((p) => p.id === activePlayers[1]);
  const playerXStats = playerX
    ? ticTacToeStats.playerStats[playerX.id]
    : undefined;
  const playerOStats = playerO
    ? ticTacToeStats.playerStats[playerO.id]
    : undefined;

  useEffect(() => {
    if (gameStatus === 3 && winnerMark) {
      const winnerId = winnerMark === "X" ? activePlayers[0] : activePlayers[1];
      addWin(winnerId);
    }
  }, [gameStatus, winnerMark]);

  useEffect(() => {
    if (
      gameStatus === 3 &&
      !resultRecorded &&
      activePlayers.length === 2 &&
      playerX &&
      playerO
    ) {
      recordTicTacToeResult({
        winner: winnerMark,
        playerX: { id: playerX.id, name: playerX.name },
        playerO: { id: playerO.id, name: playerO.name },
      });
      setResultRecorded(true);
    }
  }, [
    gameStatus,
    resultRecorded,
    recordTicTacToeResult,
    winnerMark,
    playerX,
    playerO,
    activePlayers.length,
  ]);

  useEffect(() => {
    if (history.length === 1 && resultRecorded) {
      setResultRecorded(false);
    }
  }, [history.length, resultRecorded]);

  useEffect(() => {
    const isComputerTurn =
      isComputerMode &&
      ((computerStartsFirst && xIsNext) || (!computerStartsFirst && !xIsNext));

    if (!isComputerTurn || gameStatus !== 1 || turns >= 9) return;

    const timer = setTimeout(() => {
      const move = getComputerMove(currentSquares as SquareValue[], difficulty);
      if (move !== undefined && move !== -1) {
        const next = [...currentSquares] as SquareValue[];
        next[move] = computerStartsFirst ? "X" : "O";
        setHistory([...history, next]);
        setXIsNext(!xIsNext);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [
    isComputerMode,
    xIsNext,
    gameStatus,
    turns,
    currentSquares,
    history,
    difficulty,
    computerStartsFirst,
  ]);

  const handlePlay = useCallback(
    (i: number) => {
      const isBlocked =
        currentSquares[i] ||
        winnerMark ||
        (isComputerMode &&
          ((computerStartsFirst && xIsNext) ||
            (!computerStartsFirst && !xIsNext)));

      if (isBlocked) return;

      const next = [...currentSquares] as SquareValue[];
      next[i] = currentMark;

      setHistory([...history, next]);
      setXIsNext(!xIsNext);
    },
    [
      currentSquares,
      winnerMark,
      computerStartsFirst,
      xIsNext,
      isComputerMode,
      currentMark,
      history,
    ]
  );

  const onSelectGameMode = (mode: "player" | "computer") =>
    setGameMode(mode === "computer" ? "difficulty" : mode);

  const onSelectDifficulty = (diff: any) => {
    setSelectedDifficulty(diff);
    setGameMode("starter");
  };

  const onSelectStarter = (starter: any) => {
    setSelectedStarter(starter);
    setGameMode("computer");
  };

  const onConfirmPlayers = () => {
    if (gameMode === "computer") {
      addPlayersAndStart(
        p1,
        "Computer",
        true,
        selectedDifficulty,
        selectedStarter === "computer"
      );
    } else {
      addPlayersAndStart(p1, p2, false);
    }
  };

  const onNewGame = () => {
    setP1("");
    setP2("");
    setSelectedStarter("player");
    setSelectedDifficulty("medium");
    setGameMode("select");
    newGame();
  };

  if (activePlayers.length < 2) {
    return (
      <Wrapper>
        {gameMode === "select" && <SelectMode onSelect={onSelectGameMode} />}

        {gameMode === "difficulty" && (
          <SelectDifficulty
            selected={selectedDifficulty}
            onSelectDiff={onSelectDifficulty}
            goBack={() => setGameMode("select")}
          />
        )}

        {gameMode === "starter" && (
          <SelectStarter
            selected={selectedStarter}
            onChoose={onSelectStarter}
            goBack={() => setGameMode("difficulty")}
          />
        )}

        {["player", "computer"].includes(gameMode) && (
          <EnterPlayers
            gameMode={gameMode}
            p1={p1}
            p2={p2}
            setP1={setP1}
            setP2={setP2}
            onConfirm={onConfirmPlayers}
            goBack={() => setGameMode("select")}
          />
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={GlobalStyles.flexGrow}>
        <Title text="TIC TAC TOE" />

        <CenterText text={`${playerX?.name} (X) vs ${playerO?.name} (O)`} />

        <ThemedText style={[GlobalStyles.mdSemibold, GlobalStyles.pv16]}>
          {isComputerMode &&
          ((computerStartsFirst && xIsNext) ||
            (!computerStartsFirst && !xIsNext)) &&
          gameStatus === 1
            ? "Computer is thinking..."
            : status}
        </ThemedText>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <StatBadge
            label={`${playerX?.name ?? "Player X"} Wins`}
            value={playerXStats?.wins ?? 0}
          />
          <StatBadge
            label={`${playerO?.name ?? "Player O"} Wins`}
            value={playerOStats?.wins ?? 0}
          />
          <StatBadge label="Draws" value={ticTacToeStats.totalDraws} />
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentSquares.map((sq, i) => (
            <Box
              key={i}
              value={sq}
              onPress={() => handlePlay(i)}
              isWinning={line?.includes(i)}
            />
          ))}
        </View>

        <View style={{ gap: 16, marginTop: 16 }}>
          <Button title="New Game" onPress={onNewGame} />
          <Button
            title={gameStatus === 3 ? "Rematch" : "Restart Game"}
            onPress={restartGame}
            disabled={history.length <= 1}
          />
          <Button
            title="Undo"
            onPress={undoMove}
            disabled={
              history.length <= 1 ||
              gameStatus === 3 ||
              (isComputerMode &&
                ((computerStartsFirst && xIsNext) ||
                  (!computerStartsFirst && !xIsNext)))
            }
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default TicTacToe;
