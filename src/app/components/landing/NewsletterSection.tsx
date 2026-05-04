import { newsletters } from '../../../data/mockData';

export function NewsletterSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-12 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
              📨
            </div>
            <h2 className="text-3xl font-bold text-white">Newsletter</h2>
          </div>
          <p className="text-blue-100 text-lg">
            Weekly market updates, exclusive insights, and investment opportunities delivered to
            your inbox
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6 mb-8">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="flex justify-between items-start pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  <h3 className={`text-xl font-bold ${newsletter.color} mb-2`}>
                    {newsletter.title}
                  </h3>
                  <p className="text-gray-600">{newsletter.description}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {newsletter.subscribers} subscribers
                </span>
              </div>
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition">
            Subscribe Now
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Articles Published</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">35K+</div>
            <div className="text-gray-600">Newsletter Subscribers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">Weekly</div>
            <div className="text-gray-600">Fresh Content</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">Expert</div>
            <div className="text-gray-600">Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
}
