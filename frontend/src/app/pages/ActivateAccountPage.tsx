import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

export function ActivateAccountPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!token) {
      const message = 'Activation token missing.';
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.';
      setError(message);
      toast.error(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/activate', { token, password });
      setCompleted(true);
      toast.success('Account activated successfully.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to activate account.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Activated</h2>
          <p className="text-gray-600 mb-8">
            Your account is ready. Login to access your dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold text-gray-900">InvestPro</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Activate Your Account</h1>
          <p className="text-gray-600">Set a password to complete onboarding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter a strong password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
