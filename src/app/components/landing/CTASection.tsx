import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Investment Journey?
        </h2>
        <p className="text-lg text-purple-200 mb-10 max-w-2xl mx-auto">
          Join our community of successful investors and start earning passive income today
        </p>
        <Link
          to="/get-started"
          className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Create Your Account Now
        </Link>
      </div>
    </section>
  );
}
