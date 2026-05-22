import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
        <p className="text-gray-600 mb-8">{description}</p>
        <Link
          to="/dashboard"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
