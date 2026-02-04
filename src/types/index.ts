export interface PuzzleConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  unlockDate: string; // YYYY-MM-DD
  type: PuzzleType;
  clue: string; // base64-encoded clue text
  icon: string;
}

export type PuzzleType =
  | 'cipher'
  | 'riddle'
  | 'wordsearch'
  | 'memory'
  | 'sudoku'
  | 'crossword'
  | 'maze'
  | 'anagram'
  | 'trivia'
  | 'jigsaw';

export interface Progress {
  solved: number[]; // puzzle IDs that have been solved
  clues: Record<number, string>; // puzzle ID -> revealed clue text
}
