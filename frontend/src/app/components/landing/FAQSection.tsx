import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I get started with InvestPro?',
    answer:
      'Getting started is quick and simple. Click "Get Started" to fill out our 1-minute registration form. You can log in immediately with your email or generated User ID, and complete your KYC identity verification anytime from your profile.',
  },
  {
    question: 'How are personalized tier interest and referral rates assigned?',
    answer:
      'Rates are determined by our algorithmic compliance desk based on your capital tier (Bronze, Silver, Gold). Your verified monthly returns and referral bonus percentages are locked in and clearly displayed on your dashboard.',
  },
  {
    question: 'How does the referral program work?',
    answer:
      'Every active member receives an exclusive referral link and code. When your referred partners join and activate a plan, direct commission bonuses (2.0% to 3.0%) are credited directly into your investor wallet with real-time auditability.',
  },
  {
    question: 'How do I fund my account and activate an investment plan?',
    answer:
      'From your dashboard, navigate to "Invest Plans" to view all available tiers (Bronze $10,000, Silver $25,000, Gold $50,000). Selecting your preferred plan generates unique deposit instructions and confirms credits seamlessly.',
  },
  {
    question: 'What security measures safeguard my capital and documents?',
    answer:
      'We use bank-grade 256-bit SSL encryption, isolated Cloudinary document vaults, automated biometric KYC, and cold storage multi-signature architectures for all digital asset reserves.',
  },
  {
    question: 'Who can I contact if I need personalized wealth assistance?',
    answer:
      'Our dedicated investor concierge team responds to all inquiries within 24–48 hours. Direct phone lines are currently closed, but our official Telegram support and community channel will be launched soon. You can submit tickets via your client dashboard or email support@investzora.com.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 bg-white text-slate-900 border-t border-slate-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mb-4">
            Clear Answers for Prudent Investors
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Everything you need to know about our onboarding process, compliance verification, and tier investment structures.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 bg-white ${
                  isOpen ? 'border-amber-400 ring-2 ring-amber-400/10 shadow-md' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA Banner */}
        <div className="mt-14 rounded-3xl border border-slate-800 bg-slate-950 p-7 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Have bespoke institutional inquiries?</h4>
              <p className="text-xs text-slate-400 mt-0.5">Our private wealth concierge desk is standing by 24/7.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:support@investpro.com"
              className="border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
            >
              Contact Support
            </a>
            <Link
              to="/get-started"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
