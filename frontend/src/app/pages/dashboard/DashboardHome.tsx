import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface DashboardData {
  bronzeReturnRate: string;
  silverReturnRate: string;
  goldReturnRate: string;
  referralRate: string;
  bronzeReferralRate: string;
  silverReferralRate: string;
  goldReferralRate: string;
  activePlan: { name: string; price: string } | null;
  referralEarnings: number;
}

interface Plan {
  id: string;
  name: string;
  price: string;
}

const planStyles: Record<string, { icon: string; border: string; color: string; popular?: boolean }> = {
  Bronze: { icon: 'B', border: 'border-yellow-200', color: 'from-yellow-400 to-orange-500' },
  Silver: { icon: 'S', border: 'border-purple-200', color: 'from-purple-500 to-indigo-600', popular: true },
  Gold: { icon: 'G', border: 'border-amber-200', color: 'from-amber-400 to-yellow-500' },
};

export function DashboardHome() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planMessage, setPlanMessage] = useState('');
  const [isSubmittingPlan, setIsSubmittingPlan] = useState('');

  const loadDashboard = async () => {
    const response = await api.get('/users/dashboard');
    setDashboard(response.data);
  };

  useEffect(() => {
    const loadPlans = async () => {
      const response = await api.get('/plans');
      setPlans(response.data.plans);
    };
    void loadDashboard();
    void loadPlans();
  }, []);

  const stats = useMemo(() => {
    return [
      {
        label: 'Bronze Return',
        value: dashboard ? `${dashboard.bronzeReturnRate}%` : '--',
        icon: 'BR',
        iconBg: 'bg-indigo-100',
      },
      {
        label: 'Silver Return',
        value: dashboard ? `${dashboard.silverReturnRate}%` : '--',
        icon: 'SR',
        iconBg: 'bg-purple-100',
      },
      {
        label: 'Gold Return',
        value: dashboard ? `${dashboard.goldReturnRate}%` : '--',
        icon: 'GR',
        iconBg: 'bg-amber-100',
      },
      {
        label: 'Referral Bonus',
        value: dashboard
          ? `${dashboard.bronzeReferralRate}% / ${dashboard.silverReferralRate}% / ${dashboard.goldReferralRate}%`
          : '--',
        icon: 'RB',
        iconBg: 'bg-green-100',
      },
    ];
  }, [dashboard]);

  const quickActions = [
    { label: 'Invite Friends', color: 'from-purple-500 to-indigo-600', href: '/dashboard/referrals' },
    { label: 'Update Profile', color: 'from-blue-500 to-cyan-500', href: '/dashboard/profile' },
    { label: 'Get Support', color: 'from-emerald-500 to-green-600', href: '/dashboard/support' },
  ];

  const getPlanRates = (planName: string) => {
    const returnRate =
      planName === 'Bronze'
        ? dashboard?.bronzeReturnRate
        : planName === 'Silver'
          ? dashboard?.silverReturnRate
          : dashboard?.goldReturnRate;
    const referralRate =
      planName === 'Bronze'
        ? dashboard?.bronzeReferralRate
        : planName === 'Silver'
          ? dashboard?.silverReferralRate
          : dashboard?.goldReferralRate;

    return { returnRate, referralRate };
  };

  const handleChoosePlan = async (planId: string) => {
    setPlanMessage('');
    setIsSubmittingPlan(planId);
    try {
      await api.post('/users/plans', { planId });
      const successMessage = 'Payment system coming soon. Your plan request has been recorded.';
      setPlanMessage(successMessage);
      toast.success(successMessage);
      await loadDashboard();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Unable to choose this plan.';
      setPlanMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmittingPlan('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">Welcome back, {user?.fullName?.split(' ')[0] || 'Investor'}!</h2>
        <p className="text-purple-100 mb-6">
          Your personalized rates and plans are ready whenever you are.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#plans"
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
          >
            View Plans
          </a>
          <Link
            to="/dashboard/referrals"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg px-6 py-3 rounded-lg font-semibold transition"
          >
            Invite Friends
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center text-sm font-bold`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div id="plans" className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-gray-900">Your Plan Returns</h3>
          <span className="text-sm text-gray-500">
            Active Plan: {dashboard?.activePlan?.name || 'None'}
          </span>
        </div>

        {planMessage && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded-lg text-sm">
            {planMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const style = planStyles[plan.name] ?? {
              icon: '*',
              border: 'border-gray-200',
              color: 'from-gray-500 to-gray-700',
            };
            const { returnRate, referralRate } = getPlanRates(plan.name);
            const isActive = dashboard?.activePlan?.name === plan.name;

            return (
              <div
                key={plan.id}
                className={`relative bg-white border-2 ${style.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition ${
                  style.popular ? 'md:-translate-y-1' : ''
                }`}
              >
                {style.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-5">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-900">
                    {style.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">{plan.name}</h4>
                  <div className="mt-2 text-3xl font-bold text-gray-800">
                    ₹ {Number(plan.price).toLocaleString()}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Fixed global pricing</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Your Return</span>
                    <span className="font-bold text-indigo-700">{returnRate ? `${returnRate}%` : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Referral Bonus</span>
                    <span className="font-bold text-green-700">{referralRate ? `${referralRate}%` : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {isActive ? 'Active' : 'Available'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => void handleChoosePlan(plan.id)}
                  disabled={isSubmittingPlan === plan.id || Boolean(dashboard?.activePlan)}
                  className={`block w-full bg-gradient-to-r ${style.color} text-white py-3 rounded-lg font-semibold text-center hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isActive
                    ? 'Active Plan'
                    : isSubmittingPlan === plan.id
                      ? 'Submitting...'
                      : `Choose ${plan.name} Plan`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-left`}
            >
              <div className="font-semibold">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="px-6 py-8 text-center text-gray-500">
          Payment system coming soon. Transactions will appear here once enabled.
        </div>
      </div>
    </div>
  );
}
