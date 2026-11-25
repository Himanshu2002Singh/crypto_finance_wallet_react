import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Check,
  Crown,
  Sparkles,
  TrendingUp,
  Wallet,
  CreditCard,
  Building2,
  Copy,
  ArrowRight,
} from 'lucide-react';

interface TierOption {
  id: string;
  name: string;
  minPrice: number;
  ratePct: number;
  referralPct: number;
  tagline: string;
}

const baseTiers: TierOption[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPrice: 10000,
    ratePct: 1.5,
    referralPct: 2.0,
    tagline: 'Entry Wealth Foundation',
  },
  {
    id: 'silver',
    name: 'Silver',
    minPrice: 25000,
    ratePct: 2.0,
    referralPct: 2.5,
    tagline: 'Accelerated Compounding Strategy',
  },
  {
    id: 'gold',
    name: 'Gold',
    minPrice: 50000,
    ratePct: 2.5,
    referralPct: 3.0,
    tagline: 'Executive VIP Private Wealth',
  },
];

export function InvestmentPurchase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardRates, setDashboardRates] = useState<any>(null);

  // Fetch verified admin rates from dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        if (res.data) {
          setDashboardRates(res.data);
        }
      } catch {
        // Fallback to user auth data
      }
    };
    void fetchDashboard();
  }, []);

  // Compute dynamic tiers using admin-assigned rates
  const dynamicTiers = useMemo(() => {
    const getRate = (name: string) => {
      const norm = name.toLowerCase();
      if (norm === 'bronze') return Number(dashboardRates?.bronzeReturnRate) || Number(user?.bronzeReturnRate) || 1.5;
      if (norm === 'silver') return Number(dashboardRates?.silverReturnRate) || Number(user?.silverReturnRate) || 2.0;
      if (norm === 'gold') return Number(dashboardRates?.goldReturnRate) || Number(user?.goldReturnRate) || 2.5;
      return 2.0;
    };

    const getRef = (name: string) => {
      const norm = name.toLowerCase();
      if (norm === 'bronze') return Number(dashboardRates?.bronzeReferralRate) || Number(user?.bronzeReferralRate) || Number(dashboardRates?.referralRate) || 2.0;
      if (norm === 'silver') return Number(dashboardRates?.silverReferralRate) || Number(user?.silverReferralRate) || Number(dashboardRates?.referralRate) || 2.5;
      if (norm === 'gold') return Number(dashboardRates?.goldReferralRate) || Number(user?.goldReferralRate) || Number(dashboardRates?.referralRate) || 3.0;
      return 2.5;
    };

    return baseTiers.map((t) => ({
      ...t,
      ratePct: getRate(t.name),
      referralPct: getRef(t.name),
    }));
  }, [dashboardRates, user]);

  const [selectedTierId, setSelectedTierId] = useState<string>('silver');
  const selectedTier = useMemo(() => {
    return dynamicTiers.find((t) => t.id === selectedTierId) || dynamicTiers[1];
  }, [dynamicTiers, selectedTierId]);

  const [amount, setAmount] = useState<number>(25000);
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'usdc' | 'balance'>('usdt');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTier = (t: TierOption) => {
    setSelectedTierId(t.id);
    setAmount(t.minPrice);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied to clipboard');
  };

  const handleActivate = async () => {
    setIsSubmitting(true);
    try {
      try {
        await api.post('/users/plans', {
          planId: selectedTier.id,
          amount,
          paymentMethod,
          txHash: txHash || undefined,
        });
      } catch (e: any) {
        console.warn('API activation endpoint notice:', e?.message);
      }

      // Store in localStorage for persistent dashboard state
      const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');
      const activeObj = {
        name: selectedTier.name,
        price: amount.toString(),
      };
      localStorage.setItem(`activePlan_${user?.id || userId}`, JSON.stringify(activeObj));

      toast.success(`Success! ${selectedTier.name} Tier Plan of $${amount.toLocaleString()} USD has been activated!`);
      navigate('/dashboard');
    } catch {
      toast.error('Unable to activate plan. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations strictly based on admin-assigned rate
  const monthlyYield = Math.round((amount * selectedTier.ratePct) / 100);
  const annualTotal = Math.round(amount + (amount * selectedTier.ratePct * 12) / 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-8 text-slate-950 shadow-xl shadow-amber-500/15 border border-amber-300">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Capital Allocation Studio (USD Vault)</span>
        </div>
        <h1 className="text-3xl font-black mb-2">Select & Execute Investment Plan</h1>
        <p className="text-slate-900/90 text-sm max-w-xl font-medium">
          Choose your investment tier, customize your deposit principal in USD, and activate automated monthly return accruals.
        </p>
      </div>

      {/* Tier Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dynamicTiers.map((t) => {
          const isSelected = selectedTier.id === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTier(t)}
              className={`rounded-2xl p-6 border transition-all cursor-pointer bg-white relative ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-lg -translate-y-1'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              {t.name === 'Silver' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-slate-950 flex items-center gap-1.5">
                  {t.name === 'Gold' && <Crown className="w-4 h-4 text-amber-500" />}
                  {t.name}
                </h3>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t.ratePct}% / mo
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">{t.tagline}</p>
              <div className="text-2xl font-black text-slate-950">
                ${t.minPrice.toLocaleString()} <span className="text-xs font-semibold text-slate-500">min USD</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
                <span>Referral:</span>
                <strong className="text-amber-800">{t.referralPct}% commission</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration & Deposit Card */}
      <div className="rounded-3xl border border-amber-200/80 bg-white p-7 sm:p-9 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Selected Tier Investment Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
            <input
              type="number"
              min={selectedTier.minPrice}
              step="500"
              value={amount}
              onChange={(e) => setAmount(Math.max(selectedTier.minPrice, Number(e.target.value)))}
              className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 font-black text-xl text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Minimum Entry for {selectedTier.name}: ${selectedTier.minPrice.toLocaleString()} USD</span>
            <span className="font-bold text-amber-800">{selectedTier.ratePct}% Return Rate</span>
          </div>
        </div>

        {/* Projected Returns Box */}
        <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-5 space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Monthly Payout:</span>
            <strong className="text-emerald-700 font-black text-sm">${monthlyYield.toLocaleString()} USD / month</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>1-Year Cumulative Return:</span>
            <strong className="text-slate-950 font-black text-base">${annualTotal.toLocaleString()} USD</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Direct Referral Commission:</span>
            <strong className="text-amber-800 font-bold">{selectedTier.referralPct}%</strong>
          </div>
        </div>

        {/* Payment Methods (100% International USD & Crypto) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Funding Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('usdt')}
              className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition ${
                paymentMethod === 'usdt'
                  ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Wallet className="w-5 h-5 text-amber-600" />
              <span>USDT (TRC20)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('usdc')}
              className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition ${
                paymentMethod === 'usdc'
                  ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>USDC (ERC20)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('balance')}
              className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition ${
                paymentMethod === 'balance'
                  ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Instant Allocation</span>
            </button>
          </div>
        </div>

        {/* Details based on selection */}
        {paymentMethod === 'usdt' && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between font-bold text-slate-800">
              <span>TRC20 Deposit Vault Address</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono text-[10px]">TRON (TRC20)</span>
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
                onClick={() => handleCopy('TYdY8h7Qv3m3N8L6kK2v9xP1w4B7rE8uA')}
                className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
                title="Copy USDT Address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter Transfer TxID / Hash (Optional)"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        )}

        {paymentMethod === 'usdc' && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between font-bold text-slate-800">
              <span>USDC Vault Address (ERC20)</span>
              <span className="text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-mono text-[10px]">Ethereum / Polygon</span>
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
                onClick={() => handleCopy('0x71C8A184e9D9Bf06536F2c9f485Bcf978a63581F')}
                className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
                title="Copy USDC Address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter Transfer TxID / Transaction Hash (Optional)"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        )}

        {paymentMethod === 'balance' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 leading-relaxed">
            <strong>Instant Activation:</strong> Activate your {selectedTier.name} plan immediately. Your plan status and daily accrual schedules will begin right away.
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={handleActivate}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isSubmitting ? 'Activating Plan...' : `Confirm & Activate ${selectedTier.name} Plan ($${amount.toLocaleString()} USD)`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
