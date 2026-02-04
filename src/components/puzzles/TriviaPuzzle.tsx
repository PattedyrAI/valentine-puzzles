import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TriviaPuzzleProps {
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
    question: 'What is the capital of Norway?',
    options: ['Oslo', 'Bergen', 'Stockholm', 'Copenhagen'],
    correctIndex: 0,
  },
  {
    question: 'Which saint is Valentine\'s Day named after?',
    options: ['Saint Valentine', 'Saint Patrick', 'Saint Nicholas', 'Saint George'],
    correctIndex: 0,
  },
  {
    question: 'What color rose traditionally symbolizes love?',
    options: ['Red', 'White', 'Yellow', 'Pink'],
    correctIndex: 0,
  },
  {
    question: 'What is Norway\'s famous fjord near Oslo called?',
    options: ['Oslofjord', 'Sognefjord', 'Geirangerfjord', 'Hardangerfjord'],
    correctIndex: 0,
  },
  {
    question: 'In which century did Valentine\'s Day become associated with romantic love?',
    options: ['14th', '18th', '12th', '16th'],
    correctIndex: 0,
  },
  {
    question: 'What is the Norwegian word for \'love\'?',
    options: ['Kj\u00e6rlighet', 'K\u00e4rlek', 'Liebe', 'Amour'],
    correctIndex: 0,
  },
  {
    question: 'Which famous Oslo park features sculptures by Gustav Vigeland?',
    options: ['Vigeland Park', 'Frogner Park', 'Ekebergparken', 'Slottsparken'],
    correctIndex: 0,
  },
  {
    question: 'How many letters are in the word \'VALENTINE\'?',
    options: ['8', '9', '10', '11'],
    correctIndex: 1,
  },
];

// Shuffle options for each question while tracking the correct index
function prepareQuestions(): { questions: TriviaQuestion[] } {
  const prepared = QUESTIONS.map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffled = [...q.options];
    // Fisher-Yates shuffle with a fixed seed approach isn't needed;
    // we just shuffle once on mount
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

const PASS_THRESHOLD = 6;

const TriviaPuzzle: React.FC<TriviaPuzzleProps> = ({ onSolve, isSolved }) => {
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
        // Use the latest answer for current question
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
      return 'bg-rose-500/10 border-rose-400/20 hover:bg-rose-500/20 hover:border-rose-400/40 text-rose-100';
    }
    if (index === currentQuestion.correctIndex) {
      return 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300';
    }
    if (index === selectedOption && index !== currentQuestion.correctIndex) {
      return 'bg-red-500/20 border-red-400/40 text-red-300';
    }
    return 'bg-white/5 border-white/10 text-rose-200/40';
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
        <h2 className="text-2xl font-bold text-rose-300">Trivia Results</h2>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center py-6 px-10 rounded-2xl border ${
            finalScore >= PASS_THRESHOLD
              ? 'bg-emerald-500/10 border-emerald-400/30'
              : 'bg-red-500/10 border-red-400/30'
          }`}
        >
          <p className="text-5xl font-bold mb-2">
            {finalScore} / {questions.length}
          </p>
          <p className={`text-lg font-semibold ${
            finalScore >= PASS_THRESHOLD ? 'text-emerald-300' : 'text-red-300'
          }`}>
            {finalScore >= PASS_THRESHOLD
              ? 'Pass! You know your love and Oslo trivia!'
              : `Need ${PASS_THRESHOLD}+ to pass. Try again!`}
          </p>
        </motion.div>

        {finalScore < PASS_THRESHOLD && !isSolved && (
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:bg-rose-500/30 transition-colors"
          >
            Try Again
          </button>
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
      <h2 className="text-2xl font-bold text-rose-300">Love & Oslo Trivia</h2>

      {/* Progress */}
      <div className="w-full flex items-center gap-3">
        <span className="text-sm text-rose-200/60">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-rose-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-rose-200/60">
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
          transition={{ duration: 0.3 }}
          className="w-full rounded-2xl bg-white/5 backdrop-blur-sm border border-rose-400/20 p-6"
        >
          <h3 className="text-lg font-semibold text-rose-100 mb-5">
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
          className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:bg-rose-500/30 transition-colors font-medium"
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default TriviaPuzzle;
