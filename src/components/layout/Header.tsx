import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a0a2e]/80 backdrop-blur-md border-b border-rose-900/30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center">
        <Link
          to="/"
          className="text-[#fef3e2] no-underline transition-opacity hover:opacity-80"
        >
          <h1
            className="text-xl md:text-2xl font-bold tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-rose-400">&#128149;</span>
            <span className="mx-2 bg-gradient-to-r from-rose-300 via-[#fef3e2] to-rose-300 bg-clip-text text-transparent">
              Julie&apos;s Valentine Countdown
            </span>
            <span className="text-rose-400">&#128149;</span>
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
