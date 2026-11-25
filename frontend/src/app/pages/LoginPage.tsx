import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, X, HelpCircle, ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) {
      setFormData((prev) => ({
        ...prev,
        identifier: userParam,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData.identifier.trim(), formData.password);
      toast.success('Welcome back to InvestPro!');
      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Invalid credentials. Please verify your Email/User ID and password.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 flex items-center justify-center p-4 relative overflow-hidden text-slate-900">
      {/* Ambient Luxury Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Luxury Glass Card */}
        <div className="relative rounded-3xl border border-amber-200/80 bg-white/95 p-8 sm:p-10 shadow-2xl shadow-amber-900/10 backdrop-blur-xl">
          {/* Close button to return home */}
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-amber-200/70"
          >
            <X className="w-4 h-4" />
          </Link>

          {/* Brand & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                I
              </div>
              <span className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-1">
                Invest<span className="text-amber-600">Pro</span>
              </span>
            </Link>

            <h1 className="text-2xl font-black text-slate-950 tracking-tight">Client Portal Sign In</h1>
            <p className="text-slate-600 text-xs mt-1">Access your portfolio, tier yield payouts, and referrals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email or User ID
                </label>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  e.g. KRTIMPEX
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm font-medium"
                  placeholder="krtimpex@gmail.com or KRTIMPEX"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Log in using your email or your uppercase User ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-amber-700 font-bold hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              New investor?{' '}
              <Link to="/get-started" className="text-amber-700 font-bold hover:underline">
                Open an account
              </Link>
            </div>
          </form>
        </div>

        {/* Security badge below card */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted Client Session</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative rounded-2xl border border-amber-200 bg-white p-6 max-w-sm w-full shadow-2xl">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold">
                ?
              </div>
              <h3 className="text-base font-bold text-slate-950">Password Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please contact your relationship manager or our dedicated investor support desk at{' '}
                <strong className="text-slate-900">support@investpro.com</strong> to securely reset your credentials.
              </p>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
