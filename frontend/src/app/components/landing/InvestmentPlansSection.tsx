import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Check,
  Sparkles,
  ArrowRight,
  Crown,
  TrendingUp,
  ShieldCheck,
  Coins,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
}

interface TierMeta {
  tagline: string;
  badge: string;
  expectedReturn: string;
  referralBonus: string;
  monthlyRatePct: number;
  features: string[];
  border: string;
  headerBg: string;
  buttonColor: string;
  badgeColor: string;
  isPopular: boolean;
  illustration: {
    entryAmount: number;
    monthlyProfit: number;
    annualProfit: number;
    totalOneYear: number;
    annualPercentage: string;
  };
}

const planTiers: Record<string, TierMeta> = {
  Bronze: {
    tagline: 'Entry Wealth Foundation',
    badge: 'Starter Tier',
    expectedReturn: '1.5% / Month',
    referralBonus: '2.0% Commission',
    monthlyRatePct: 1.5,
    features: [
      'Daily algorithmic yield distribution',
      'Automated biometric verification',
      'Standard 24/7 client support desk',
      'Full capital redemption at maturity',
      'Transparent on-chain audit trails',
    ],
    border: 'border-amber-200/90 shadow-amber-900/5',
    headerBg: 'bg-amber-50/40',
    buttonColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200',
    isPopular: false,
    illustration: {
      entryAmount: 10000,
      monthlyProfit: 150,
      annualProfit: 1800,
      totalOneYear: 11800,
      annualPercentage: '18% APY',
    },
  },
  Silver: {
    tagline: 'Accelerated Compounding Strategy',
    badge: 'Most Popular',
    expectedReturn: '2.0% / Month',
    referralBonus: '2.5% Commission',
    monthlyRatePct: 2.0,
    features: [
      'Accelerated algorithmic return schedule',
      'Dedicated relationship concierge',
      '2.5% direct referral commission bonus',
      'Priority biometric KYC processing',
      'Monthly portfolio performance reports',
      'Express capital settlement pipeline',
    ],
    border: 'border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10',
    headerBg: 'bg-amber-50/70',
    buttonColor: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/25',
    badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    isPopular: true,
    illustration: {
      entryAmount: 25000,
      monthlyProfit: 500,
      annualProfit: 6000,
      totalOneYear: 31000,
      annualPercentage: '24% APY',
    },
  },
  Gold: {
    tagline: 'Executive VIP Private Wealth',
    badge: 'Crown VIP',
    expectedReturn: '2.5% / Month',
    referralBonus: '3.0% Commission',
    monthlyRatePct: 2.5,
    features: [
      'Maximum return rate allocation protocol',
      '3.0% direct referral commission rate',
      'Private 24/7 VIP concierge desk',
      'Zero platform withdrawal surcharge',
      'Direct executive portfolio consultation',
      'Priority cold-vault custody allocation',
    ],
    border: 'border-amber-300 shadow-amber-900/10',
    headerBg: 'bg-amber-50/60',
    buttonColor: 'bg-slate-900 hover:bg-slate-800 text-amber-400 font-black shadow-lg shadow-slate-900/15',
    badgeColor: 'bg-amber-100 text-amber-900 font-bold border border-amber-300',
    isPopular: false,
    illustration: {
      entryAmount: 50000,
      monthlyProfit: 1250,
      annualProfit: 15000,
      totalOneYear: 65000,
      annualPercentage: '30% APY',
    },
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

  return (
    <section id="plans" className="py-24 bg-gradient-to-b from-white via-amber-50/20 to-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Structured Yield Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Curated Wealth Tier Plans
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Select the tier aligned with your capital growth targets. Transparent fixed return rates (1.5% – 2.5% monthly), zero hidden deductions, and verified cold custody.
          </p>
        </div>

        {/* 3 Tier Cards Grid with Pixel-Perfect Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((plan) => {
            const meta = planTiers[plan.name as keyof typeof planTiers] || planTiers.Bronze;
            const isGold = plan.name === 'Gold';
            const priceNumber = Number(plan.price) || meta.illustration.entryAmount;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white border ${meta.border} p-7 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${
                  meta.isPopular ? 'md:-translate-y-2' : ''
                }`}
              >
                {/* Popular Pill */}
                {meta.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                    {meta.badge}
                  </div>
                )}

                <div>
                  {/* Tier Title Header (Fixed Min-Height for Consistent Vertical Alignment) */}
                  <div className="min-h-[58px]">
                    <div className="flex items-center justify-between">
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
                    <p className="text-xs text-slate-500 font-medium mt-1">{meta.tagline}</p>
                  </div>

                  {/* Initial Capital Entry Box (Strictly Aligned) */}
                  <div className="rounded-2xl bg-amber-50/40 p-5 mb-5 border border-amber-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-extrabold text-amber-900/80 uppercase tracking-wider">
                        Initial Capital Entry
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        Minimum
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 text-slate-950">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                        $ {priceNumber.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/ Minimum USD</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium text-[11px]">Assigned Yield</span>
                        <strong className="text-emerald-700 font-black text-sm">{meta.expectedReturn}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block font-medium text-[11px]">Referral Reward</span>
                        <strong className="text-amber-700 font-black text-sm">{meta.referralBonus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* In-Card Profit Illustration (Replaces separate profit calculator) */}
                  <div className="rounded-2xl bg-white p-4 mb-6 border border-amber-200/80 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2 pb-2 border-b border-amber-100">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                        <span>Profit Illustration</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        On ${priceNumber.toLocaleString()} USD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-amber-50/60 p-2.5 border border-amber-100">
                        <span className="text-slate-500 block text-[10px] font-semibold">Monthly Return</span>
                        <span className="text-emerald-700 font-black text-sm">
                          ${meta.illustration.monthlyProfit.toLocaleString()}
                          <span className="text-[10px] text-slate-500 font-medium"> / mo</span>
                        </span>
                      </div>
                      <div className="rounded-xl bg-amber-50/60 p-2.5 border border-amber-100">
                        <span className="text-slate-500 block text-[10px] font-semibold">1-Yr Total Net</span>
                        <span className="text-amber-800 font-black text-sm">
                          ${meta.illustration.totalOneYear.toLocaleString()}
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            (+${meta.illustration.annualProfit.toLocaleString()} profit)
                          </span>
                        </span>
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
                    to={user ? '/dashboard' : '/get-started'}
                    className={`w-full py-3.5 px-4 rounded-xl text-center text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${meta.buttonColor}`}
                  >
                    <span>{user ? `Select ${plan.name} in Dashboard` : `Start with ${plan.name}`}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {!user && (
                    <div className="mt-3 text-center">
                      <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 transition">
                        Existing partner? <span className="font-bold underline text-amber-700">Login</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassuring Security & Transparency Guarantee Footer */}
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-950">100% Principal Security Mandate</div>
              <div className="text-xs text-slate-600">
                All capital entries are backed by cold multi-sig vault reserves with automated daily accrual audits.
              </div>
            </div>
          </div>
          <Link
            to="/get-started"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition flex items-center gap-1.5"
          >
            <span>Open Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
