import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Lock,
  BarChart2,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface CryptoPriceItem {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const defaultCryptoPrices: CryptoPriceItem[] = [
  { symbol: 'BTC/USDT', price: '$59,380.00', change: '+2.45%', positive: true },
  { symbol: 'ETH/USDT', price: '$1,658.50', change: '+1.80%', positive: true },
  { symbol: 'SOL/USDT', price: '$69.45', change: '+3.15%', positive: true },
  { symbol: 'VIP YIELD', price: 'Up to 30.0%', change: 'Fixed APY', positive: true },
];

export function HeroSection() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPriceItem[]>(defaultCryptoPrices);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLivePrices = async () => {
      try {
        // Try fetching live rates from public Binance 24hr ticker
        const response = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22]'
        );
        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data) && isMounted) {
          const btc = data.find((d: any) => d.symbol === 'BTCUSDT');
          const eth = data.find((d: any) => d.symbol === 'ETHUSDT');
          const sol = data.find((d: any) => d.symbol === 'SOLUSDT');

          const formatPrice = (val: string | number) => {
            const num = Number(val);
            return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          };

          const formatChange = (val: string | number) => {
            const num = Number(val);
            const sign = num >= 0 ? '+' : '';
            return `${sign}${num.toFixed(2)}%`;
          };

          const updated: CryptoPriceItem[] = [
            {
              symbol: 'BTC/USDT',
              price: btc ? formatPrice(btc.lastPrice) : '$59,380.00',
              change: btc ? formatChange(btc.priceChangePercent) : '+2.45%',
              positive: btc ? Number(btc.priceChangePercent) >= 0 : true,
            },
            {
              symbol: 'ETH/USDT',
              price: eth ? formatPrice(eth.lastPrice) : '$1,658.50',
              change: eth ? formatChange(eth.priceChangePercent) : '+1.80%',
              positive: eth ? Number(eth.priceChangePercent) >= 0 : true,
            },
            {
              symbol: 'SOL/USDT',
              price: sol ? formatPrice(sol.lastPrice) : '$69.45',
              change: sol ? formatChange(sol.priceChangePercent) : '+3.15%',
              positive: sol ? Number(sol.priceChangePercent) >= 0 : true,
            },
            {
              symbol: 'VIP YIELD',
              price: 'Up to 30.0%',
              change: 'Fixed APY',
              positive: true,
            },
          ];

          setCryptoPrices(updated);
          setIsLive(true);
        }
      } catch {
        // Fallback gracefully to verified accurate baseline prices
        if (isMounted) {
          setCryptoPrices(defaultCryptoPrices);
        }
      }
    };

    void fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const scrollToPlans = () => {
    const el = document.getElementById('plans');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 text-slate-900 pt-28 pb-12">
      {/* Dynamic Background Glow & Ambient Luxury Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-yellow-300/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-10 left-10 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b08_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-300/80 shadow-sm backdrop-blur-md text-xs font-semibold text-slate-800">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-800 font-extrabold">InvestPro 2.0</span>
              <span className="text-amber-300">|</span>
              <span className="text-slate-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Institutional-Grade Digital Wealth Engine
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              Grow Your Wealth With{' '}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Institutional Precision
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join thousands of discerning investors earning steady, algorithmic returns with cold-vault custody, verifiable portfolio management, and customized yield strategies.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/get-started"
                className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-8 py-4 rounded-xl font-black text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Investing Today</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={scrollToPlans}
                className="inline-flex items-center justify-center gap-2 border border-amber-200/90 bg-white hover:bg-amber-50/80 text-slate-900 px-7 py-4 rounded-xl font-bold text-base transition shadow-sm hover:border-amber-300 cursor-pointer"
              >
                <BarChart2 className="h-4 w-4 text-amber-600" />
                <span>Explore Verified Plans</span>
              </button>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>256-Bit SSL Cold Custody</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Instant Daily Accruals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Transparent Plan Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D-styled Executive Portfolio Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-400/25 via-yellow-400/20 to-amber-300/20 blur-xl opacity-80" />

              {/* Main Luxury Glass Card */}
              <div className="relative rounded-3xl border border-amber-200/80 bg-white/95 p-6 sm:p-7 shadow-2xl shadow-amber-900/10 backdrop-blur-xl">
                {/* Header inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black shadow-md shadow-amber-500/20">
                      I
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-900/70 uppercase tracking-wider">InvestPro Portfolio</div>
                      <div className="text-sm font-black text-slate-900">VIP Wealth Account</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Activity className="h-3 w-3" />
                    Live Yielding
                  </span>
                </div>

                {/* Portfolio Balance & Growth */}
                <div className="my-5">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Portfolio Balance</div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">₹ 2,450,000</span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      +24.0% APY
                    </span>
                  </div>
                </div>

                {/* Growth Chart Wave */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 mb-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                    <span>Performance Trajectory</span>
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Compounding
                    </span>
                  </div>
                  <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60" fill="none">
                    <defs>
                      <linearGradient id="chartGoldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 50 Q 40 45, 80 35 T 160 25 T 230 18 T 300 8 L 300 60 L 0 60 Z"
                      fill="url(#chartGoldGradient)"
                    />
                    <path
                      d="M0 50 Q 40 45, 80 35 T 160 25 T 230 18 T 300 8"
                      stroke="#d97706"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Active Tier Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3">
                    <div className="text-[11px] font-bold text-slate-500">Selected Tier</div>
                    <div className="text-sm font-black text-amber-900 mt-0.5 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Silver Plan
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-3">
                    <div className="text-[11px] font-bold text-slate-500">Referral Commission</div>
                    <div className="text-sm font-black text-emerald-800 mt-0.5">
                      2.5% Commission
                    </div>
                  </div>
                </div>

                {/* Security Tagline footer */}
                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-700" />
                    Biometric Vault Custody
                  </span>
                  <span className="text-slate-700 font-semibold">100% Reserve Backed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market & Asset Ticker Strip */}
      <div className="relative z-10 border-t border-amber-200/70 bg-white/95 backdrop-blur-md mt-10 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2 sm:hidden text-[11px] font-bold text-slate-500">
            <span>Market Ticker</span>
            {isLive && <span className="text-emerald-600 font-semibold flex items-center gap-1">● Live Rates</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-center">
            {cryptoPrices.map((crypto) => (
              <div
                key={crypto.symbol}
                className="flex items-center justify-between sm:justify-center sm:gap-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 hover:border-amber-300 transition"
              >
                <span className="text-xs font-bold text-slate-700">{crypto.symbol}</span>
                <span className="text-xs font-black text-slate-950 font-mono">{crypto.price}</span>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    crypto.positive
                      ? 'text-emerald-700 bg-emerald-100/80 border border-emerald-200'
                      : 'text-rose-700 bg-rose-100/80 border border-rose-200'
                  }`}
                >
                  {crypto.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
