import { Link } from 'react-router-dom';

export function InvestmentPurchase() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment System Coming Soon</h1>
        <p className="text-gray-600 mb-6">
          We are finalizing payment integrations. You can still choose a plan and we will notify
          you as soon as payments are enabled.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Back to Plans
        </Link>
      </div>
    </div>
  );
}
