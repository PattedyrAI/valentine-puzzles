import { HashRouter, Routes, Route } from 'react-router-dom';
import HeartBackground from './components/common/HeartBackground';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';
import FinalRevealPage from './pages/FinalRevealPage';

function App() {
  return (
    <HashRouter>
      <HeartBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/puzzle/:id" element={<PuzzlePage />} />
            <Route path="/final" element={<FinalRevealPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
