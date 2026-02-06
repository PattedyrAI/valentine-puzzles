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
        <div className="inline-block p-8 rounded-2xl bg-white/[0.03] border-[1.5px] border-white/[0.08]">
          <p className="text-white/60 text-base font-medium mb-2">
            {score} av {QUESTIONS.length} riktige
          </p>
          <p className="text-white/35 text-sm mb-6">
            Du trenger minst {REQUIRED_CORRECT} for &aring; best&aring;.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-[#1a1f2e] text-white/80 text-sm font-semibold hover:bg-[#222840] transition-all duration-200 border-2 border-[#3a4260] hover:border-[#5a6490]"
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
      <div className="flex items-center justify-between mb-5">
        <span className="text-white/40 text-sm font-medium">
          Sp&oslash;rsm&aring;l {currentQuestion + 1} av {QUESTIONS.length}
        </span>
        <span className="text-emerald-400/60 text-sm font-medium">
          {score} riktige
        </span>
      </div>

      <div className="w-full h-1 rounded-full bg-white/[0.06] mb-8">
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
          <p className="text-white/80 text-base font-medium leading-relaxed mb-8 text-center">
            {question.question}
          </p>

          <div className="flex flex-col gap-5">
            {question.options.map((option, i) => {
              let style = 'bg-[#182420] border-2 border-[#2f5840] text-white/90 hover:bg-[#1e3028] hover:border-[#40785a]';

              if (showResult) {
                if (i === question.correct) {
                  style = 'bg-[#0e3020] border-2 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]';
                } else if (i === selectedAnswer && !isCorrect) {
                  style = 'bg-[#2e1010] border-2 border-red-400 text-red-400';
                } else {
                  style = 'bg-[#101214] border-2 border-[#1e2228] text-white/25';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full py-6 px-6 rounded-2xl text-center text-lg font-semibold transition-all duration-200 active:scale-[0.97] ${style}`}
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
