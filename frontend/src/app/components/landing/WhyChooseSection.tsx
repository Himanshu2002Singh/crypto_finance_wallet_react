import {
  ShieldCheck,
  TrendingUp,
  Lock,
  Users,
  Zap,
  Headphones,
  Award,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const whyChooseFeatures = [
  {
    icon: Lock,
    title: 'Bank-Grade Cold Vault Custody',
    description: 'Assets are fortified with multi-signature architectures, 256-bit SSL encryption, and isolated cold storage vaults.',
    tag: 'Institutional Security',
    accent: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    icon: TrendingUp,
    title: 'Guaranteed Sustainable Yields',
    description: 'Predictable, compounding return schedules (1.5% to 2.5% monthly). Receive automated payouts straight to your investor portfolio.',
    tag: 'Algorithmic Yield',
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    icon: ShieldCheck,
    title: 'Automated Biometric KYC',
    description: 'Instant document scanning with Front ID, Back ID, and live facial matching ensure strict compliance and swift account activation.',
    tag: 'Regulatory Compliant',
    accent: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  {
    icon: Users,
    title: 'Transparent Referral Program',
    description: 'Earn direct commission bonuses up to 3.0% on every investor you onboard. Track registrations and payouts in real-time.',
    tag: 'Referral Rewards',
    accent: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    icon: Zap,
    title: 'Rapid Settlement Infrastructure',
    description: 'Enjoy seamless deposit credits and fast-track capital redemption pipelines with zero hidden administrative fees.',
    tag: 'Instant Liquidity',
    accent: 'text-yellow-800 bg-yellow-50 border-yellow-200'
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Wealth Concierge',
    description: 'Personalized account manager assistance, live ticketing, and technical guidance available around the clock.',
    tag: 'VIP Support',
    accent: 'text-cyan-800 bg-cyan-50 border-cyan-200'
  },
];

const platformMetrics = [
  { value: '₹250M+', label: 'Protected Portfolio Assets' },
  { value: '15,000+', label: 'Active Verified Investors' },
  { value: '99.98%', label: 'Custody & API Uptime' },
  { value: '100%', label: 'Cold Reserve Backing' },
];

export function WhyChooseSection() {
  return (
    <section id="why-us" className="py-24 bg-gradient-to-b from-white via-amber-50/20 to-white text-slate-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      <span id="how-it-works" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>The InvestPro Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Built for Institutional Trust & Consistent Returns
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We merge sophisticated algorithmic trading models with bank-grade custody so you can compound wealth with peace of mind.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl border border-amber-200/80 bg-white p-8 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${feature.accent}`}>
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-amber-700 transition">
                  {feature.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-800 transition">
                  <span>Institutional Standard</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Metrics Band */}
        <div className="mt-16 rounded-3xl border border-amber-200/80 bg-amber-50/60 p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-amber-200/70">
            {platformMetrics.map((metric, idx) => (
              <div key={idx} className={`text-center ${idx > 0 ? 'pt-6 lg:pt-0' : ''}`}>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
