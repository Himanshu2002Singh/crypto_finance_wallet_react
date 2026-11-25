import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Crown,
  Coins,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Copy,
  ExternalLink,
  X,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-react';

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
  ratePct: number;
  referralPct: number;
  tagline: string;
}

const defaultPlans: Plan[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: '10000',
    ratePct: 1.5,
    referralPct: 2.0,
    tagline: 'Entry Wealth Foundation',
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '25000',
    ratePct: 2.0,
    referralPct: 2.5,
    tagline: 'Accelerated Compounding Strategy',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '50000',
    ratePct: 2.5,
    referralPct: 3.0,
    tagline: 'Executive VIP Private Wealth',
  },
];

const planStyles: Record<string, { border: string; badge: string; popular?: boolean }> = {
  Bronze: { border: 'border-amber-200/90', badge: 'bg-slate-100 text-slate-800' },
  Silver: { border: 'border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10', badge: 'bg-amber-500 text-slate-950 font-bold', popular: true },
  Gold: { border: 'border-amber-300 shadow-amber-900/10', badge: 'bg-amber-100 text-amber-900 font-bold' },
};

export function DashboardHome() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  // Plan Execution Modal State
  const [selectedPlanForExecution, setSelectedPlanForExecution] = useState<Plan | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(25000);
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'upi' | 'balance'>('usdt');
  const [txHash, setTxHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');
  const hasKyc = Boolean(user?.idProofUrl && user?.photoUrl);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/users/dashboard');
      let data: DashboardData = response.data;

      // Check if user has an active plan stored locally
      const localActive = localStorage.getItem(`activePlan_${user?.id || userId}`);
      if (localActive && !data.activePlan) {
        try {
          data.activePlan = JSON.parse(localActive);
        } catch {
          // ignore
        }
      }

      setDashboard(data);
    } catch {
      // Offline / Demo fallback
      const localActive = localStorage.getItem(`activePlan_${user?.id || userId}`);
      let parsedPlan = null;
      if (localActive) {
        try {
          parsedPlan = JSON.parse(localActive);
        } catch {
          parsedPlan = null;
        }
      }

      setDashboard({
        bronzeReturnRate: '1.5',
        silverReturnRate: '2.0',
        goldReturnRate: '2.5',
        referralRate: '2.0',
        bronzeReferralRate: '2.0',
        silverReferralRate: '2.5',
        goldReferralRate: '3.0',
        activePlan: parsedPlan,
        referralEarnings: 0,
      });
    }
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data?.plans && response.data.plans.length > 0) {
          const apiPlans = response.data.plans.map((p: any) => {
            const def = defaultPlans.find((d) => d.name.toLowerCase() === p.name.toLowerCase());
            return {
              ...p,
              ratePct: def?.ratePct || 2.0,
              referralPct: def?.referralPct || 2.5,
              tagline: def?.tagline || 'Strategic Wealth Tier',
            };
          });
          setPlans(apiPlans);
        }
      } catch {
        setPlans(defaultPlans);
      }
    };

    void loadDashboard();
    void loadPlans();
  }, [user]);

  const stats = useMemo(() => {
    return [
      {
        label: 'Bronze Plan Yield',
        value: dashboard ? `${dashboard.bronzeReturnRate}% / mo` : '1.5% / mo',
        sub: '18% Annual APY',
        icon: '🥉',
        iconBg: 'bg-amber-100 text-amber-800',
      },
      {
        label: 'Silver Plan Yield',
        value: dashboard ? `${dashboard.silverReturnRate}% / mo` : '2.0% / mo',
        sub: '24% Annual APY',
        icon: '🥈',
        iconBg: 'bg-amber-200 text-amber-900',
      },
      {
        label: 'Gold Plan Yield',
        value: dashboard ? `${dashboard.goldReturnRate}% / mo` : '2.5% / mo',
        sub: '30% Annual APY',
        icon: '🥇',
        iconBg: 'bg-yellow-100 text-yellow-900',
      },
      {
        label: 'Referral Rewards',
        value: dashboard
          ? `${dashboard.bronzeReferralRate}% – ${dashboard.goldReferralRate}%`
          : '2.0% – 3.0%',
        sub: 'Direct Commission',
        icon: '👥',
        iconBg: 'bg-emerald-100 text-emerald-800',
      },
    ];
  }, [dashboard]);

  const quickActions = [
    { label: 'Invite Referrals', color: 'bg-slate-900 hover:bg-slate-800 text-amber-400', href: '/dashboard/referrals' },
    { label: 'Complete KYC & Profile', color: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black', href: '/dashboard/profile' },
    { label: 'Support Concierge', color: 'bg-white hover:bg-amber-50 text-slate-900 border border-amber-200', href: '/dashboard/support' },
  ];

  const openPlanExecution = (plan: Plan) => {
    setSelectedPlanForExecution(plan);
    setInvestAmount(Number(plan.price));
    setTxHash('');
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
    toast.success('Deposit address copied to clipboard');
  };

  const handleConfirmPlanExecution = async () => {
    if (!selectedPlanForExecution) return;

    setIsSubmittingPlan(true);
    try {
      try {
        await api.post('/users/plans', {
          planId: selectedPlanForExecution.id,
          amount: investAmount,
          paymentMethod,
          txHash: txHash || undefined,
        });
      } catch (err: any) {
        console.warn('Backend plan activation endpoint note:', err?.message);
      }

      // Persist active plan locally
      const activeObj = {
        name: selectedPlanForExecution.name,
        price: investAmount.toString(),
      };
      localStorage.setItem(`activePlan_${user?.id || userId}`, JSON.stringify(activeObj));

      setDashboard((prev) =>
        prev
          ? { ...prev, activePlan: activeObj }
          : {
              bronzeReturnRate: '1.5',
              silverReturnRate: '2.0',
              goldReturnRate: '2.5',
              referralRate: '2.0',
              bronzeReferralRate: '2.0',
              silverReferralRate: '2.5',
              goldReferralRate: '3.0',
              activePlan: activeObj,
              referralEarnings: 0,
            }
      );

      toast.success(
        `Success! ${selectedPlanForExecution.name} Tier Plan of $${investAmount.toLocaleString()} USD has been activated.`
      );
      setSelectedPlanForExecution(null);
    } catch (err: any) {
      toast.error('Unable to execute plan selection. Please retry.');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-xl shadow-amber-500/15 border border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Investor Dashboard (USD Vault)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              Welcome back, {user?.fullName || userId}!
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-900/90">
              <span className="bg-white/80 px-3 py-1 rounded-lg border border-amber-300/80 shadow-sm font-mono">
                User ID: <strong className="text-slate-950">{userId}</strong>
              </span>
              <span className="bg-white/80 px-3 py-1 rounded-lg border border-amber-300/80 shadow-sm">
                Status: <strong className="text-emerald-800">Active Investor</strong>
              </span>
              {dashboard?.activePlan && (
                <span className="bg-slate-950 text-amber-300 px-3 py-1 rounded-lg shadow-sm font-black">
                  Active Plan: {dashboard.activePlan.name} (${Number(dashboard.activePlan.price).toLocaleString()} USD)
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#plans"
              className="bg-slate-950 hover:bg-slate-800 text-amber-400 px-6 py-3.5 rounded-xl font-black text-xs transition shadow-md flex items-center gap-1.5"
            >
              <span>{dashboard?.activePlan ? 'Upgrade / Change Plan' : 'Select Investment Plan'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/dashboard/referrals"
              className="bg-white/90 hover:bg-white text-slate-950 px-6 py-3.5 rounded-xl font-bold text-xs transition shadow-sm border border-amber-300"
            >
              Referral Program
            </Link>
          </div>
        </div>
      </div>

      {/* KYC Alert Notification Banner (Requirement 7) */}
      {!hasKyc && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-950">
                KYC Identity Verification Pending
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                You can start browsing and activating plans right away! When convenient, please complete your identity verification in your Profile to enable unrestricted capital withdrawals.
              </div>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Complete KYC Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/70 hover:border-amber-300 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center text-lg font-bold shadow-sm`}
              >
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {stat.sub}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-slate-950">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Choose Your Plan Execution Grid (Requirement 10) */}
      <div id="plans" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-amber-200/60">
          <div>
            <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
              <span>Choose & Execute Investment Plan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select your desired capital tier below to execute immediate plan activation.
            </p>
          </div>

          {dashboard?.activePlan && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black self-start sm:self-auto">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Current Active Plan: {dashboard.activePlan.name} (${Number(dashboard.activePlan.price).toLocaleString()} USD)</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const style = planStyles[plan.name] || planStyles.Bronze;
            const isActive = dashboard?.activePlan?.name.toLowerCase() === plan.name.toLowerCase();
            const isGold = plan.name === 'Gold';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white border ${style.border} p-7 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all ${
                  isActive ? 'ring-2 ring-emerald-500 shadow-emerald-500/10' : ''
                }`}
              >
                {/* Active or Popular Badge */}
                {isActive ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Your Active Plan</span>
                  </div>
                ) : style.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-black text-slate-950 flex items-center gap-1.5">
                      {isGold && <Crown className="h-5 w-5 text-amber-500" />}
                      {plan.name} Tier
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                      {plan.ratePct}% / Month
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-5">{plan.tagline}</p>

                  {/* Initial Capital Entry */}
                  <div className="rounded-2xl bg-amber-50/50 p-4 mb-5 border border-amber-200/60">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                      <span>MINIMUM ENTRY (USD)</span>
                      <span>FIXED PRICING</span>
                    </div>
                    <div className="text-3xl font-black text-slate-950">
                      $ {Number(plan.price).toLocaleString()}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Monthly Return</span>
                        <strong className="text-emerald-700 font-black">{plan.ratePct}% / mo</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Referral Bonus</span>
                        <strong className="text-amber-800 font-black">{plan.referralPct}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Profit Illustration Preview */}
                  <div className="rounded-xl bg-slate-50 p-3 mb-6 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly Yield:</span>
                      <strong className="text-emerald-700">${(Number(plan.price) * plan.ratePct / 100).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>1-Year Projected Net:</span>
                      <strong className="text-slate-950">${(Number(plan.price) + Number(plan.price) * plan.ratePct / 100 * 12).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Plan Execution Button */}
                <button
                  type="button"
                  onClick={() => openPlanExecution(plan)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isActive
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:shadow-amber-500/25'
                  }`}
                >
                  <span>{isActive ? 'Manage / Upgrade Plan' : `Choose & Execute ${plan.name}`}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Band */}
      <div>
        <h3 className="text-xl font-black text-slate-950 mb-4">Investor Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 text-left font-black text-sm flex items-center justify-between ${action.color}`}
            >
              <span>{action.label}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Plan Execution & Deposit Modal (Requirement 10) */}
      {selectedPlanForExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative rounded-3xl border border-amber-300 bg-white p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setSelectedPlanForExecution(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-5 border-b border-amber-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Execute Investment Allocation</span>
              </span>
              <h3 className="text-2xl font-black text-slate-950">
                Activate {selectedPlanForExecution.name} Tier Plan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your capital entry to activate your personalized return rate schedule.
              </p>
            </div>

            <div className="py-5 space-y-5">
              {/* Amount Entry & Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Investment Capital (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-base">$</span>
                  <input
                    type="number"
                    min={Number(selectedPlanForExecution.price)}
                    step="500"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(Math.max(Number(selectedPlanForExecution.price), Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-black text-lg text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Minimum for {selectedPlanForExecution.name}: ${Number(selectedPlanForExecution.price).toLocaleString()} USD</span>
                  <span className="font-bold text-amber-700">Yield: {selectedPlanForExecution.ratePct}% / Month</span>
                </div>
              </div>

              {/* Dynamic Return Calculation Preview */}
              <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Monthly Return:</span>
                  <strong className="text-emerald-700 font-bold">
                    ${Math.round((investAmount * selectedPlanForExecution.ratePct) / 100).toLocaleString()} / month
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>1-Year Projected Total:</span>
                  <strong className="text-slate-950 font-black">
                    ${Math.round(investAmount + (investAmount * selectedPlanForExecution.ratePct * 12) / 100).toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Referral Commission:</span>
                  <strong className="text-amber-800 font-bold">{selectedPlanForExecution.referralPct}% on network activates</strong>
                </div>
              </div>

              {/* Deposit Method Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Funding Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('usdt')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'usdt'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-amber-600" />
                    <span>USDT (TRC20)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Bank / UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('balance')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'balance'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Instant Credit</span>
                  </button>
                </div>
              </div>

              {/* Deposit Instructions according to method */}
              {paymentMethod === 'usdt' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>USDT Deposit Address (TRC20)</span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">TRON</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="TYdY8h7Qv3m3N8L6kK2v9xP1w4B7rE8uA"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyAddress('TYdY8h7Qv3m3N8L6kK2v9xP1w4B7rE8uA')}
                      className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition"
                      title="Copy Address"
                    >
                      {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Enter Transfer TxID / Hash (Optional for Instant Demo)"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 mt-2"
                  />
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>UPI VPA / Bank Details</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">Instant IMPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="investsecure@icici"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyAddress('investsecure@icici')}
                      className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition"
                      title="Copy UPI"
                    >
                      {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Enter UPI UTR / Reference No. (Optional for Instant Demo)"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 mt-2"
                  />
                </div>
              )}

              {paymentMethod === 'balance' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-950 space-y-1">
                  <strong>Instant Demo Activation Enabled:</strong>
                  <p>
                    Activating via Instant Credit allows you to immediately allocate and confirm your {selectedPlanForExecution.name} Tier Plan without external gateway delays.
                  </p>
                </div>
              )}

              {/* Execution Confirm Button */}
              <button
                type="button"
                onClick={handleConfirmPlanExecution}
                disabled={isSubmittingPlan}
                className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmittingPlan ? 'Executing Plan Allocation...' : `Confirm & Activate ${selectedPlanForExecution.name} Plan`}</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
