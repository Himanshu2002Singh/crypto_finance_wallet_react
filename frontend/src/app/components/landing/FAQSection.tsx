import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I get started with InvestPro?',
    answer:
      'Getting started is simple. Click "Get Started" to fill out our quick interest form and set your secure password. Once our compliance team reviews and approves your submission, your account is immediately active.',
  },
  {
    question: 'How are personalized interest and referral rates determined?',
    answer:
      'Rates are tailored based on your selected investment tier, capital commitment, and account profile. Once logged in, your verified rates are clearly displayed on your personal dashboard.',
  },
  {
    question: 'How does the referral bonus program work?',
    answer:
      'Every active member receives a unique referral code and shareable link. When your referred partners join and activate an investment plan, bonuses are credited directly to your account balance.',
  },
  {
    question: 'How do I fund my account and purchase an investment plan?',
    answer:
      'From your dashboard, navigate to "Invest Plans" to view all available tiers (Bronze, Silver, Gold). Select your preferred plan to generate deposit instructions and track real-time confirmations.',
  },
  {
    question: 'What security measures protect my investment and identity?',
    answer:
      'We use bank-grade 256-bit encryption, strict KYC compliance, multi-factor authentication options, and cold storage custody for digital asset reserves.',
  },
  {
    question: 'Who can I contact if I need assistance?',
    answer:
      'Our dedicated investor support desk is available 24/7. You can reach us via our dashboard support center, live chat, or by emailing support@investpro.com.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Got Questions? We Have Answers
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our platform, onboarding process, and investment opportunities.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-purple-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-purple-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/60 bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Have more questions?</h4>
              <p className="text-sm text-gray-600">Our support team is always here to assist you.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:support@investpro.com"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
            >
              Email Support
            </a>
            <Link
              to="/get-started"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

