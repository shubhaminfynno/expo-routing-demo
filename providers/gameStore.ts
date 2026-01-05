import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Player, SquareValue } from '../types';

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      history: [Array(9).fill(null)],
      xIsNext: true,
      players: [],
      activePlayers: [],
      isComputerMode: false,
      difficulty: 'medium' as const,
      computerStartsFirst: false,

      setHistory: next => set({ history: next }),
      setXIsNext: next => set({ xIsNext: next }),

      addPlayer: name => {
        const newPlayer: Player = {
          id: Math.random().toFixed(4),
          name,
          wins: 0,
        };
        set(state => ({ players: [...state.players, newPlayer] }));
      },
      addPlayersAndStart: (
        p1: string,
        p2: string,
        isComputer = false,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium',
        computerStartsFirst = false,
      ) => {
        const id1 = Date.now().toString();
        const id2 = (Date.now() + 1).toString();
        const newPlayers = [
          { id: id1, name: p1, wins: 0 },
          { id: id2, name: p2, wins: 0 },
        ];

        set(state => ({
          players: [...state.players, ...newPlayers],
          activePlayers: [id1, id2],
          history: [Array(9).fill(null)],
          xIsNext: computerStartsFirst ? false : true,
          isComputerMode: isComputer,
          difficulty,
          computerStartsFirst,
        }));
      },

      setActivePlayers: ids => {
        set({
          activePlayers: ids,
          history: [Array(9).fill(null) as SquareValue[]],
          xIsNext: true,
        });
      },

      addWin: id => {
        set(state => ({
          players: state.players.map(p =>
            p.id === id ? { ...p, wins: p.wins + 1 } : p,
          ),
        }));
      },

      resetStats: () =>
        set({
          history: [Array(9).fill(null)],
          xIsNext: true,
          players: [],
          activePlayers: [],
          isComputerMode: false,
          difficulty: 'medium' as const,
          computerStartsFirst: false,
        }),

      restartGame: () =>
        set(state => ({
          history: [Array(9).fill(null)],
          xIsNext: state.computerStartsFirst ? false : true,
        })),

      undoMove: () =>
        set(state => {
          if (state.history.length > 1) {
            return {
              history: state.history.slice(0, -1),
              xIsNext: !state.xIsNext,
            };
          }
          return state;
        }),

      newGame: () =>
        set({
          history: [Array(9).fill(null)],
          xIsNext: true,
          activePlayers: [],
          isComputerMode: false,
          difficulty: 'medium' as const,
          computerStartsFirst: false,
        }),
    }),
    { name: 'tic-tac-toe-store' },
  ),
);

export default useGameStore;
