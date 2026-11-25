import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-amber-100/40 text-slate-900 border-t border-amber-200/70">
      {/* Dynamic Glow Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-300/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Instant Private Onboarding</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Ready to Elevate Your Capital With{' '}
          <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            InvestPro?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join high-net-worth investors earning predictable compounding returns through structured digital yield protocols and dedicated cold-vault custody.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/get-started"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-8 py-4 rounded-xl font-black text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Create Your Investor Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 border border-amber-200/90 bg-white hover:bg-amber-50 text-slate-900 px-7 py-4 rounded-xl font-bold text-base transition shadow-sm"
          >
            <span>Existing Client Portal</span>
          </Link>
        </div>

        {/* Security badges under button */}
        <div className="mt-10 pt-8 border-t border-amber-200/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Fast 1-Minute Sign Up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>No KYC Needed on Sign Up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Zero Hidden Management Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
