import { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const newsletters = [
  {
    id: 'weekly-outlook',
    title: 'Weekly Outlook',
    description: 'Sunday briefings on market structure, liquidity, and high-probability crypto shifts.',
    subscribers: '18.2K',
    color: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
  },
  {
    id: 'insider-notes',
    title: 'Insider Notes',
    description: 'Proprietary research notes and risk analysis directly from our investment committee.',
    subscribers: '9.6K',
    color: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'product-updates',
    title: 'Product & Tier Updates',
    description: 'Early notifications on new investment plans, rate enhancements, and platform features.',
    subscribers: '12.4K',
    color: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
  },
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([
    'weekly-outlook',
    'insider-notes',
    'product-updates',
  ]);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleNewsletter = (id: string) => {
    setSelectedNewsletters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (selectedNewsletters.length === 0) {
      toast.error('Please select at least one newsletter to subscribe.');
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to InvestPro briefings!');
    }, 600);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-8 sm:p-12 mb-8 shadow-xl shadow-amber-500/20 text-slate-950 border border-amber-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm shadow-sm">
              📨
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">InvestPro Intelligence Briefing</h2>
          </div>
          <p className="text-slate-900/90 text-base sm:text-lg max-w-2xl font-medium">
            Weekly market updates, exclusive alpha, and strategic investment insights delivered straight to your inbox.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-amber-900/5 p-6 sm:p-8 border border-amber-200/80">
          <div className="space-y-4 mb-8">
            {newsletters.map((newsletter) => {
              const isSelected = selectedNewsletters.includes(newsletter.id);
              return (
                <div
                  key={newsletter.id}
                  onClick={() => toggleNewsletter(newsletter.id)}
                  className={`flex items-start justify-between p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-1">
                        {newsletter.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{newsletter.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ml-4 bg-amber-100 text-amber-800 border border-amber-200">
                    {newsletter.subscribers}
                  </span>
                </div>
              );
            })}
          </div>

          {isSubscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center text-emerald-800">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1">You're Subscribed!</h4>
              <p className="text-sm text-emerald-700">
                Look out for our Sunday market outlook briefing in your inbox ({email}).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer shadow-md whitespace-nowrap"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">50+</div>
            <div className="text-gray-600 text-sm font-medium">Articles Published</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">35K+</div>
            <div className="text-gray-600 text-sm font-medium">Newsletter Subscribers</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">Weekly</div>
            <div className="text-gray-600 text-sm font-medium">Fresh Insights</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">100%</div>
            <div className="text-gray-600 text-sm font-medium">Spam-Free Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}
