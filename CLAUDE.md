# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

Build output goes to `dist/`. Base path is `/valentine-puzzles/` for GitHub Pages. Deployment via GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `master`.

## Architecture

This is a Valentine's Day puzzle countdown SPA — 7 puzzles with sequential unlocking (each unlocks 24hrs after solving the previous one; puzzle 1 is always available), each with a unique theme and revealing a clue leading to a final destination reveal. Built with React 19, TypeScript 5.9 (strict mode), Vite 7, Tailwind CSS 4, Framer Motion, and @dnd-kit.

### Routing

HashRouter with three routes: `/` (HomePage — puzzle grid), `/puzzle/:id` (PuzzlePage — renders specific puzzle), `/final` (FinalRevealPage — all clues assembled).

### Puzzle System

All 7 puzzles are configured in `src/config/puzzles.ts` as `PuzzleConfig` objects. Clue strings are base64-encoded via `btoa()` to prevent casual spoilers. Each puzzle has a `theme` field for its unique visual identity.

**Puzzle Themes:**
1. Horses — `HorsesPuzzle` (breed matching)
2. K-Pop Demon Hunter — `KpopDemonPuzzle` (Simon Says sequence memory)
3. Katseye — `KatseyePuzzle` (word scramble)
4. Bridgerton — `BridgertonPuzzle` (Lady Whistledown cipher)
5. WALL·E — `WallePuzzle` (item sorting into categories)
6. Hamburg / Green Day — `GreenDayPuzzle` (trivia quiz)
7. London — `LondonPuzzle` (city maze navigation)

Every puzzle component follows the same interface:
```typescript
{ onSolve: () => void; isSolved: boolean }
```

`PuzzlePage` maps `puzzle.type` to the correct component, wraps it in `PuzzleShell` (shared layout with back button, title, clue reveal), and handles the solve flow: component calls `onSolve()` → progress saved to localStorage → confetti fires → clue revealed.

### State & Persistence

No global state library. Progress is stored in localStorage under `valentine-progress` as `{ solved: number[], clues: Record<number, string>, solvedAt: Record<number, number> }`. The `useProgress` hook wraps this with React state. `usePuzzleUnlock` handles sequential locking (24hr delay after solving previous puzzle) with a 1-second countdown interval.

### Key Constants

`src/config/constants.ts` contains `DEV_MODE` (set `true` to bypass sequential locks — currently enabled), `HER_NAME` ("Julie"), `LOCATION` ("Dronningens gate 25"), `TOTAL_PUZZLES` (7), `UNLOCK_DELAY_MS` (24hrs), and `VALENTINES_DAY`.

### Styling

Tailwind v4 via Vite plugin (no tailwind.config needed). Custom CSS classes in `src/index.css`: `.glass-card` (frosted glass with gradient + inner glow), `.romantic-gradient-text`, `.gold-glow`, `.animate-heartbeat`, `.animate-float`, `.animate-pulse-slow`, `.shimmer-border`. Animated background gradient on body. Theme glow CSS custom properties per puzzle theme. Three font families: Playfair Display (headings), Lato (body), Dancing Script (`.font-accent`).

## Key Patterns

- Puzzle validation logic lives inside each puzzle component, not in `src/utils/puzzleValidation.ts` (which has stubs only)
- Type-only imports required (`import type { ... }`) due to `verbatimModuleSyntax` in tsconfig
- Framer Motion `ease` values must use `as const` to satisfy the `Easing` type
- The maze in `LondonPuzzle.tsx` is a hand-designed 2D array — verify path connectivity if modifying
