import { Link } from 'react-router-dom';
import { investmentPlans } from '../../../data/mockData';

export function MyInvestments() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Plans</h1>
        <p className="text-gray-600">
          Choose a plan that fits your investment goals and start earning today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {investmentPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white border-2 ${plan.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition ${
              plan.popular ? 'transform scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                USDT {plan.price.toLocaleString()}
              </div>
              <p className="text-gray-500 text-sm">Minimum investment amount</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Weekly Return</span>
                <span className="font-semibold text-green-600">{plan.weeklyReturn}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Annual Return</span>
                <span className="font-semibold text-green-600">{plan.annualReturn}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Referral Bonus</span>
                <span className="font-semibold text-blue-600">{plan.referralBonus}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Withdrawal Period</span>
                <span className="font-semibold text-gray-800">{plan.withdrawalPeriod}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 text-sm">Min. Withdrawal</span>
                <span className="font-semibold text-gray-800 text-sm">
                  USDT {plan.minWithdrawal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 text-sm">Early Withdrawal Fee</span>
                <span className="font-semibold text-red-600 text-sm">
                  {plan.earlyWithdrawalFee}%
                </span>
              </div>
            </div>

            <Link
              to="/dashboard/invest"
              className={`block w-full bg-gradient-to-r ${plan.color} text-white py-3 rounded-lg font-semibold text-center hover:shadow-lg transition`}
            >
              Choose {plan.name} Plan
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Investment Information</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>✓ All returns are calculated and distributed weekly</li>
          <li>✓ Investments are locked for the specified withdrawal period</li>
          <li>✓ Early withdrawals incur the listed fee percentage</li>
          <li>✓ Referral bonuses are paid instantly when your referral invests</li>
          <li>✓ Upgrade your plan anytime to unlock higher returns</li>
        </ul>
      </div>
    </div>
  );
}
