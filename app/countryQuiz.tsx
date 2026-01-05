import Button from "@/components/button/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useCountries } from "@/hooks/queryHooks/useCountries";
import useStatsStore from "@/providers/statsStore";
import { styles } from "@/styles/GameStyles";
import { GlobalStyles } from "@/styles/globalStyles";
import type {
  ButtonProps,
  Country,
  FillQuestion,
  FlagQuestion,
  QuizMode,
} from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, TextInput, View } from "react-native";

const TOTAL_ROUNDS = 8;

const HEADER_IMAGE = (
  <Image
    source={require("@/assets/images/globe.png")}
    style={{
      height: 178,
      width: 220,
      bottom: 0,
      right: 0,
      position: "absolute",
    }}
  />
);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ParallaxScrollView
    headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    headerImage={HEADER_IMAGE}
  >
    {children}
  </ParallaxScrollView>
);

const Title = ({ text }: { text: string }) => (
  <ThemedText type="title">{text}</ThemedText>
);

const Subtitle = ({ text }: { text: string }) => (
  <ThemedText type="subtitle">{text}</ThemedText>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.1)",
    }}
  >
    <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{label}</ThemedText>
    <ThemedText style={[GlobalStyles.mdSemibold, { marginTop: 4 }]}>
      {value}
    </ThemedText>
  </View>
);

const shuffle = <T,>(items: T[]) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const maskCountryName = (name: string) => {
  if (name.length < 3) return name;

  const chars = name.split("");
  const toHide = Math.min(
    Math.max(2, Math.floor(name.replace(/\s/g, "").length / 2)),
    name.length - 1
  );
  const hiddenIndexes = new Set<number>();

  while (hiddenIndexes.size < toHide) {
    const index = Math.floor(Math.random() * chars.length);
    if (chars[index] === " ") continue;
    hiddenIndexes.add(index);
  }

  return chars
    .map((char, index) => (hiddenIndexes.has(index) ? "_" : char))
    .join("");
};

const CountryQuiz = () => {
  const { data, isLoading, error, refetch, isFetching } = useCountries();
  const recordQuizResult = useStatsStore((state) => state.recordQuizResult);
  const quizStats = useStatsStore((state) => state.quizStats);

  const countries = useMemo(() => {
    const dataset = (data ?? []) as Country[];
    return dataset.filter(
      (country) => country.name && country.emoji && country.code
    );
  }, [data]);

  const [mode, setMode] = useState<QuizMode>("menu");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [flagQuestion, setFlagQuestion] = useState<FlagQuestion | null>(null);
  const [fillQuestion, setFillQuestion] = useState<FillQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"correct" | "wrong" | null>(
    null
  );
  const [questionResolved, setQuestionResolved] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  const canQuizStart = countries.length >= 4;

  const quizModeStats = useMemo(
    () =>
      mode === "flag"
        ? {
            games: quizStats.flagGames,
            bestScore: quizStats.flagBestScore,
            bestStreak: quizStats.flagBestStreak,
          }
        : {
            games: quizStats.fillGames,
            bestScore: quizStats.fillBestScore,
            bestStreak: quizStats.fillBestStreak,
          },
    [
      mode,
      quizStats.flagGames,
      quizStats.flagBestScore,
      quizStats.flagBestStreak,
      quizStats.fillGames,
      quizStats.fillBestScore,
      quizStats.fillBestStreak,
    ]
  );

  const buildFlagQuestion = useCallback((): FlagQuestion | null => {
    if (!canQuizStart) return null;
    const answer =
      countries[Math.floor(Math.random() * countries.length)] ?? null;

    if (!answer) return null;

    const distractors = shuffle(
      countries.filter((country) => country.code !== answer.code)
    ).slice(0, 3);

    return {
      answer,
      options: shuffle([answer, ...distractors]),
    };
  }, [countries, canQuizStart]);

  const buildFillQuestion = useCallback((): FillQuestion | null => {
    if (!countries.length) return null;
    const answer =
      countries[Math.floor(Math.random() * countries.length)] ?? null;
    if (!answer) return null;

    return {
      answer,
      masked: maskCountryName(answer.name),
      hint:
        answer.capital ||
        answer.continent?.name ||
        "Think of a well-known country!",
    };
  }, [countries]);

  const resetQuizState = useCallback(() => {
    setScore(0);
    setRound(0);
    setStreak(0);
    setBestStreak(0);
    setFlagQuestion(null);
    setFillQuestion(null);
    setSelectedOption(null);
    setFillAnswer("");
    setFeedback(null);
    setFeedbackTone(null);
    setQuestionResolved(false);
    setFinished(false);
    setStatsSaved(false);
  }, []);

  const registerAnswer = useCallback((correct: boolean, message: string) => {
    setFeedback(message);
    setFeedbackTone(correct ? "correct" : "wrong");
    setQuestionResolved(true);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }, []);

  const startQuiz = useCallback(
    (nextMode: QuizMode) => {
      if (nextMode === "menu") {
        resetQuizState();
        setMode("menu");
        return;
      }

      if (!canQuizStart) return;

      resetQuizState();
      setMode(nextMode);
      setRound(1);

      if (nextMode === "flag") {
        const question = buildFlagQuestion();
        if (question) {
          setFlagQuestion(question);
        }
      } else {
        const question = buildFillQuestion();
        if (question) {
          setFillQuestion(question);
        }
      }
    },
    [buildFillQuestion, buildFlagQuestion, canQuizStart, resetQuizState]
  );

  const handleFlagGuess = (countryCode: string) => {
    if (!flagQuestion || questionResolved) return;
    setSelectedOption(countryCode);

    const correct = countryCode === flagQuestion.answer.code;
    registerAnswer(
      correct,
      correct
        ? "You nailed that flag!"
        : `That was ${flagQuestion.answer.name}.`
    );
  };

  const handleFillCheck = () => {
    if (!fillQuestion || questionResolved) return;
    const guess = fillAnswer.trim();
    if (!guess) return;

    const correct =
      guess.toLowerCase() === fillQuestion.answer.name.toLowerCase();

    registerAnswer(
      correct,
      correct ? "Perfect spelling!" : `It was ${fillQuestion.answer.name}.`
    );
  };

  useEffect(() => {
    if (isFinished && !statsSaved && mode !== "menu") {
      recordQuizResult(
        mode === "flag" ? "flag" : "fill",
        score,
        round,
        bestStreak
      );
      setStatsSaved(true);
    }
  }, [
    isFinished,
    statsSaved,
    mode,
    score,
    round,
    bestStreak,
    recordQuizResult,
  ]);

  const handleNextQuestion = () => {
    if (!questionResolved) return;

    if (round >= TOTAL_ROUNDS) {
      setFinished(true);
      return;
    }

    setRound((prev) => prev + 1);
    setQuestionResolved(false);
    setFeedback(null);
    setFeedbackTone(null);
    setSelectedOption(null);
    setFillAnswer("");

    if (mode === "flag") {
      const question = buildFlagQuestion();
      if (question) {
        setFlagQuestion(question);
      }
    } else if (mode === "fill") {
      const question = buildFillQuestion();
      if (question) {
        setFillQuestion(question);
      }
    }
  };

  const renderLoader = () => (
    <Wrapper>
      <View style={{ marginTop: 60 }}>
        <ActivityIndicator size="large" />
      </View>
    </Wrapper>
  );

  const renderError = () => (
    <Wrapper>
      <View style={{ marginTop: 60, gap: 16 }}>
        <Title text="Something went wrong" />
        <Subtitle text="Unable to load countries. Try again?" />
        <Button
          title={isFetching ? "Retrying..." : "Retry"}
          onPress={refetch}
          isLoading={isFetching}
        />
      </View>
    </Wrapper>
  );

  const renderSummary = () => (
    <View style={{ gap: 16, marginTop: 30 }}>
      <Title text="Quiz Complete!" />
      <Subtitle text="Ready for another round?" />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard label="Score" value={`${score}/${TOTAL_ROUNDS}`} />
        <StatCard label="Best Streak" value={`${bestStreak}`} />
      </View>

      <Button title="Replay Same Mode" onPress={() => startQuiz(mode)} />
      <Button
        title="Choose Another Quiz"
        variant="outlined"
        onPress={() => startQuiz("menu")}
      />
    </View>
  );

  const renderMenu = () => (
    <Wrapper>
      <View style={{ marginTop: 30, gap: 20 }}>
        <Title text="Country Quiz Arcade" />
        <Subtitle text="Pick a challenge to begin" />

        <Button
          title="🌍 Flag Guesser"
          onPress={() => startQuiz("flag")}
          disabled={!canQuizStart}
        />
        <Button
          title="✍️ Fill in the Blanks"
          onPress={() => startQuiz("fill")}
          variant="secondary"
          disabled={!canQuizStart}
        />

        {!canQuizStart && (
          <ThemedText style={{ opacity: 0.7 }}>
            Need at least 4 countries to start.
          </ThemedText>
        )}
      </View>
    </Wrapper>
  );

  const renderStatsRow = () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <StatCard label="Round" value={`${round}/${TOTAL_ROUNDS}`} />
      <StatCard label="Score" value={`${score}`} />
      <StatCard label="Streak" value={`${streak}`} />
    </View>
  );

  const renderPersistentSummary = () => (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
      }}
    >
      <StatCard label="Games Played" value={`${quizModeStats.games}`} />
      <StatCard label="Best Score" value={`${quizModeStats.bestScore}`} />
      <StatCard label="Best Streak" value={`${quizModeStats.bestStreak}`} />
    </View>
  );

  const renderFeedback = () =>
    feedback ? (
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor:
            feedbackTone === "correct"
              ? "rgba(34,197,94,0.12)"
              : "rgba(248,113,113,0.12)",
        }}
      >
        <ThemedText style={[GlobalStyles.mdSemibold]}>{feedback}</ThemedText>
      </View>
    ) : null;

  const renderFlagQuiz = () => (
    <View style={{ gap: 20, marginTop: 30 }}>
      <Title text="Flag Guesser" />
      <Subtitle text="Match the flag to the country" />
      {renderStatsRow()}
      {renderPersistentSummary()}

      {flagQuestion ? (
        <>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 24,
              borderWidth: 1,
              borderRadius: 16,
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            <ThemedText style={{ paddingTop: 60, fontSize: 72 }}>
              {flagQuestion.answer.emoji}
            </ThemedText>
          </View>

          <View style={{ gap: 12 }}>
            {flagQuestion.options.map((option) => {
              const variant: ButtonProps["variant"] = !questionResolved
                ? "outlined"
                : option.code === flagQuestion.answer.code
                ? "primary"
                : option.code === selectedOption
                ? "danger"
                : "outlined";

              return (
                <Button
                  key={option.code}
                  title={option.name}
                  onPress={() => handleFlagGuess(option.code)}
                  disabled={questionResolved}
                  variant={variant}
                />
              );
            })}
          </View>

          {renderFeedback()}

          <View style={{ gap: 12 }}>
            <Button
              title={round >= TOTAL_ROUNDS ? "See Results" : "Next Question"}
              onPress={handleNextQuestion}
              disabled={!questionResolved}
            />
            <Button
              title="Quit"
              variant="outlined"
              onPress={() => startQuiz("menu")}
            />
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );

  const renderFillQuiz = () => (
    <View style={{ gap: 20, marginTop: 30 }}>
      <Title text="Fill in the Blanks" />
      <Subtitle text="Complete the country name" />
      {renderStatsRow()}
      {renderPersistentSummary()}

      {fillQuestion ? (
        <>
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
              gap: 12,
            }}
          >
            <ThemedText style={[GlobalStyles.mdSemibold, { letterSpacing: 4 }]}>
              {fillQuestion.masked}
            </ThemedText>
            <ThemedText style={{ opacity: 0.7, fontSize: 14 }}>
              Hint: {fillQuestion.hint}
            </ThemedText>
          </View>

          <TextInput
            value={fillAnswer}
            onChangeText={setFillAnswer}
            placeholder="Type the country name"
            autoCapitalize="words"
            style={[styles.input, GlobalStyles.p16]}
            editable={!questionResolved}
          />

          <Button
            title="Check Answer"
            onPress={handleFillCheck}
            disabled={questionResolved}
          />

          {renderFeedback()}

          <View style={{ gap: 12 }}>
            <Button
              title={round >= TOTAL_ROUNDS ? "See Results" : "Next Question"}
              onPress={handleNextQuestion}
              disabled={!questionResolved}
            />
            <Button
              title="Quit"
              variant="outlined"
              onPress={() => startQuiz("menu")}
            />
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );

  if (isLoading) return renderLoader();
  if (error) return renderError();
  if (mode === "menu") return renderMenu();

  return (
    <Wrapper>
      {isFinished
        ? renderSummary()
        : mode === "flag"
        ? renderFlagQuiz()
        : renderFillQuiz()}
    </Wrapper>
  );
};

export default CountryQuiz;
