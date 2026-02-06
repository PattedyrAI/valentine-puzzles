import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-center">
        <Link
          to="/"
          className="text-white/90 no-underline transition-opacity hover:opacity-70"
        >
          <h1
            className="text-base md:text-lg font-semibold tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Julies Valentinskalender
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
