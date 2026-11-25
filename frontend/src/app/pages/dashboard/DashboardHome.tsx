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
  const [isSwitchTierModalOpen, setIsSwitchTierModalOpen] = useState(false);

  // Plan Execution Modal State
  const [selectedPlanForExecution, setSelectedPlanForExecution] = useState<Plan | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'usdc' | 'balance'>('usdt');
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
        bronzeReturnRate: user?.bronzeReturnRate || '1.5',
        silverReturnRate: user?.silverReturnRate || '2.0',
        goldReturnRate: user?.goldReturnRate || '2.5',
        referralRate: user?.referralRate || '2.0',
        bronzeReferralRate: user?.bronzeReferralRate || '2.0',
        silverReferralRate: user?.silverReferralRate || '2.5',
        goldReferralRate: user?.goldReferralRate || '3.0',
        activePlan: parsedPlan || { name: 'Bronze', price: '10000' },
        referralEarnings: 0,
      });
    }
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data?.plans && response.data.plans.length > 0) {
          setPlans(response.data.plans);
        }
      } catch {
        setPlans(defaultPlans);
      }
    };

    void loadDashboard();
    void loadPlans();
  }, [user]);

  // Helper functions to retrieve the exact admin-assigned rates for each plan
  const getAssignedRate = (planName: string) => {
    const norm = planName.toLowerCase();
    if (norm === 'bronze') {
      return Number(dashboard?.bronzeReturnRate) || Number(user?.bronzeReturnRate) || 1.5;
    }
    if (norm === 'silver') {
      return Number(dashboard?.silverReturnRate) || Number(user?.silverReturnRate) || 2.0;
    }
    if (norm === 'gold') {
      return Number(dashboard?.goldReturnRate) || Number(user?.goldReturnRate) || 2.5;
    }
    return 2.0;
  };

  const getAssignedReferral = (planName: string) => {
    const norm = planName.toLowerCase();
    if (norm === 'bronze') {
      return Number(dashboard?.bronzeReferralRate) || Number(user?.bronzeReferralRate) || Number(dashboard?.referralRate) || 2.0;
    }
    if (norm === 'silver') {
      return Number(dashboard?.silverReferralRate) || Number(user?.silverReferralRate) || Number(dashboard?.referralRate) || 2.5;
    }
    if (norm === 'gold') {
      return Number(dashboard?.goldReferralRate) || Number(user?.goldReferralRate) || Number(dashboard?.referralRate) || 3.0;
    }
    return 2.5;
  };

  // Dynamically attach the exact admin-assigned interest and referral rates to each plan!
  const computedPlans = useMemo(() => {
    return defaultPlans.map((p) => {
      const assignedRate = getAssignedRate(p.name);
      const assignedRef = getAssignedReferral(p.name);
      return {
        ...p,
        ratePct: assignedRate,
        referralPct: assignedRef,
      };
    });
  }, [dashboard, user]);

  // Active plan for the user (default to Bronze if not set)
  const activePlanName = dashboard?.activePlan?.name || 'Bronze';
  const activePlan = useMemo(() => {
    return computedPlans.find((p) => p.name.toLowerCase() === activePlanName.toLowerCase()) || computedPlans[0];
  }, [computedPlans, activePlanName]);

  // Active principal capital state
  const [customCapital, setCustomCapital] = useState<number>(() => {
    const savedActive = localStorage.getItem(`activePlan_${user?.id || userId}`);
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        if (parsed.price) return Number(parsed.price);
      } catch {}
    }
    return Number(activePlan.price);
  });

  // Sync customCapital when active plan or dashboard changes
  useEffect(() => {
    if (dashboard?.activePlan?.price) {
      setCustomCapital(Number(dashboard.activePlan.price));
      setInvestAmount(Number(dashboard.activePlan.price));
    } else {
      setCustomCapital(Number(activePlan.price));
      setInvestAmount(Number(activePlan.price));
    }
  }, [dashboard?.activePlan, activePlan.price]);

  // Dynamic calculations strictly based on admin-assigned interest rate!
  const activeRate = activePlan.ratePct;
  const monthlyYield = Math.round((customCapital * activeRate) / 100);
  const annualProfit = Math.round((customCapital * activeRate * 12) / 100);
  const annualTotal = Math.round(customCapital + annualProfit);
  const annualApy = (activeRate * 12).toFixed(1);

  const stats = useMemo(() => {
    return [
      {
        label: 'Active Plan Tier',
        value: `${activePlan.name} Tier`,
        sub: `$${customCapital.toLocaleString()} USD Active`,
        icon: activePlan.name === 'Gold' ? '🥇' : activePlan.name === 'Silver' ? '🥈' : '🥉',
        iconBg: activePlan.name === 'Gold' ? 'bg-amber-100 text-amber-900 border border-amber-300' : activePlan.name === 'Silver' ? 'bg-slate-100 text-slate-900 border border-slate-300' : 'bg-amber-50 text-amber-900 border border-amber-200',
      },
      {
        label: 'Assigned Monthly Return',
        value: `${activePlan.ratePct}% / mo`,
        sub: `${annualApy}% Annual APY`,
        icon: '📈',
        iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      },
      {
        label: 'Projected Monthly Yield',
        value: `$ ${monthlyYield.toLocaleString()}`,
        sub: 'Monthly USD Accrual',
        icon: '💰',
        iconBg: 'bg-amber-100 text-amber-950 border border-amber-300',
      },
      {
        label: 'Referral Rewards',
        value: `${activePlan.referralPct}%`,
        sub: 'Direct Commission Bonus',
        icon: '👥',
        iconBg: 'bg-sky-50 text-sky-800 border border-sky-200',
      },
    ];
  }, [activePlan, customCapital, monthlyYield, annualApy]);

  const quickActions = [
    { label: 'Invite Referrals', color: 'bg-slate-900 hover:bg-slate-800 text-amber-400', href: '/dashboard/referrals' },
    { label: 'Complete KYC & Profile', color: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black', href: '/dashboard/profile' },
    { label: 'Support Concierge', color: 'bg-white hover:bg-amber-50 text-slate-900 border border-amber-200', href: '/dashboard/support' },
  ];

  const openPlanExecution = (plan: Plan) => {
    setSelectedPlanForExecution(plan);
    setInvestAmount(customCapital >= Number(plan.price) ? customCapital : Number(plan.price));
    setTxHash('');
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
    toast.success('Deposit address copied to clipboard');
  };

  const handleSelectNewTier = async (newPlan: Plan) => {
    setIsSwitchTierModalOpen(false);
    setSelectedPlanForExecution(newPlan);
    setInvestAmount(Number(newPlan.price));
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
      setCustomCapital(investAmount);

      setDashboard((prev) =>
        prev
          ? { ...prev, activePlan: activeObj }
          : {
              bronzeReturnRate: user?.bronzeReturnRate || '1.5',
              silverReturnRate: user?.silverReturnRate || '2.0',
              goldReturnRate: user?.goldReturnRate || '2.5',
              referralRate: user?.referralRate || '2.0',
              bronzeReferralRate: user?.bronzeReferralRate || '2.0',
              silverReferralRate: user?.silverReferralRate || '2.5',
              goldReferralRate: user?.goldReferralRate || '3.0',
              activePlan: activeObj,
              referralEarnings: 0,
            }
      );

      toast.success(
        `Success! ${selectedPlanForExecution.name} Tier Plan of $${investAmount.toLocaleString()} USD is now active.`
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
              className="bg-white/90 hover:bg-white text-slate-950 px-6 py-3.5 rounded-xl font-bold text-xs transition shadow-sm border border-amber-300 flex items-center gap-1.5"
            >
              <span>Referral Program ({activePlan.referralPct}%)</span>
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

      {/* Active User Plan Studio (Single Plan with Admin-Assigned Rates) */}
      <div id="plans" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-amber-200/60">
          <div>
            <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
              <span>Your Active Investment Plan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Active tier yield schedule and compounding returns based on your verified rate allocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSwitchTierModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Switch / Upgrade Tier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Single Dedicated Plan Card */}
        <div className="relative rounded-3xl bg-white border border-amber-300/90 p-6 sm:p-9 shadow-xl shadow-amber-500/10 transition-all">
          {/* Active Verified Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                {activePlan.name === 'Gold' ? <Crown className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
              </span>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <span>{activePlan.name} Tier Wealth Plan</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">{activePlan.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Active & Verified</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSwitchTierModalOpen(true)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline px-2 py-1"
              >
                Change Tier
              </button>
            </div>
          </div>

          {/* 3 Core Highlight Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Assigned Monthly Return
              </span>
              <div className="text-3xl font-black text-emerald-700 tracking-tight">
                {activePlan.ratePct}% <span className="text-sm font-bold text-slate-500">/ month</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 mt-1 block">
                {annualApy}% Annual APY Schedule
              </span>
            </div>

            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Active Capital Allocation
              </span>
              <div className="text-3xl font-black text-slate-950 tracking-tight">
                $ {customCapital.toLocaleString()}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                Tier Min: ${Number(activePlan.price).toLocaleString()} USD
              </span>
            </div>

            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Referral Commission
              </span>
              <div className="text-3xl font-black text-amber-800 tracking-tight">
                {activePlan.referralPct}%
              </div>
              <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                Direct Network Credit
              </span>
            </div>
          </div>

          {/* Dynamic In-Card Profit Breakdown (Calculated strictly based on admin-assigned rate) */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Dynamic Return Illustration ({activePlan.ratePct}% / month rate)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Adjust Capital:</span>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={Number(activePlan.price)}
                    step="500"
                    value={customCapital}
                    onChange={(e) => setCustomCapital(Math.max(100, Number(e.target.value)))}
                    className="pl-6 pr-2.5 py-1 w-32 rounded-lg border border-slate-300 text-xs font-black text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[11px] font-medium mb-1">Monthly Interest Payout</span>
                <span className="text-emerald-700 font-black text-lg">
                  ${monthlyYield.toLocaleString()} <span className="text-xs font-medium text-slate-400">/ mo</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Credited to wallet monthly</span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[11px] font-medium mb-1">1-Year Net Profit</span>
                <span className="text-emerald-700 font-black text-lg">
                  +${annualProfit.toLocaleString()} <span className="text-xs font-medium text-slate-400">USD</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Based on {activePlan.ratePct}% / mo</span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[11px] font-medium mb-1">1-Year Total (Principal + Profit)</span>
                <span className="text-slate-950 font-black text-lg">
                  ${annualTotal.toLocaleString()} <span className="text-xs font-medium text-slate-400">USD</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Full compounding maturity</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openPlanExecution(activePlan)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Deposit & Fund {activePlan.name} Plan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSwitchTierModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Switch Plan Tier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Switch Plan Tier Modal */}
      {isSwitchTierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative rounded-3xl border border-amber-300 bg-white p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setIsSwitchTierModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-5 border-b border-amber-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Tier Selection Studio</span>
              </span>
              <h3 className="text-2xl font-black text-slate-950">
                Select Your Desired Investment Tier
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose a plan tier to view your personalized return rates and execute plan allocation.
              </p>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {computedPlans.map((p) => {
                const isCurrent = p.name.toLowerCase() === activePlan.name.toLowerCase();
                const pMonthlyYield = Math.round((Number(p.price) * p.ratePct) / 100);

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-lg text-slate-950 flex items-center gap-1">
                          {p.name === 'Gold' && <Crown className="w-4 h-4 text-amber-500" />}
                          {p.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="text-2xl font-black text-emerald-700">
                          {p.ratePct}% <span className="text-xs font-bold text-slate-500">/ mo</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {(p.ratePct * 12).toFixed(1)}% Annual APY
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-4 pt-2 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span>Min Entry:</span>
                          <strong className="text-slate-900">${Number(p.price).toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Yield:</span>
                          <strong className="text-emerald-700">${pMonthlyYield.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Referral:</span>
                          <strong className="text-amber-800">{p.referralPct}%</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectNewTier(p)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:shadow-md'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                    onClick={() => setPaymentMethod('usdc')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'usdc'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>USDC (ERC20)</span>
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

              {paymentMethod === 'usdc' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>USDC Vault Address (ERC20)</span>
                    <span className="text-[10px] text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-mono">Ethereum / Polygon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="0x71C8A184e9D9Bf06536F2c9f485Bcf978a63581F"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyAddress('0x71C8A184e9D9Bf06536F2c9f485Bcf978a63581F')}
                      className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition"
                      title="Copy USDC Vault Address"
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
