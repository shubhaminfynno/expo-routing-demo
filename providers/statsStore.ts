import {
  getItemFromStorage,
  removeItemFromStorage,
  setItemInStorage,
} from "@/helper";
import {
  QuizStats,
  StatsState,
  TicTacToeParticipant,
  TicTacToePlayerStats,
  TicTacToeStats,
} from "@/types";
import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

const createInitialQuizStats = (): QuizStats => ({
  totalGames: 0,
  totalScore: 0,
  totalRounds: 0,
  bestStreak: 0,
  flagGames: 0,
  fillGames: 0,
  flagBestScore: 0,
  fillBestScore: 0,
  flagBestStreak: 0,
  fillBestStreak: 0,
});

const createInitialTicTacToeStats = (): TicTacToeStats => ({
  totalGames: 0,
  totalDraws: 0,
  playerStats: {},
});

const ensurePlayerStats = (
  player: TicTacToeParticipant,
  stats: TicTacToeStats
): TicTacToePlayerStats => {
  const existing = stats.playerStats[player.id];
  if (existing) return existing;

  const fresh: TicTacToePlayerStats = {
    id: player.id,
    name: player.name,
    wins: 0,
    losses: 0,
    draws: 0,
    games: 0,
  };
  stats.playerStats[player.id] = fresh;
  return fresh;
};

const helperStorage: StateStorage = {
  getItem: async (name: string) => {
    const storedValue = await getItemFromStorage(name);
    return storedValue ? JSON.stringify(storedValue) : null;
  },
  setItem: async (name: string, value: string) => {
    await setItemInStorage(name, JSON.parse(value));
  },
  removeItem: async (name: string) => {
    await removeItemFromStorage(name);
  },
};

const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      quizStats: createInitialQuizStats(),
      ticTacToeStats: createInitialTicTacToeStats(),

      recordQuizResult: (mode, score, rounds, bestStreak) =>
        set((state) => {
          const quizStats = { ...state.quizStats };

          quizStats.totalGames += 1;
          quizStats.totalScore += score;
          quizStats.totalRounds += rounds;
          quizStats.bestStreak = Math.max(quizStats.bestStreak, bestStreak);

          if (mode === "flag") {
            quizStats.flagGames += 1;
            quizStats.flagBestScore = Math.max(quizStats.flagBestScore, score);
            quizStats.flagBestStreak = Math.max(
              quizStats.flagBestStreak,
              bestStreak
            );
          } else {
            quizStats.fillGames += 1;
            quizStats.fillBestScore = Math.max(quizStats.fillBestScore, score);
            quizStats.fillBestStreak = Math.max(
              quizStats.fillBestStreak,
              bestStreak
            );
          }

          return { quizStats };
        }),

      recordTicTacToeResult: ({ winner, playerX, playerO }) =>
        set((state) => {
          const ticTacToeStats: TicTacToeStats = {
            ...state.ticTacToeStats,
            playerStats: { ...state.ticTacToeStats.playerStats },
          };

          ticTacToeStats.totalGames += 1;

          const xStats = ensurePlayerStats(playerX, ticTacToeStats);
          const oStats = ensurePlayerStats(playerO, ticTacToeStats);

          xStats.games += 1;
          oStats.games += 1;

          if (winner === "X") {
            xStats.wins += 1;
            oStats.losses += 1;
          } else if (winner === "O") {
            oStats.wins += 1;
            xStats.losses += 1;
          } else {
            ticTacToeStats.totalDraws += 1;
            xStats.draws += 1;
            oStats.draws += 1;
          }

          return { ticTacToeStats };
        }),

      resetQuizStats: () =>
        set({
          quizStats: createInitialQuizStats(),
        }),
      resetTicTacToeStats: () =>
        set({
          ticTacToeStats: createInitialTicTacToeStats(),
        }),
      resetAllStats: () =>
        set({
          quizStats: createInitialQuizStats(),
          ticTacToeStats: createInitialTicTacToeStats(),
        }),
    }),
    {
      name: "game-stats-store",
      storage: createJSONStorage(() => helperStorage),
      version: 1,
    }
  )
);

export default useStatsStore;
