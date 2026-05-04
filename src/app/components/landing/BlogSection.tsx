import { blogArticles } from '../../../data/mockData';

export function BlogSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 rounded-2xl p-12 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
              📰
            </div>
            <h2 className="text-3xl font-bold text-white">Investment Blog</h2>
          </div>
          <p className="text-purple-100 text-lg">
            Expert analysis, market insights, and investment strategies from our professional team
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6 mb-8">
            {blogArticles.map((article) => (
              <div
                key={article.id}
                className="pb-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-3">{article.excerpt}</p>
                <p className="text-sm text-gray-500">{article.date}</p>
              </div>
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition">
            Read All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
