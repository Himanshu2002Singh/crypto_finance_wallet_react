import { useState } from 'react';
import { X, BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
}

const allBlogArticles: Article[] = [
  {
    id: 'macro-outlook',
    title: '2026 Crypto Market Outlook',
    excerpt: 'A forward-looking view on macro drivers shaping digital asset growth.',
    date: 'May 8, 2026',
    readTime: '4 min read',
    content: [
      'As we navigate 2026, institutional digital asset adoption has transitioned from speculative momentum to disciplined balance-sheet integration. Global liquidity conditions and regulatory clarity across key financial hubs are providing unprecedented structural support.',
      'Our research committee monitors three primary macro catalysts: sustained ETF inflows, on-chain real-world asset (RWA) tokenization, and sovereign yield differentials that encourage capital allocators to seek crypto yield opportunities.',
      'For investors, maintaining diversified exposure across top-tier digital assets while locking in consistent interest returns remains the gold standard in risk-adjusted performance.',
    ],
  },
  {
    id: 'risk-frameworks',
    title: 'Risk Frameworks for Long-Term Investors',
    excerpt: 'How we build resilient portfolios across market cycles.',
    date: 'May 2, 2026',
    readTime: '5 min read',
    content: [
      'Building enduring wealth in crypto requires an unwavering commitment to risk management. Market volatility is not an obstacle to be avoided, but a variable to be engineered around.',
      'We utilize tier-based allocation formulas, dynamic hedging protocols, and secure institutional custody to shield principal investment capital while generating steady compounding returns.',
      'Investors are encouraged to balance higher-yield plans with foundational stability, ensuring peace of mind regardless of short-term price fluctuations.',
    ],
  },
  {
    id: 'referral-program',
    title: 'Referral Programs That Reward Community',
    excerpt: 'Why transparent referral incentives matter for investor trust.',
    date: 'Apr 25, 2026',
    readTime: '3 min read',
    content: [
      'Sustainable ecosystems grow when value is distributed transparently back to the community that fosters them. Our referral mechanism is engineered with absolute clarity at its core.',
      'Unlike opaque affiliate models, InvestPro investors can track their referrals, activation stages, and credited commissions in real time straight from their personal dashboard.',
      'We believe transparent rewards foster long-term alignment between platform growth and individual investor prosperity.',
    ],
  },
  {
    id: 'institutional-custody',
    title: 'Institutional Custody: Safeguarding Digital Wealth',
    excerpt: 'An inside look at multi-party computation and cold vault infrastructure.',
    date: 'Apr 18, 2026',
    readTime: '4 min read',
    content: [
      'Security is the bedrock of digital finance. At InvestPro, client reserves are safeguarded with multi-party computation (MPC) private key architectures and geographically dispersed cold storage vaults.',
      'No single administrator or server retains unilateral access to reserve keys. Every treasury movement undergoes multi-signatory verification and algorithmic health monitoring.',
      'This enterprise-grade infrastructure ensures that user assets remain secure against any digital or physical threats.',
    ],
  },
  {
    id: 'defi-evolution',
    title: 'The Evolution of Structured Yield Products',
    excerpt: 'How automated rebalancing and fixed rate plans deliver predictability.',
    date: 'Apr 10, 2026',
    readTime: '6 min read',
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
    <section id="blogs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 rounded-2xl p-8 sm:p-12 mb-8 shadow-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl backdrop-blur-sm">
              📰
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Investment Insights & Blog</h2>
          </div>
          <p className="text-purple-100 text-base sm:text-lg max-w-2xl">
            Expert analysis, market intelligence, and wealth-building strategies curated by our investment research desk.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="space-y-4 mb-8">
            {displayedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="pb-6 pt-2 border-b border-gray-100 last:border-b-0 hover:bg-purple-50/50 p-4 rounded-xl transition cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 group-hover:text-purple-800 transition">
                  Read Full Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.01] cursor-pointer"
          >
            {showAll ? 'Show Fewer Articles' : `View All Articles (${allBlogArticles.length})`}
          </button>
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wider uppercase mb-3">
              <BookOpen className="w-4 h-4" /> Research & Analysis
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-gray-500 pb-5 mb-5 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                {selectedArticle.readTime}
              </span>
            </div>

            <div className="space-y-4 text-gray-700 text-base leading-relaxed">
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition"
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
