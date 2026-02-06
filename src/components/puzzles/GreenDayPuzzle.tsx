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
    question: 'Hvilket konsertsted i Hamburg er kjent for sitt b\u00F8lgeformede glasstak og ligger rett ved Elben?',
    options: ['Elbphilharmonie', 'Kampnagel', 'Markthalle Hamburg', 'Fabrik'],
    correctIndex: 0,
  },
  {
    question: 'Green Day \u00E5pner vanligvis konserter med pyro og hvilken klassisk l\u00E5t?',
    options: ['American Idiot', 'Basket Case', 'Welcome to Paradise', 'Longview'],
    correctIndex: 0,
  },
  {
    question: 'Hvilken gate i Hamburg er den legendariske nattelivsstripen der The Beatles en gang spilte?',
    options: ['Reeperbahn', 'Jungfernstieg', 'M\u00F6nckebergstra\u00DFe', 'Lange Reihe'],
    correctIndex: 0,
  },
  {
    question: 'P\u00E5 en Green Day-konsert f\u00E5r Billie Joe publikum til \u00E5 synge hvilken call-and-response?',
    options: ['Hey-Oh!', 'Oi Oi Oi!', "Let's Go!", 'Yeah Yeah!'],
    correctIndex: 0,
  },
  {
    question: 'Hva heter den indre byinnsj\u00F8en omgitt av Hamburgs vakreste gangstier?',
    options: ['Binnenalster', 'Au\u00DFenalster', 'Stadtparksee', 'Elbsee'],
    correctIndex: 0,
  },
  {
    question: 'Hvilken Green Day-ballade f\u00E5r alltid lighterne frem \u2014 om tap og tidens gang?',
    options: ['Wake Me Up When September Ends', 'Good Riddance (Time of Your Life)', '21 Guns', 'Still Breathing'],
    correctIndex: 0,
  },
  {
    question: "Hva er det ekte fornavnet til Green Days trommeslager 'Tr\u00E9 Cool'?",
    options: ['Frank', 'Thomas', 'Patrick', 'William'],
    correctIndex: 0,
  },
  {
    question: 'Hamburgs Speicherstadt er p\u00E5 UNESCOs verdensarvliste. Hva ble opprinnelig lagret der?',
    options: ['Kaffe, te og krydder', 'V\u00E5pen og ammunisjon', 'Kunst og antikviteter', 'Gull og s\u00F8lv'],
    correctIndex: 0,
  },
  {
    question: "I rockeoperaen 'American Idiot', hvem er alter egoet som representerer oppr\u00F8r og kaos?",
    options: ['St. Jimmy', 'Jesus of Suburbia', 'Whatsername', 'The Extraordinary Girl'],
    correctIndex: 0,
  },
  {
    question: "Hvilken Green Day-l\u00E5t har teksten 'I walk a lonely road, the only one that I have ever known'?",
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
      return 'bg-[#0f1f1a] border-2 border-[#1a4a35] hover:bg-[#152e24] hover:border-[#2a6a4a] text-emerald-100';
    }
    if (index === currentQuestion.correctIndex) {
      return 'bg-[#0a2818] border-2 border-emerald-400/70 text-green-300 shadow-[0_0_20px_rgba(52,211,153,0.15)]';
    }
    if (index === selectedOption && index !== currentQuestion.correctIndex) {
      return 'bg-[#280a0a] border-2 border-red-400/60 text-red-300';
    }
    return 'bg-[#111318] border-2 border-[#252830] text-emerald-200/25';
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
        <h2 className="text-xl font-bold text-emerald-300">Hvor godt husker du?</h2>

        {isSolved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold"
          >
            Oppgave fullf&oslash;rt!
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
              ? 'Du husker alt fra den kvelden. Jeg visste du ville det.'
              : `Du trenger ${PASS_THRESHOLD}+ for \u00E5 best\u00E5. Pr\u00F8v igjen!`}
          </p>
        </motion.div>

        {finalScore < PASS_THRESHOLD && !isSolved && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-[#0f2018] border-2 border-[#1a5035] text-emerald-300 hover:bg-[#152a20] hover:border-[#2a6a4a] transition-all duration-200 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pr&oslash;v igjen
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full"
    >
      <h2 className="text-xl font-bold text-emerald-300">Den kvelden i Hamburg</h2>

      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold"
        >
          Oppgave fullf&oslash;rt!
        </motion.div>
      )}

      {/* Progress */}
      <div className="w-full flex items-center gap-3 mb-2">
        <span className="text-sm text-emerald-200/60 font-medium">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' as const }}
          />
        </div>
        <span className="text-sm text-emerald-200/60 font-medium">
          Poeng: {score}
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
          className="w-full rounded-2xl bg-white/[0.03] border-[1.5px] border-emerald-400/15 p-6"
        >
          <h3 className="text-base font-semibold text-emerald-100 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="flex flex-col gap-5">
            {currentQuestion.options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={`w-full text-center py-6 px-6 rounded-2xl transition-all duration-200 text-base font-semibold ${getOptionStyle(i)}`}
                whileHover={!revealed ? { scale: 1.02 } : {}}
                whileTap={!revealed ? { scale: 0.97 } : {}}
              >
                {option}
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
          className="px-8 py-3.5 rounded-xl bg-[#0f2018] border-2 border-[#1a5035] text-emerald-300 hover:bg-[#152a20] hover:border-[#2a6a4a] transition-all duration-200 font-semibold text-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {currentIndex < questions.length - 1 ? 'Neste sp\u00F8rsm\u00E5l' : 'Se resultater'}
        </motion.button>
      )}
    </motion.div>
  );
}
