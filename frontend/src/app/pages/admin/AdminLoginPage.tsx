import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await adminApi.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Admin login successful.');
      navigate('/admin');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to login';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Login</h1>
          <p className="text-gray-600">Secure access for InvestPro admins</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="admin@invest-pro.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Login to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
