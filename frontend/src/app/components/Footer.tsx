import { useState } from 'react';
import { Facebook, Twitter, Linkedin, X, Shield, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Plans', sectionId: 'plans' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Investor', sectionId: 'investor' },
  { label: 'Blogs', sectionId: 'blogs' },
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
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Socials */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="text-2xl font-bold">InvestPro</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in cryptocurrency investment. Build wealth with our proven
              investment strategies and secure platform.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro Facebook"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition text-gray-300 hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro Twitter"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition text-gray-300 hover:text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="InvestPro LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition text-gray-300 hover:text-white"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.sectionId)}
                    className="text-gray-400 hover:text-white transition cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support & Legal</h3>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('faq')}
                  className="text-gray-400 hover:text-white transition cursor-pointer text-left"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@investpro.com"
                  className="text-gray-400 hover:text-white transition text-left"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="text-gray-400 hover:text-white transition cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="text-gray-400 hover:text-white transition cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
          <p>© 2026 InvestPro. All Rights Reserved.</p>
          <p>
            Designed and Developed by{' '}
            <a
              href="https://www.trustingbrains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition font-medium"
            >
              TrustingBrains
            </a>
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-2xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Privacy Policy</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                At InvestPro, we respect your privacy and are committed to safeguarding personal and
                financial data collected through our onboarding, account management, and investment
                services.
              </p>
              <h4 className="font-semibold text-gray-800">1. Information We Collect</h4>
              <p>
                We collect your name, email address, phone number, country of residence, and
                verification details when you submit an interest registration or complete your
                investor profile.
              </p>
              <h4 className="font-semibold text-gray-800">2. How We Use Information</h4>
              <p>
                Collected information is used exclusively to facilitate onboarding, verify investor
                eligibility, provide rate calculations, and maintain regulatory compliance.
              </p>
              <h4 className="font-semibold text-gray-800">3. Security and Protection</h4>
              <p>
                We implement industry-standard encryption protocols (SSL/TLS), secure token-based
                authentication, and partitioned storage to ensure user records remain private and
                protected from unauthorized access.
              </p>
              <h4 className="font-semibold text-gray-800">4. Contact Inquiries</h4>
              <p>
                If you have questions regarding your data or wish to exercise privacy rights, please
                reach out directly to our compliance desk at support@investpro.com.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-2xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Terms of Service</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                By accessing or registering with InvestPro, you agree to comply with and be bound by
                these Terms of Service. Please review them carefully before submitting an interest
                application.
              </p>
              <h4 className="font-semibold text-gray-800">1. Eligibility and Registration</h4>
              <p>
                Users must be of legal age in their jurisdiction. Submission of the registration
                form represents an application for onboarding subject to verification and approval
                by platform administrators.
              </p>
              <h4 className="font-semibold text-gray-800">2. Investment Plans and Returns</h4>
              <p>
                All investment plans, rates, and projected returns are governed by specific tier
                guidelines and agreed terms. Cryptocurrency investments carry market risk; past
                performance is not a guarantee of future results.
              </p>
              <h4 className="font-semibold text-gray-800">3. Referral Program Rules</h4>
              <p>
                Referral bonuses are earned only upon successful qualification and plan activation by
                invited accounts, following anti-abuse verification.
              </p>
              <h4 className="font-semibold text-gray-800">4. Modifications</h4>
              <p>
                InvestPro reserves the right to update these terms to reflect regulatory or platform
                updates. Active users will be notified of material changes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
