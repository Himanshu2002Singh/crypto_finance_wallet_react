import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, X } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

export function ActivateAccountPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 flex items-center justify-center p-4">
        <div className="bg-white/95 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-amber-200/80 relative">
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-amber-200/70"
          >
            <X className="w-4 h-4" />
          </Link>
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-950 mb-3">Account Activated!</h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-8 leading-relaxed">
            Your credentials have been securely configured. You can now log in using your Email or User ID.
          </p>
          <Link
            to="/login"
            className="w-full inline-block bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-8 py-3.5 rounded-xl font-black hover:shadow-lg transition shadow-amber-500/20"
          >
            Continue to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 flex items-center justify-center p-4 relative">
      <div className="relative bg-white/95 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl border border-amber-200/80">
        <Link
          to="/"
          aria-label="Back to home"
          title="Return to Home"
          className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-amber-200/70"
        >
          <X className="w-4 h-4" />
        </Link>

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              I
            </div>
            <span className="text-2xl font-black text-slate-950">
              Invest<span className="text-amber-600">Pro</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-950 mb-1">Activate Your Account</h1>
          <p className="text-slate-500 text-xs">Set your password to complete onboarding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition text-sm text-slate-900 bg-white"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition text-sm text-slate-900 bg-white"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
