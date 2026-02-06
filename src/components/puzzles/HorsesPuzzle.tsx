import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HorsesPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    question: 'Hvilken hesterase er født mørk og blir gradvis hvit med alderen?',
    options: ['Araber', 'Lipizzaner', 'Andalusier', 'Frieser'],
    correct: 1,
  },
  {
    question: 'Akhal-Teke er kjent for hvilket særtrekk?',
    options: ['Krøllete man', 'Metallisk skinnende pels', 'Blå øyne', 'Flekkete mønster'],
    correct: 1,
  },
  {
    question: 'Hvilken rase har en mørk stripe gjennom manen?',
    options: ['Haflinger', 'Fjordhest', 'Mustang', 'Clydesdale'],
    correct: 1,
  },
  {
    question: 'Hva kalles de fjærlignende hårdottene på en Clydesdales nedre ben?',
    options: ['Plymmer', 'Hovskjegg', 'Strømper', 'Frynser'],
    correct: 1,
  },
  {
    question: 'Hvilken rase kalles også «Den rene spanske hesten»?',
    options: ['Lusitano', 'Andalusier', 'Paso Fino', 'Azteca'],
    correct: 1,
  },
  {
    question: 'Arabere er kjent for å ha færre av hvilke knokler enn andre hester?',
    options: ['Beinknokler', 'Ribbein og virvler', 'Hodeskalleplater', 'Tenner'],
    correct: 1,
  },
];

const REQUIRED_CORRECT = 5;

export default function HorsesPuzzle({ onSolve, isSolved }: HorsesPuzzleProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question?.correct;

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedAnswer !== null || isSolved) return;
      setSelectedAnswer(index);
      setShowResult(true);

      const newScore = index === question.correct ? score + 1 : score;
      if (index === question.correct) {
        setScore(newScore);
      }

      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setIsFinished(true);
          if (newScore >= REQUIRED_CORRECT && !isSolved) {
            setTimeout(() => onSolve(), 300);
          }
        }
      }, 1200);
    },
    [selectedAnswer, isSolved, question, score, currentQuestion, onSolve],
  );

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsFinished(false);
  }, []);

  if (isSolved) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <span className="text-emerald-400 text-sm font-medium">
            Oppgave fullf&oslash;rt
          </span>
        </motion.div>
      </div>
    );
  }

  if (isFinished && score < REQUIRED_CORRECT) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-white/60 text-sm mb-1">
            {score} av {QUESTIONS.length} riktige
          </p>
          <p className="text-white/35 text-xs mb-4">
            Du trenger minst {REQUIRED_CORRECT} for &aring; best&aring;.
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-white/[0.06] text-white/70 text-sm hover:bg-white/[0.10] transition-colors border border-white/[0.08]"
          >
            Pr&oslash;v igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/30 text-xs">
          Sp&oslash;rsm&aring;l {currentQuestion + 1} av {QUESTIONS.length}
        </span>
        <span className="text-white/30 text-xs">
          {score} riktige
        </span>
      </div>

      <div className="w-full h-0.5 rounded-full bg-white/[0.06] mb-6">
        <motion.div
          className="h-full rounded-full bg-emerald-500/60"
          animate={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-white/80 text-sm font-medium leading-relaxed mb-5 text-center">
            {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((option, i) => {
              let style = 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08]';

              if (showResult) {
                if (i === question.correct) {
                  style = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
                } else if (i === selectedAnswer && !isCorrect) {
                  style = 'bg-red-500/10 border-red-500/20 text-red-400/80';
                } else {
                  style = 'bg-white/[0.02] border-white/[0.04] text-white/30';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full px-4 py-3 rounded-lg text-left text-sm transition-colors duration-150 border ${style}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
