import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GreenDayPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: TriviaQuestion[] = [
  {
    question: "Which Hamburg venue is famous for its wave-like glass rooftop and sits right on the Elbe?",
    options: ['Elbphilharmonie', 'Kampnagel', 'Markthalle Hamburg', 'Fabrik'],
    correctIndex: 0,
  },
  {
    question: "Green Day typically opens concerts with pyro and which classic anthem?",
    options: ['American Idiot', 'Basket Case', 'Welcome to Paradise', 'Longview'],
    correctIndex: 0,
  },
  {
    question: "Which Hamburg street is the legendary nightlife strip where The Beatles once played?",
    options: ['Reeperbahn', 'Jungfernstieg', 'M\u00F6nckebergstra\u00DFe', 'Lange Reihe'],
    correctIndex: 0,
  },
  {
    question: "At a Green Day show, Billie Joe famously gets the crowd to chant which call-and-response?",
    options: ['Hey-Oh!', 'Oi Oi Oi!', 'Let\'s Go!', 'Yeah Yeah!'],
    correctIndex: 0,
  },
  {
    question: "What is the name of the inner-city lake surrounded by Hamburg's most beautiful walking paths?",
    options: ['Binnenalster', 'Au\u00DFenalster', 'Stadtparksee', 'Elbsee'],
    correctIndex: 0,
  },
  {
    question: "Which Green Day ballad always makes the lighters come out \u2014 about loss and the passing of time?",
    options: ['Wake Me Up When September Ends', 'Good Riddance (Time of Your Life)', '21 Guns', 'Still Breathing'],
    correctIndex: 0,
  },
  {
    question: "What is the real first name of Green Day's drummer 'Tr\u00E9 Cool'?",
    options: ['Frank', 'Thomas', 'Patrick', 'William'],
    correctIndex: 0,
  },
  {
    question: "Hamburg's Speicherstadt warehouse district is a UNESCO World Heritage Site. What was originally stored there?",
    options: ['Coffee, tea, and spices', 'Weapons and ammunition', 'Art and antiques', 'Gold and silver'],
    correctIndex: 0,
  },
  {
    question: "In the 'American Idiot' rock opera, who is the alter ego that represents rebellion and chaos?",
    options: ['St. Jimmy', 'Jesus of Suburbia', 'Whatsername', 'The Extraordinary Girl'],
    correctIndex: 0,
  },
  {
    question: "Which Green Day song has the lyric 'I walk a lonely road, the only one that I have ever known'?",
    options: ['Boulevard of Broken Dreams', 'Holiday', 'Minority', 'Letterbomb'],
    correctIndex: 0,
  },
];

function prepareQuestions(): { questions: TriviaQuestion[] } {
  const prepared = QUESTIONS.map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffled = [...q.options];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      question: q.question,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctAnswer),
    };
  });
  return { questions: prepared };
}

const PASS_THRESHOLD = 8;

export default function GreenDayPuzzle({ onSolve, isSolved }: GreenDayPuzzleProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>(() => prepareQuestions().questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [showResult, setShowResult] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const currentQuestion = questions[currentIndex];
  const score = answers.reduce<number>((acc, ans, i) => {
    if (ans !== null && ans === questions[i].correctIndex) return acc + 1;
    return acc;
  }, 0);

  const handleSelect = useCallback((optionIndex: number) => {
    if (isSolved || revealed) return;
    setSelectedOption(optionIndex);
    setRevealed(true);

    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  }, [isSolved, revealed, answers, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
    } else {
      setShowResult(true);
      const finalScore = answers.reduce<number>((acc, ans, i) => {
        const a = i === currentIndex ? selectedOption : ans;
        if (a !== null && a === questions[i].correctIndex) return acc + 1;
        return acc;
      }, 0);
      if (finalScore >= PASS_THRESHOLD && !isSolved) {
        setTimeout(() => onSolve(), 500);
      }
    }
  }, [currentIndex, questions, answers, selectedOption, isSolved, onSolve]);

  const handleRetry = useCallback(() => {
    const { questions: newQ } = prepareQuestions();
    setQuestions(newQ);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers(QUESTIONS.map(() => null));
    setShowResult(false);
    setRevealed(false);
  }, []);

  const getOptionStyle = (index: number) => {
    if (!revealed) {
      return 'bg-emerald-500/10 border-emerald-400/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 text-emerald-100';
    }
    if (index === currentQuestion.correctIndex) {
      return 'bg-green-500/20 border-green-400/40 text-green-300';
    }
    if (index === selectedOption && index !== currentQuestion.correctIndex) {
      return 'bg-red-500/20 border-red-400/40 text-red-300';
    }
    return 'bg-white/5 border-white/10 text-emerald-200/40';
  };

  if (showResult || isSolved) {
    const finalScore = isSolved ? PASS_THRESHOLD : answers.reduce<number>((acc, ans, i) => {
      if (ans !== null && ans === questions[i].correctIndex) return acc + 1;
      return acc;
    }, 0);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        <h2 className="text-2xl font-bold text-emerald-300">How Well Do You Remember?</h2>

        {isSolved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold"
          >
            Solved!
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: 'easeOut' as const, duration: 0.4 }}
          className={`text-center py-6 px-10 rounded-2xl border ${
            finalScore >= PASS_THRESHOLD
              ? 'bg-green-500/10 border-green-400/30'
              : 'bg-red-500/10 border-red-400/30'
          }`}
        >
          <p className="text-5xl font-bold mb-2">
            {finalScore} / {questions.length}
          </p>
          <p className={`text-lg font-semibold ${
            finalScore >= PASS_THRESHOLD ? 'text-green-300' : 'text-red-300'
          }`}>
            {finalScore >= PASS_THRESHOLD
              ? 'You remember everything about that night. I knew you would.'
              : `Need ${PASS_THRESHOLD}+ to pass. Try again!`}
          </p>
        </motion.div>

        {finalScore < PASS_THRESHOLD && !isSolved && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold text-emerald-300">That Night in Hamburg</h2>

      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold"
        >
          Solved!
        </motion.div>
      )}

      {/* Progress */}
      <div className="w-full flex items-center gap-3">
        <span className="text-sm text-emerald-200/60">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
          />
        </div>
        <span className="text-sm text-emerald-200/60">
          Score: {score}
        </span>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' as const }}
          className="w-full rounded-2xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 p-6"
        >
          <h3 className="text-lg font-semibold text-emerald-100 mb-5">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${getOptionStyle(i)}`}
                whileHover={!revealed ? { scale: 1.02 } : {}}
                whileTap={!revealed ? { scale: 0.98 } : {}}
              >
                <span className="mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full border border-current/30 text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
                {revealed && i === currentQuestion.correctIndex && (
                  <svg className="w-5 h-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
        </motion.button>
      )}
    </motion.div>
  );
}
