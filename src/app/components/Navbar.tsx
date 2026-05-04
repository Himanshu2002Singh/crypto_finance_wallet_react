import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-white text-xl font-semibold">InvestPro</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Login
            </Link>
            <Link
              to="/get-started"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
