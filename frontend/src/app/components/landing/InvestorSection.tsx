import { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Users,
  Coins,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const investorTabs = [
  {
    id: 'custody',
    label: 'Capital Custody & Security',
    icon: Lock,
    title: 'Cold-Vault Multi-Sig Reserve Infrastructure',
    description:
      'Client capital is safeguarded across geographically distributed, multi-signature cold storage vaults. No individual officer or automated server retains unilateral private key control.',
    stats: [
      { label: 'Custody Architecture', value: 'Multi-Sig MPC' },
      { label: 'Cold Reserve Segregation', value: '100% Backed' },
      { label: 'Asset Protection Layer', value: '256-Bit SSL/HSM' },
    ],
    bullets: [
      'Multi-party computation (MPC) key-sharding preventing single-point vulnerability',
      'Daily automated treasury asset-liability balance reconciliations',
      'Zero rehypothecation of investor capital',
    ],
  },
  {
    id: 'strategy',
    label: 'Algorithmic Yield Mandate',
    icon: TrendingUp,
    title: 'Market-Neutral Yield & Systematic Compounding',
    description:
      'Returns are generated through disciplined triangular arbitrage, liquidity pool provisioning, and quantitative hedging rather than speculative directional betting.',
    stats: [
      { label: 'Return Range', value: '1.5% - 2.5% / Mo' },
      { label: 'Accrual Frequency', value: 'Daily Automated' },
      { label: 'Volatility Exposure', value: 'Strictly Delta-Neutral' },
    ],
    bullets: [
      'Pre-determined fixed tier yield structures (1.5% Bronze, 2.0% Silver, 2.5% Gold)',
      'Automated daily interest crediting visible on personal dashboard',
      'Principal capital preservation protocols at all market stages',
    ],
  },
  {
    id: 'referrals',
    label: 'Direct Referral Program',
    icon: Users,
    title: 'Transparent, Direct Single-Tier Referral Incentives',
    description:
      'We operate a direct, verifiable referral program. Introduce investors to InvestPro and earn clear commission bonuses (2.0% to 3.0%) on every activated plan with real-time tracking.',
    stats: [
      { label: 'Program Type', value: 'Direct Referral' },
      { label: 'Commission Rate', value: '2.0% - 3.0%' },
      { label: 'Payout Settlement', value: 'Instant on Activation' },
    ],
    bullets: [
      'No complicated multi-level schemes — 100% direct, auditable referral commissions',
      'Unique referral code and invitation link generated for every investor',
      'Real-time dashboard reporting of referred accounts and credited rewards',
    ],
  },
  {
    id: 'governance',
    label: 'Governance & Compliance',
    icon: FileCheck2,
    title: 'Institutional Auditability & Identity Standards',
    description:
      'InvestPro adheres to rigorous compliance benchmarks including automated biometric identity verification, transparent ledgers, and zero hidden administrative surcharges.',
    stats: [
      { label: 'KYC Standard', value: 'Government ID & Biometric' },
      { label: 'Platform Surcharge', value: '0% Hidden Fees' },
      { label: 'Audit Trail', value: '100% Immutable' },
    ],
    bullets: [
      'Fast onboarding with comprehensive profile verification',
      'Complete downloadable transaction ledgers and audit records',
      'Dedicated relationship concierge for portfolio support',
    ],
  },
];

export function InvestorSection() {
  const [activeTab, setActiveTab] = useState('custody');
  const currentTab = investorTabs.find((t) => t.id === activeTab) || investorTabs[0];

  return (
    <section id="investor" className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-slate-900 py-24 relative overflow-hidden border-y border-amber-200/60">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-amber-600" />
            <span>Institutional Standards & Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Investor Relations & Governance
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Essential operational data, risk controls, and capital governance standards for discerning institutional and individual partners.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {investorTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white border border-amber-200/80 text-slate-700 hover:bg-amber-50/70 hover:border-amber-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Card */}
        <div className="rounded-3xl border border-amber-200/80 bg-white p-7 sm:p-10 shadow-xl shadow-amber-900/5 mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-extrabold uppercase tracking-wider border border-amber-200">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Verified Mandate</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
                {currentTab.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentTab.description}
              </p>

              <div className="space-y-3 pt-2">
                {currentTab.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition"
                >
                  <span>Open An Investor Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Quantitative Highlights Box */}
            <div className="lg:col-span-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 p-6 space-y-4">
              <div className="text-xs font-bold text-amber-900/80 uppercase tracking-wider pb-3 border-b border-amber-200/60">
                Performance & Structural Key Metrics
              </div>
              <div className="space-y-3.5">
                {currentTab.stats.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-100 shadow-sm">
                    <span className="text-xs font-medium text-slate-600">{s.label}</span>
                    <span className="text-sm font-black text-slate-950">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[11px] text-slate-500 leading-relaxed italic text-center">
                Audited data parameters governed by continuous risk parameters and cold-reserve safeguards.
              </div>
            </div>
          </div>
        </div>

        {/* Global Investor Platform Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-amber-200/70 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-slate-950">₹250M+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Capital Under Custody</div>
          </div>
          <div className="rounded-2xl bg-white border border-amber-200/70 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-slate-950">15,000+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Verified Client Accounts</div>
          </div>
          <div className="rounded-2xl bg-white border border-amber-200/70 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">100%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Proof of Reserves (PoR)</div>
          </div>
          <div className="rounded-2xl bg-white border border-amber-200/70 p-5 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-amber-700">0%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Hidden Surcharges</div>
          </div>
        </div>
      </div>
    </section>
  );
}
