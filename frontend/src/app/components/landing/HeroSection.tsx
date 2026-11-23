import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Lock,
  Zap,
  BarChart2,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';

const cryptoPrices = [
  { symbol: 'BTC/USDT', price: '$96,840.50', change: '+4.25%', positive: true },
  { symbol: 'ETH/USDT', price: '$3,620.10', change: '+3.15%', positive: true },
  { symbol: 'SOL/USDT', price: '$224.80', change: '+6.90%', positive: true },
  { symbol: 'VIP YIELD', price: 'Up to 18.0%', change: 'Fixed APY', positive: true },
];

export function HeroSection() {
  const scrollToPlans = () => {
    const el = document.getElementById('plans');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-white pt-28 pb-16">
      {/* Dynamic Background Glow & Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-10 left-10 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
        {/* Subtle grid lines pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner backdrop-blur-md text-xs font-semibold text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-amber-400 font-bold">InvestPro 2.0</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Institutional-Grade Digital Wealth Engine
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Grow Your Wealth With{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Institutional Precision
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join thousands of discerning investors earning steady, algorithmic returns with cold-vault custody, automated biometric KYC, and customized tier yield strategies.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/get-started"
                className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-8 py-4 rounded-xl font-black text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition transform hover:-translate-y-0.5"
              >
                <span>Start Investing Today</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={scrollToPlans}
                className="inline-flex items-center justify-center gap-2 border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-white px-7 py-4 rounded-xl font-bold text-base transition backdrop-blur-md hover:border-slate-600 cursor-pointer"
              >
                <BarChart2 className="h-4 w-4 text-amber-400" />
                <span>Explore Verified Plans</span>
              </button>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>256-Bit SSL Cold Custody</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Instant Daily Accruals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Transparent Tier Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D-styled Executive Portfolio Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 to-purple-600/30 blur-xl opacity-70 group-hover:opacity-100 transition" />

              {/* Main Glass Card */}
              <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900/85 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                {/* Header inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black shadow-md shadow-amber-500/20">
                      I
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">InvestPro Portfolio</div>
                      <div className="text-sm font-black text-white">VIP Wealth Account</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="h-3 w-3" />
                    Live Yielding
                  </span>
                </div>

                {/* Portfolio Balance & Growth */}
                <div className="my-5">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Portfolio Balance</div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">₹ 2,450,000</span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      +18.4%
                    </span>
                  </div>
                </div>

                {/* Simulated Growth Chart Wave */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 mb-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                    <span>Performance Trajectory</span>
                    <span className="text-amber-400 font-bold">Compounding</span>
                  </div>
                  <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60" fill="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 50 Q 40 45, 80 35 T 160 25 T 230 18 T 300 8 L 300 60 L 0 60 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0 50 Q 40 45, 80 35 T 160 25 T 230 18 T 300 8"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Active Tier Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-slate-800/90 bg-slate-800/40 p-3">
                    <div className="text-[11px] font-bold text-slate-400">Selected Tier</div>
                    <div className="text-sm font-black text-amber-400 mt-0.5 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Gold Royal VIP
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800/90 bg-slate-800/40 p-3">
                    <div className="text-[11px] font-bold text-slate-400">Referral Commission</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      Up to 5.0% Tier
                    </div>
                  </div>
                </div>

                {/* Security Tagline footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-slate-500" />
                    Automated Biometric KYC
                  </span>
                  <span className="text-slate-300 font-semibold">100% Reserve Backed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market & Asset Ticker Strip */}
      <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md mt-12 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {cryptoPrices.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center justify-between sm:justify-center sm:gap-3 p-2 rounded-lg bg-slate-900/40 border border-slate-800/50">
                <span className="text-xs font-bold text-slate-300">{crypto.symbol}</span>
                <span className="text-xs font-black text-white">{crypto.price}</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
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
