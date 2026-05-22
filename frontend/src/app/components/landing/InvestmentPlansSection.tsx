import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface Plan {
  id: string;
  name: string;
  price: string;
}

const planStyles: Record<string, { icon: string; border: string; color: string; popular?: boolean }> = {
  Bronze: { icon: '🥉', border: 'border-yellow-200', color: 'from-yellow-400 to-orange-500' },
  Silver: { icon: '🥈', border: 'border-purple-200', color: 'from-purple-500 to-indigo-600', popular: true },
  Gold: { icon: '🥇', border: 'border-amber-200', color: 'from-amber-400 to-yellow-500' },
};

const defaultPlans: Plan[] = [
  { id: 'bronze', name: 'Bronze', price: '10000' },
  { id: 'silver', name: 'Silver', price: '25000' },
  { id: 'gold', name: 'Gold', price: '50000' },
];

export function InvestmentPlansSection() {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data.plans);
      } catch {
        setPlans(defaultPlans);
      }
    };
    void loadPlans();
  }, []);

  const displayPlans = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      style: planStyles[plan.name] ?? {
        icon: '⭐',
        border: 'border-gray-200',
        color: 'from-gray-500 to-gray-700',
      }
    }));
  }, [plans]);

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
          {displayPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white border-2 ${plan.style.border} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition ${
                plan.style.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.style.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{plan.style.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  ₹ {Number(plan.price).toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm">Fixed global pricing</p>
              </div>

              <Link
                to="/login"
                className={`block w-full bg-gradient-to-r ${plan.style.color} text-white py-3 rounded-lg font-semibold text-center hover:shadow-lg transition`}
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
