import { Link } from 'react-router-dom';
import { investmentPlans } from '../../../data/mockData';

export function InvestmentPlansSection() {
  return (
    <section id="plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the plan that best fits your investment goals and risk tolerance
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
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  Login to View
                </div>
                <p className="text-gray-500 text-sm">Pricing available after registration</p>
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
              </div>

              <Link
                to="/login"
                className={`block w-full bg-gradient-to-r ${plan.color} text-white py-3 rounded-lg font-semibold text-center hover:shadow-lg transition`}
              >
                Login to Invest
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
