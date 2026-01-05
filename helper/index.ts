import AsyncStorage from "@react-native-async-storage/async-storage";
import { SquareValue, User, WinnerResult } from "../types";

const calculateWinner = (squares: SquareValue[]): WinnerResult => {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: lines[i] };
    }
  }

  return { player: null, line: null };
};

const calculateTurns = (squares: SquareValue[]): number => {
  return squares.filter((square) => square !== null).length;
};

const calculateStatus = (
  winner: SquareValue,
  turns: number,
  player: "X" | "O"
): {
  gameStatus: number;
  status: string;
} => {
  if (winner) return { gameStatus: 3, status: `Winner ${winner}` };
  if (!winner && turns === 9)
    return {
      gameStatus: 3,
      status: "Match Drawn",
    };
  return { gameStatus: 1, status: `Next player: ${player}` };
};

const minimax = (
  squares: SquareValue[],
  depth: number,
  isMaximizing: boolean
): number => {
  const winner = calculateWinner(squares);

  if (winner.player === "O") return 10 - depth;
  if (winner.player === "X") return depth - 10;
  if (calculateTurns(squares) === 9) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newSquares = [...squares];
        newSquares[i] = "O";
        const score = minimax(newSquares, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newSquares = [...squares];
        newSquares[i] = "X";
        const score = minimax(newSquares, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getRandomMove = (squares: SquareValue[]): number => {
  const availableSpots = squares
    .map((square, index) => (square === null ? index : null))
    .filter((spot) => spot !== null) as number[];

  return availableSpots[Math.floor(Math.random() * availableSpots.length)];
};

const getEasyMove = (squares: SquareValue[]): number => {
  // 70% random, 30% smart
  if (Math.random() < 0.7) {
    return getRandomMove(squares);
  }
  return getMediumMove(squares);
};

const getMediumMove = (squares: SquareValue[]): number => {
  // Check if computer can win
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const testSquares = [...squares];
      testSquares[i] = "O";
      if (calculateWinner(testSquares).player === "O") {
        return i;
      }
    }
  }

  // Check if computer needs to block player from winning
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const testSquares = [...squares];
      testSquares[i] = "X";
      if (calculateWinner(testSquares).player === "X") {
        return i;
      }
    }
  }

  // Take center if available
  if (!squares[4]) {
    return 4;
  }

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => !squares[i]);
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  // Take any available spot
  return getRandomMove(squares);
};

const getHardMove = (squares: SquareValue[]): number => {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = [...squares];
      newSquares[i] = "O";
      const score = minimax(newSquares, 0, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const getComputerMove = (
  squares: SquareValue[],
  difficulty: "easy" | "medium" | "hard"
): number => {
  switch (difficulty) {
    case "easy":
      return getEasyMove(squares);
    case "medium":
      return getMediumMove(squares);
    case "hard":
      return getHardMove(squares);
    default:
      return getMediumMove(squares);
  }
};

const setItemInStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log("Error saving data", error);
  }
};

const getItemFromStorage = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Error retrieving data", error);
    return null;
  }
};

const removeItemFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error removing data", error);
  }
};

const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing storage", error);
  }
};

const getUsers = async () => {
  try {
    return await getItemFromStorage("users");
  } catch (error) {
    console.log("error while fetching users", error);
  }
};

const getActiveUser = async (): Promise<User | undefined> => {
  try {
    return await getItemFromStorage("activeUser");
  } catch (error) {
    console.log("error while fetching users", error);
  }
};

export {
  calculateStatus,
  calculateTurns,
  calculateWinner,
  clearStorage,
  getActiveUser,
  getComputerMove,
  getItemFromStorage,
  getUsers,
  removeItemFromStorage,
  setItemInStorage,
};
