import { ReactElement } from "react";
import {
  ColorValue,
  DimensionValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type User = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isAuthenticated: boolean;
  isVerified: boolean;
};

export type ContainerProps = {
  containerStyles?: StyleProp<ViewStyle>;
  children: ReactElement;
  avoidKeyboard?: boolean;
};

export type ButtonProps = {
  loadingComponent?: () => ReactElement;
  customLabelContainerStyles?: StyleProp<ViewStyle>;
  customStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  title?: string | ReactElement;
  isLoading?: boolean;
  icon?: ReactElement;
  leftIcon?: ReactElement;
  buttonWidth?: DimensionValue;
  buttonHeight?: DimensionValue;
  textColor?: ColorValue;
  outlined?: boolean;
  numberOfLines?: number;
  borderColor?: ColorValue;
  isDebounce?: boolean;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger" | "outlined" | "secondary";
  loaderColor?: string;
};
export type BearStoreType = {
  totalBears: number;
  increasePopulation: () => void;
  decreasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
};

export type SquareValue = "X" | "O" | null;

export interface Player {
  id: string;
  name: string;
  wins: number;
}

export interface GameState {
  history: (string | null)[][];
  xIsNext: boolean;
  players: Player[];
  activePlayers: string[];
  isComputerMode: boolean;
  difficulty: "easy" | "medium" | "hard";
  computerStartsFirst: boolean;

  setHistory: (next: (string | null)[][]) => void;
  setXIsNext: (next: boolean) => void;

  addPlayer: (name: string) => void;
  setActivePlayers: (ids: string[]) => void;
  addWin: (id: string) => void;
  resetStats: () => void;
  addPlayersAndStart: (
    p1: string,
    p2: string,
    isComputer?: boolean,
    difficulty?: "easy" | "medium" | "hard",
    computerStartsFirst?: boolean
  ) => void;
  restartGame: () => void;
  undoMove: () => void;
  newGame: () => void;
}

export interface GameActions {
  setSquares: (
    next: SquareValue[] | ((prev: SquareValue[]) => SquareValue[])
  ) => void;
  setXIsNext: (next: boolean | ((prev: boolean) => boolean)) => void;
  setHistory: (
    next: SquareValue[][] | ((prev: SquareValue[][]) => SquareValue[][])
  ) => void;
  addWin: (winner: "X" | "O") => void;
  resetStats: () => void;
}

export interface WinnerResult {
  player: SquareValue;
  line: number[] | null;
}

export interface BoxProps {
  value: string | null;
  onPress: () => void;
  disabled?: boolean;
  isWinning?: boolean;
}

export interface GameProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}

export type QuizMode = "menu" | "flag" | "fill";

export type Country = {
  code: string;
  name: string;
  emoji: string;
  capital?: string | null;
  continent?: {
    name: string;
  } | null;
};

export type FlagQuestion = {
  answer: Country;
  options: Country[];
};

export type FillQuestion = {
  answer: Country;
  masked: string;
  hint: string;
};

export interface QuizStats {
  totalGames: number;
  totalScore: number;
  totalRounds: number;
  bestStreak: number;
  flagGames: number;
  fillGames: number;
  flagBestScore: number;
  fillBestScore: number;
  flagBestStreak: number;
  fillBestStreak: number;
}

export interface TicTacToePlayerStats {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  games: number;
}

export interface TicTacToeParticipant {
  id: string;
  name: string;
}

export interface TicTacToeStats {
  totalGames: number;
  totalDraws: number;
  playerStats: Record<string, TicTacToePlayerStats>;
}

export interface StatsState {
  quizStats: QuizStats;
  ticTacToeStats: TicTacToeStats;
  recordQuizResult: (
    mode: "flag" | "fill",
    score: number,
    rounds: number,
    bestStreak: number
  ) => void;
  recordTicTacToeResult: (payload: {
    winner: "X" | "O" | null;
    playerX: TicTacToeParticipant;
    playerO: TicTacToeParticipant;
  }) => void;
  resetQuizStats: () => void;
  resetTicTacToeStats: () => void;
  resetAllStats: () => void;
}

export type Anime = {
  id: number;
  title: {
    romaji?: string | null;
    english?: string | null;
  };
  coverImage?: {
    medium?: string | null;
  } | null;
};

export type LiveEvent = {
  id: string;
  message: string;
  createdAt: string;
};

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
