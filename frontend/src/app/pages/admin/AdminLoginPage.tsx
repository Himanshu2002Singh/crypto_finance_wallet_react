import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4 relative">
      <div className="relative bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl border border-white/10">
        <Link
          to="/"
          aria-label="Back to home"
          title="Return to Home"
          className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </Link>

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-2xl font-bold text-gray-900">InvestPro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Secure access for InvestPro administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="admin@investpro.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold text-base hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? 'Signing in...' : 'Login to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
