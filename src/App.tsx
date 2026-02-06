import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HeartBackground from './components/common/HeartBackground';
import FloatingAffirmations from './components/common/FloatingAffirmations';
import SnoopyDance from './components/common/SnoopyDance';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';
import FinalRevealPage from './pages/FinalRevealPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/puzzle/:id" element={<PuzzlePage />} />
          <Route path="/final" element={<FinalRevealPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HashRouter>
      <HeartBackground />
      <FloatingAffirmations />
      <SnoopyDance />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
