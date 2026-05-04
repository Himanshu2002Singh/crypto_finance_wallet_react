import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Grow Your Wealth with Crypto
        </h1>
        <p className="text-lg md:text-xl text-purple-200 mb-10 max-w-3xl mx-auto">
          Join thousands of investors earning consistent returns through our proven cryptocurrency
          investment strategies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/get-started"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Start Investing Today
          </Link>
          <a
            href="#plans"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
          >
            View Investment Plans
          </a>
        </div>
      </div>
    </section>
  );
}
