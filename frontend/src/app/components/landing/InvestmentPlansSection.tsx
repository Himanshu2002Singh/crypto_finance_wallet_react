import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Calculator,
  Crown,
  Award,
  Coins
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
}

const planTiers = {
  Bronze: {
    tagline: 'Entry Wealth Foundation',
    badge: 'Starter Tier',
    expectedReturn: '5.0% / Month',
    referralBonus: '2.0% Commission',
    features: [
      'Daily yield accrual into wallet',
      'Automated biometric verification',
      'Standard 24/7 support desk',
      'Instant capital redemption at term',
      'Complete transaction audit trails',
    ],
    border: 'border-slate-300',
    headerBg: 'bg-slate-100',
    buttonColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    badgeColor: 'bg-slate-200 text-slate-800',
    accentRing: 'focus:ring-slate-400',
    isPopular: false,
  },
  Silver: {
    tagline: 'Accelerated Compounding',
    badge: 'Most Popular',
    expectedReturn: '8.5% / Month',
    referralBonus: '3.5% Commission',
    features: [
      'Higher accelerated yield distribution',
      'Dedicated relationship manager',
      '3.5% enhanced referral tier bonus',
      'Priority biometric KYC processing',
      'Custom portfolio performance insights',
      'Express capital settlement pipeline',
    ],
    border: 'border-indigo-400 ring-2 ring-indigo-500/30',
    headerBg: 'bg-indigo-50/60',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25',
    badgeColor: 'bg-indigo-600 text-white',
    accentRing: 'focus:ring-indigo-400',
    isPopular: true,
  },
  Gold: {
    tagline: 'Executive VIP Private Wealth',
    badge: 'Crown VIP',
    expectedReturn: '12.0% / Month',
    referralBonus: '5.0% Commission',
    features: [
      'Maximum tier-1 return rate protocol',
      'Top-tier 5.0% network commission',
      'Private 24/7 VIP concierge line',
      'Zero platform withdrawal surcharge',
      'Direct executive portfolio consultation',
      'Unlimited referral tier unlocks',
    ],
    border: 'border-amber-400/80 shadow-amber-500/10',
    headerBg: 'bg-amber-50/60',
    buttonColor: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/25',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold',
    accentRing: 'focus:ring-amber-400',
    isPopular: false,
  },
};

const defaultPlans: Plan[] = [
  { id: 'bronze', name: 'Bronze', price: '10000' },
  { id: 'silver', name: 'Silver', price: '25000' },
  { id: 'gold', name: 'Gold', price: '50000' },
];

export function InvestmentPlansSection() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);

  // Interactive Yield Calculator State
  const [calcTier, setCalcTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');
  const [calcAmount, setCalcAmount] = useState<number>(50000);

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
    void loadPlans();
  }, []);

  const ratePercentages = {
    Bronze: 5.0,
    Silver: 8.5,
    Gold: 12.0,
  };

  const monthlyReturn = useMemo(() => {
    const rate = ratePercentages[calcTier];
    return Math.round((calcAmount * rate) / 100);
  }, [calcAmount, calcTier]);

  const dailyReturn = useMemo(() => {
    return Math.round(monthlyReturn / 30);
  }, [monthlyReturn]);

  const yearlyReturn = useMemo(() => {
    return monthlyReturn * 12;
  }, [monthlyReturn]);

  return (
    <section id="plans" className="py-24 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Yield Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Curated Wealth Tier Plans
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Select the tier aligned with your capital growth targets. Transparent fixed return rates, zero hidden deductions, and verified cold custody.
          </p>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan) => {
            const meta = planTiers[plan.name as keyof typeof planTiers] || planTiers.Bronze;
            const isGold = plan.name === 'Gold';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white border ${meta.border} p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${
                  meta.isPopular ? 'md:-translate-y-2' : ''
                }`}
              >
                {/* Popular Pill */}
                {meta.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    {meta.badge}
                  </div>
                )}

                <div>
                  {/* Tier Title & Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black text-slate-950 flex items-center gap-2">
                      {isGold && <Crown className="h-5 w-5 text-amber-500" />}
                      {plan.name} Tier
                    </span>
                    {!meta.isPopular && (
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.badgeColor}`}>
                        {meta.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-6">{meta.tagline}</p>

                  <div className="rounded-2xl bg-slate-50 p-5 mb-6 border border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Initial Capital Entry
                    </div>
                    <div className="mt-1 flex items-baseline gap-1 text-slate-950">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight">
                        ₹ {Number(plan.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/ Minimum</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Assigned Yield</span>
                        <strong className="text-emerald-600 font-black">{meta.expectedReturn}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-medium">Referral Reward</span>
                        <strong className="text-amber-600 font-black">{meta.referralBonus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included Privileges:
                    </div>
                    {meta.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div>
                  <Link
                    to={user ? '/dashboard/invest' : '/get-started'}
                    className={`w-full py-3.5 px-4 rounded-xl text-center text-sm font-black transition-all flex items-center justify-center gap-2 ${meta.buttonColor}`}
                  >
                    <span>{user ? 'Activate Plan in Dashboard' : `Start with ${plan.name}`}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {!user && (
                    <div className="mt-3 text-center">
                      <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 transition">
                        Existing partner? <span className="font-bold underline">Login</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Yield & Return Calculator */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 mb-2">
                <Calculator className="h-3.5 w-3.5" />
                <span>Yield Simulator</span>
              </div>
              <h3 className="text-2xl font-black text-slate-950">Interactive Profit Calculator</h3>
              <p className="text-xs text-slate-500 mt-1">
                Simulate your projected returns based on chosen tier yield schedules.
              </p>
            </div>

            {/* Tier Select Buttons */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 self-start md:self-auto">
              {(['Bronze', 'Silver', 'Gold'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setCalcTier(tier)}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition ${
                    calcTier === tier
                      ? 'bg-slate-900 text-amber-400 shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {tier} ({ratePercentages[tier]}%)
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Amount Slider & Presets */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Investment Principal Amount</label>
                  <span className="text-xl font-black text-slate-900">₹ {calcAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
                  <span>Min ₹10,000</span>
                  <span>₹250,000</span>
                  <span>Max ₹500,000</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Quick Amounts:</span>
                {[10000, 25000, 50000, 100000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcAmount(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                      calcAmount === amt
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Projected Returns Outcome Display */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-6 shadow-lg border border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center justify-between">
                <span>Estimated Returns Breakdown</span>
                <span>{ratePercentages[calcTier]}% APY Tier</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Daily Accrual</span>
                  <span className="text-base font-bold text-white">₹ {dailyReturn.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Monthly Compounding</span>
                  <span className="text-lg font-black text-amber-400">₹ {monthlyReturn.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-300 font-bold block">1-Year Projected Net</span>
                    <span className="text-[10px] text-slate-500">Principal + Accumulated Yield</span>
                  </div>
                  <span className="text-xl font-black text-emerald-400">
                    ₹ {(calcAmount + yearlyReturn).toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to="/get-started"
                className="mt-6 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <span>Lock In {calcTier} Plan Rates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
