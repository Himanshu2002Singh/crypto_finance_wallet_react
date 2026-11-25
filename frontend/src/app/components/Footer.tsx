import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, X, Shield, FileText, Sparkles, Lock, CheckCircle2, Send, Clock, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Why InvestZora', sectionId: 'why-us' },
  { label: 'Tier Plans', sectionId: 'plans' },
  { label: 'For Investors', sectionId: 'investor' },
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
    <footer className="bg-slate-50 text-slate-700 pt-20 pb-10 border-t border-amber-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-amber-200/60">
          {/* Brand & Socials */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl shadow-md shadow-amber-500/20">
                I
              </div>
              <div className="flex flex-col">
                <span className="text-slate-950 text-xl font-black tracking-tight flex items-center gap-1">
                  Invest<span className="text-amber-600">Zora</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Institutional Wealth & Digital Custody (USD)
                </span>
              </div>
            </Link>

            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Next-generation digital asset wealth engine denominated in USD. Delivering transparent compounding returns through structured tier plans, biometric KYC, and cold vault reserve custody.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/investzora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestZora Facebook"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-amber-400 flex items-center justify-center text-slate-600 hover:text-amber-600 transition shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://x.com/investzora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestZora Twitter (X)"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-amber-400 flex items-center justify-center text-slate-600 hover:text-amber-600 transition shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/investzora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestZora Instagram"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-amber-400 flex items-center justify-center text-slate-600 hover:text-pink-600 transition shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/company/investzora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestZora LinkedIn"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-amber-400 flex items-center justify-center text-slate-600 hover:text-blue-700 transition shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Client Support Desk</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Support team responds within <strong>24–48 hours</strong>. Direct call lines are closed; official Telegram channel access coming soon!
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">Platform Navigation</h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              {quickLinks.map((link) => (
                <li key={link.sectionId}>
                  <button
                    onClick={() => handleLinkClick(link.sectionId)}
                    className="text-slate-600 hover:text-amber-700 transition cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Compliance Column */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">Custody & Compliance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Global client reserves are held strictly in USD and major digital assets with 100% cold vault segregation.
            </p>

            <div className="space-y-2 pt-1 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Automated Biometric KYC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero Hidden Custody Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Support Inquiries: Responds within 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <Send className="h-4 w-4 text-sky-600" />
                <span className="font-semibold">Official Telegram Community: Coming Soon</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-500">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-amber-700 transition cursor-pointer underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-amber-700 transition cursor-pointer underline"
              >
                Terms of Protocol
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            &copy; {new Date().getFullYear()} InvestZora Platform. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Design and Development by trustingbrain
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black mb-3">Privacy & Identity Policy</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              InvestPro strictly protects all investor personal identifiers and identity documents. Encrypted records are stored in isolated vault architectures with zero third-party data monetization.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black mb-3">Terms of Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All yield distributions are calculated per plan schedule parameters. Capital redemptions follow transparent tier settlement rules.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
