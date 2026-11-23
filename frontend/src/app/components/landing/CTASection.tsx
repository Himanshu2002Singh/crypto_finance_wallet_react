import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Glow Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Instant Private Onboarding</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Ready to Elevate Your Capital With{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            InvestPro?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join high-net-worth investors earning predictable compounding returns through structured digital yield protocols and dedicated custody.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/get-started"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-8 py-4 rounded-xl font-black text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5"
          >
            <span>Create Your Investor Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white px-7 py-4 rounded-xl font-bold text-base transition backdrop-blur-md"
          >
            <span>Existing Client Portal</span>
          </Link>
        </div>

        {/* Security badges under button */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Fast 2-Minute Form</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Biometric ID Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Hidden Management Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
