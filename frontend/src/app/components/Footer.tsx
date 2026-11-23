import { useState } from 'react';
import { Facebook, Twitter, Linkedin, X, Shield, FileText, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Why InvestPro', sectionId: 'why-us' },
  { label: 'Tier Plans', sectionId: 'plans' },
  { label: 'Investor Profile', sectionId: 'investor' },
  { label: 'Intelligence Desk', sectionId: 'blogs' },
  { label: 'FAQs', sectionId: 'faq' },
];

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const handleLinkClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800/80">
          {/* Brand & Socials */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                I
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-black tracking-tight flex items-center gap-1">
                  Invest<span className="text-amber-400">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Institutional Wealth & Digital Custody
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Next-generation digital wealth management engine. Delivering predictable compounding returns through structured tier plans, biometric KYC, and cold vault reserve custody.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro Facebook"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro Twitter"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Platform Navigation</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.sectionId)}
                    className="text-slate-400 hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Custody & Compliance</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('faq')}
                  className="text-slate-400 hover:text-white transition cursor-pointer text-left"
                >
                  Help Desk & FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="text-slate-400 hover:text-white transition cursor-pointer text-left"
                >
                  Biometric Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="text-slate-400 hover:text-white transition cursor-pointer text-left"
                >
                  Institutional Terms of Service
                </button>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-slate-500 hover:text-amber-400 transition text-left inline-flex items-center gap-1.5 pt-2"
                >
                  <Lock className="h-3 w-3" />
                  <span>Admin & Compliance Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-8 space-y-4 text-xs text-slate-500 leading-relaxed">
          <p>
            <strong>Risk Notice:</strong> Digital asset investments and structured cryptocurrency yield products involve market volatility and capital risk. Past returns are illustrative and rate tiers are assigned upon compliance review. Please consult an independent wealth advisor before participating.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-900 text-slate-400">
            <p>© {new Date().getFullYear()} InvestPro Platform. All Rights Reserved.</p>
            <p>
              Engineered with Precision by{' '}
              <a
                href="https://www.trustingbrains.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 transition font-bold"
              >
                TrustingBrains
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black">Biometric & Identity Privacy Policy</h3>
            </div>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                At InvestPro, we respect your privacy and are committed to safeguarding personal, biometric, and
                financial data collected through our onboarding, account management, and investment services.
              </p>
              <h4 className="font-bold text-slate-900">1. Information We Collect</h4>
              <p>
                We collect your full name, email address, phone number, country of residence, government-issued ID proofs
                (Front and Back), and live biometric facial photographs strictly for KYC compliance.
              </p>
              <h4 className="font-bold text-slate-900">2. Security and Cold Vault Protection</h4>
              <p>
                We implement 256-bit SSL encryption, tokenized authentication, and isolated Cloudinary storage vaults
                ensuring all records are guarded against unauthorized digital extraction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black">Institutional Terms of Service</h3>
            </div>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                By registering with InvestPro, you agree to comply with platform compliance rules, tier specifications,
                and digital asset custody policies.
              </p>
              <h4 className="font-bold text-slate-900">1. Account Activation</h4>
              <p>
                Account approval is granted following document verification by compliance officers. Rate yields are fixed
                per tier and visible in real time on your dashboard.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
