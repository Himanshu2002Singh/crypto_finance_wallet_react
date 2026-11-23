import {
  ShieldCheck,
  TrendingUp,
  Lock,
  Users,
  Zap,
  Headphones,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const whyChooseFeatures = [
  {
    icon: Lock,
    title: 'Bank-Grade Cold Vault Custody',
    description: 'Assets are fortified with multi-signature architectures, 256-bit SSL encryption, and isolated cold storage vaults.',
    tag: 'Institutional Security',
    accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Guaranteed Tier Yields',
    description: 'Predictable, compounding return schedules assigned by tier. Receive automated payouts straight to your investor portfolio.',
    tag: 'Algorithmic Yield',
    accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: ShieldCheck,
    title: 'Automated Biometric KYC',
    description: 'Instant document scanning with Front ID, Back ID, and live facial matching ensure strict compliance and swift account activation.',
    tag: 'Regulatory Compliant',
    accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: Users,
    title: 'Transparent Referral Network',
    description: 'Earn generous bonuses up to 5.0% on every investor you onboard. Track registrations and payouts in real-time.',
    tag: 'Network Growth',
    accent: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  },
  {
    icon: Zap,
    title: 'Rapid Settlement Infrastructure',
    description: 'Enjoy seamless deposit credits and fast-track capital redemption pipelines with zero hidden administrative fees.',
    tag: 'Instant Liquidity',
    accent: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Wealth Concierge',
    description: 'Personalized account manager assistance, live ticketing, and technical guidance available around the clock.',
    tag: 'VIP Support',
    accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
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
    <section id="why-us" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <span id="how-it-works" className="absolute -top-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The InvestPro Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Engineered for High-Net-Worth Confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            We bridge institutional discipline with decentralized wealth opportunities. Experience security, predictability, and elite service at every step.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-800 bg-slate-950/70 p-7 transition-all duration-300 hover:border-slate-700 hover:bg-slate-950 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
              >
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${feature.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Platform Stat Strip */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
            {platformMetrics.map((stat, i) => (
              <div key={i} className={`pt-4 md:pt-0 ${i !== 0 ? 'md:pl-6' : ''}`}>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
