import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface JigsawPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

// Each tile id represents its correct position (0-15)
function createShuffledTiles(): number[] {
  const tiles = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  // Fisher-Yates shuffle, ensuring it's not already solved
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  // Check if accidentally solved
  if (tiles.every((t, i) => t === i)) {
    // Swap first two to break solution
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }
  return tiles;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((t, i) => t === i);
}

// Calculate the background position for a tile to show its piece of the heart gradient
function getTileBackground(tileId: number) {
  const row = Math.floor(tileId / GRID_SIZE);
  const col = tileId % GRID_SIZE;
  const xPercent = (col / (GRID_SIZE - 1)) * 100;
  const yPercent = (row / (GRID_SIZE - 1)) * 100;
  return {
    backgroundPosition: `${xPercent}% ${yPercent}%`,
  };
}

interface SortableTileProps {
  id: number;
  tileId: number;
  index: number;
  solved: boolean;
}

const SortableTile: React.FC<SortableTileProps> = ({ id, tileId, index, solved }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString(), disabled: solved });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCorrect = tileId === index;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square rounded-lg overflow-hidden select-none
        ${isDragging ? 'z-50 shadow-xl shadow-rose-500/30 scale-105' : 'z-0'}
        ${solved ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        ${isCorrect && !solved ? 'ring-1 ring-emerald-400/30' : ''}
        transition-shadow duration-200`}
      whileHover={!solved ? { scale: 1.05 } : {}}
      layout
    >
      {/* Gradient heart background piece */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 35%, #fb7185 0%, transparent 50%),
            radial-gradient(circle at 70% 35%, #fb7185 0%, transparent 50%),
            radial-gradient(circle at 50% 60%, #e11d48 0%, transparent 60%),
            linear-gradient(135deg, #1a0a10 0%, #2d0a1a 30%, #4a0e2e 60%, #1a0a10 100%)
          `,
          backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
          ...getTileBackground(tileId),
        }}
      />

      {/* Tile number overlay for identification */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold drop-shadow-lg ${
          solved ? 'text-white/60' : 'text-white/80'
        }`}>
          {tileId + 1}
        </span>
      </div>

      {/* Correct position indicator */}
      {isCorrect && !solved && (
        <div className="absolute top-1 right-1">
          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Border overlay */}
      <div className={`absolute inset-0 rounded-lg border ${
        isDragging ? 'border-rose-400/60' : 'border-white/10'
      }`} />
    </motion.div>
  );
};

const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ onSolve, isSolved: propIsSolved }) => {
  const [tiles, setTiles] = useState<number[]>(() => createShuffledTiles());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  const solved = propIsSolved || isSolved(tiles);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const items = useMemo(() => tiles.map((_, i) => i.toString()), [tiles]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (propIsSolved) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string);
    const newIndex = parseInt(over.id as string);

    setTiles(prev => {
      const next = arrayMove(prev, oldIndex, newIndex);
      setMoveCount(m => m + 1);

      if (isSolved(next) && !propIsSolved) {
        setTimeout(() => {
          setShowSuccess(true);
          onSolve();
        }, 500);
      }
      return next;
    });
  }, [propIsSolved, onSolve]);

  const handleShuffle = () => {
    setTiles(createShuffledTiles());
    setMoveCount(0);
  };

  const correctCount = tiles.filter((t, i) => t === i).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-rose-300">Jigsaw Puzzle</h2>
      <p className="text-rose-200/70 text-sm text-center">
        Drag and drop tiles to arrange them in order (1-16) and reveal the hidden heart.
      </p>

      <div className="flex gap-4 text-xs text-rose-200/60">
        <span>Moves: {moveCount}</span>
        <span>Correct: {correctCount}/{TOTAL_TILES}</span>
      </div>

      {/* Preview toggle */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="text-xs text-rose-300/60 hover:text-rose-300 transition-colors underline"
      >
        {showPreview ? 'Hide preview' : 'Show completed preview'}
      </button>

      {/* Preview image */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-32 h-32 rounded-xl overflow-hidden border border-rose-400/20"
          >
            <div
              className="w-full h-full"
              style={{
                background: `
                  radial-gradient(circle at 30% 35%, #fb7185 0%, transparent 50%),
                  radial-gradient(circle at 70% 35%, #fb7185 0%, transparent 50%),
                  radial-gradient(circle at 50% 60%, #e11d48 0%, transparent 60%),
                  linear-gradient(135deg, #1a0a10 0%, #2d0a1a 30%, #4a0e2e 60%, #1a0a10 100%)
                `,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div
            className="grid gap-1.5 w-full max-w-xs"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {tiles.map((tileId, index) => (
              <SortableTile
                key={index}
                id={index}
                tileId={tileId}
                index={index}
                solved={solved}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Controls */}
      {!solved && (
        <button
          onClick={handleShuffle}
          className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm hover:bg-rose-500/30 transition-colors"
        >
          Reshuffle
        </button>
      )}

      <AnimatePresence>
        {(showSuccess || propIsSolved) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 px-6 rounded-xl bg-rose-500/20 border border-rose-400/30"
          >
            <p className="text-rose-300 font-semibold text-lg">
              The heart is complete! Julie, your love puzzle awaits at Dronningens gate 25.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JigsawPuzzle;
