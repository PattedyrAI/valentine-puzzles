export interface PuzzleConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  unlockDate: string; // YYYY-MM-DD
  type: PuzzleType;
  clue: string; // base64-encoded clue text
  icon: string;
  theme: string; // theme color/label for the puzzle
}

export type PuzzleType =
  | 'horses_match'
  | 'kpop_sequence'
  | 'katseye_scramble'
  | 'bridgerton_cipher'
  | 'walle_sort'
  | 'greenday_trivia'
  | 'london_maze';

export interface Progress {
  solved: number[]; // puzzle IDs that have been solved
  clues: Record<number, string>; // puzzle ID -> revealed clue text
}
