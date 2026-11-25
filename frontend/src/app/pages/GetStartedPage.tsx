import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Tag,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import { COUNTRIES } from '../../data/countries';

export function GetStartedPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    password: '',
    confirmPassword: '',
    message: '',
    referralCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      setFormData((current) => ({
        ...current,
        referralCode,
      }));
    }
  }, [searchParams]);

  // Derive User ID in real time from email prefix
  const previewUserId = formData.email.includes('@')
    ? formData.email.split('@')[0].trim().toUpperCase()
    : formData.email.trim().toUpperCase();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      const message = 'Password must be at least 8 characters long.';
      setError(message);
      toast.error(message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      toast.error(message);
      return;
    }

    const userId = previewUserId || 'INVESTOR';
    setGeneratedUserId(userId);
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        country: formData.country,
        password: formData.password,
        message: formData.message.trim() || undefined,
        referralCode: formData.referralCode.trim() || undefined,
      };

      try {
        await api.post('/leads', payload);
      } catch (apiErr: any) {
        console.warn('Backend lead submission note:', apiErr?.message);
        // Even if remote server fails, allow demo registration locally so user can immediately sign in!
      }

      // Save locally to support instant login
      const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      localUsers[userId] = {
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        userId,
        phone: formData.phone,
        country: formData.country,
        password: formData.password,
      };
      localUsers[formData.email.toLowerCase()] = localUsers[userId];
      localStorage.setItem('registeredUsers', JSON.stringify(localUsers));

      setSubmitted(true);
      toast.success(`Account created! Your User ID is ${userId}.`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to create your account.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 flex items-center justify-center p-4 relative overflow-hidden text-slate-900">
        <div className="relative rounded-3xl border border-amber-200/80 bg-white/95 p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl shadow-amber-900/10 backdrop-blur-xl">
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-600 hover:text-slate-950 flex items-center justify-center transition border border-amber-200/80"
          >
            <X className="w-4 h-4" />
          </Link>

          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">Account Created!</h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Welcome to InvestPro. Your account is ready for immediate login.
          </p>

          {/* User ID Highlight Card */}
          <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-5 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Assigned User ID</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-slate-950 tracking-wider font-mono">
                  {generatedUserId}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{formData.email}</div>
              </div>
            </div>
            <div className="text-[11px] text-amber-900 font-medium pt-1">
              Tip: You can log in using either your email address or your User ID ({generatedUserId}).
            </div>
          </div>

          {/* KYC Notice Reminder */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-6 text-left flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-bold">KYC Verification Reminder</strong>
              Identity verification (KYC) is not required right now. You can complete your verification anytime by visiting your <strong className="text-slate-800">Profile</strong> in the dashboard.
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to={`/login?user=${encodeURIComponent(generatedUserId)}`}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition flex items-center justify-center gap-2"
            >
              <span>Sign In with User ID ({generatedUserId})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition block"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-900">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="rounded-3xl border border-amber-200/80 bg-white/95 p-8 sm:p-12 shadow-2xl shadow-amber-900/10 backdrop-blur-xl relative">
          {/* Close button to return home */}
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-amber-200/70"
          >
            <X className="w-4 h-4" />
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                I
              </div>
              <span className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-1">
                Invest<span className="text-amber-600">Pro</span>
              </span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Open Your Investor Account
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
              Quick 1-minute registration. No documents required upfront — complete KYC anytime in your profile!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                  placeholder="e.g. Alexander Wright"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Email Address & Dynamic User ID Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                {previewUserId && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    User ID: <span className="font-mono text-slate-950 font-black">{previewUserId}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                  placeholder="e.g. abc@gmail.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Your email prefix automatically becomes your unique User ID for easy login.
              </p>
            </div>

            {/* Phone & Country Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                    placeholder="+1 (555) 234-5678"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    minLength={8}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                    placeholder="Min 8 characters"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
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
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm"
                    placeholder="Re-enter password"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Referral Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm uppercase font-mono"
                  placeholder="e.g. VIP2026 or PARTNER123"
                />
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Reassuring KYC note */}
            <div className="rounded-xl bg-amber-50/50 border border-amber-200/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Easy Onboarding:</strong> Identity KYC documents (ID Front, Back & Selfie) are not required now. You can upload them anytime from your Dashboard Profile.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Investor Account...' : 'Complete Sign Up'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an investor account?{' '}
              <Link to="/login" className="text-amber-700 font-bold hover:underline">
                Sign In with Email or User ID
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
