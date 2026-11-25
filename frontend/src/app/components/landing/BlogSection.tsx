import { useState } from 'react';
import { X, BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
}

const allBlogArticles: Article[] = [
  {
    id: 'macro-outlook',
    title: '2026 Crypto Market Outlook: Institutional Yield Horizons',
    excerpt: 'A forward-looking view on macro liquidity, treasury integrations, and digital asset growth.',
    date: 'May 8, 2026',
    readTime: '4 min read',
    tag: 'Macro Strategy',
    content: [
      'As we navigate 2026, institutional digital asset adoption has transitioned from speculative momentum to disciplined balance-sheet integration. Global liquidity conditions and regulatory clarity across key financial hubs are providing unprecedented structural support.',
      'Our research committee monitors three primary macro catalysts: sustained ETF inflows, on-chain real-world asset (RWA) tokenization, and sovereign yield differentials that encourage capital allocators to seek crypto yield opportunities.',
      'For investors, maintaining diversified exposure across top-tier digital assets while locking in consistent interest returns remains the gold standard in risk-adjusted performance.',
    ],
  },
  {
    id: 'risk-frameworks',
    title: 'Risk Frameworks: Capital Preservation Across Volatility',
    excerpt: 'How tier-based mathematical models protect principal capital through market cycles.',
    date: 'May 2, 2026',
    readTime: '5 min read',
    tag: 'Risk Management',
    content: [
      'Building enduring wealth in crypto requires an unwavering commitment to risk management. Market volatility is not an obstacle to be avoided, but a variable to be engineered around.',
      'We utilize tier-based allocation formulas, dynamic hedging protocols, and secure institutional custody to shield principal investment capital while generating steady compounding returns.',
      'Investors are encouraged to balance higher-yield plans with foundational stability, ensuring peace of mind regardless of short-term price fluctuations.',
    ],
  },
  {
    id: 'referral-program',
    title: 'Transparent Referral Program Engineered for Trust',
    excerpt: 'Why direct, verifiable commission structures empower investor confidence.',
    date: 'Apr 25, 2026',
    readTime: '3 min read',
    tag: 'Ecosystem & Growth',
    content: [
      'Sustainable ecosystems grow when value is distributed transparently back to the community that fosters them. Our referral mechanism is engineered with absolute clarity at its core.',
      'Unlike opaque affiliate models, InvestPro investors can track their referrals, activation stages, and credited commissions in real time straight from their personal dashboard.',
      'We believe transparent rewards foster long-term alignment between platform growth and individual investor prosperity.',
    ],
  },
  {
    id: 'institutional-custody',
    title: 'Institutional Custody: Safeguarding Client Reserves',
    excerpt: 'An inside look at multi-party computation (MPC) and cold vault architectures.',
    date: 'Apr 18, 2026',
    readTime: '4 min read',
    tag: 'Vault Security',
    content: [
      'Security is the bedrock of digital finance. At InvestPro, client reserves are safeguarded with multi-party computation (MPC) private key architectures and geographically dispersed cold storage vaults.',
      'No single administrator or server retains unilateral access to reserve keys. Every treasury movement undergoes multi-signatory verification and algorithmic health monitoring.',
      'This enterprise-grade infrastructure ensures that user assets remain secure against any digital or physical threats.',
    ],
  },
  {
    id: 'defi-evolution',
    title: 'Structured Yield Products vs Day-Trading Hazards',
    excerpt: 'How automated rebalancing and fixed rate plans deliver peace of mind.',
    date: 'Apr 10, 2026',
    readTime: '6 min read',
    tag: 'Yield Engineering',
    content: [
      'The modern investor seeks predictable yield alongside capital preservation. Structured plans allow individuals to bypass complex day-trading mechanics in favor of pre-determined return profiles.',
      'By pairing liquidity-provision rewards with algorithmic counter-party arbitrage, InvestPro plans unlock steady returns that are shielded from sharp daily market swings.',
      'Review our Bronze, Silver, and Gold plan tiers to select the risk-return matrix tailored to your investment objectives.',
    ],
  },
];

export function BlogSection() {
  const [showAll, setShowAll] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const displayedArticles = showAll ? allBlogArticles : allBlogArticles.slice(0, 3);

  return (
    <section id="blogs" className="py-24 bg-gradient-to-b from-white via-amber-50/20 to-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 p-8 sm:p-12 mb-10 shadow-xl shadow-amber-500/15 text-slate-950 border border-amber-300">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>InvestPro Intelligence & Research Desk</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-3">
              Strategic Insights & Wealth Intelligence
            </h2>
            <p className="text-slate-900/90 text-sm sm:text-base leading-relaxed font-medium">
              Curated market reports, risk engineering whitepapers, and digital asset strategies curated by our private research desk.
            </p>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {displayedArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {article.tag}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2.5 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 transition">
                  Read Analysis <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-xs font-black text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition cursor-pointer"
          >
            <span>{showAll ? 'Show Fewer Articles' : `Explore All Intelligence Articles (${allBlogArticles.length})`}</span>
          </button>
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs tracking-wider uppercase mb-3">
              <BookOpen className="w-4 h-4" />
              <span>{selectedArticle.tag} • Intelligence Whitepaper</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400 pb-5 mb-5 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {selectedArticle.readTime}
              </span>
            </div>

            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
