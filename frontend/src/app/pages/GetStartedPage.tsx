import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, UploadCloud, X, Camera, FileText, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import { COUNTRIES } from '../../data/countries';

export function GetStartedPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    message: '',
    referralCode: '',
  });

  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleFileChange = (type: 'front' | 'back' | 'photo', file: File | null) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === 'front') {
      setIdFrontFile(file);
      setIdFrontPreview(previewUrl);
    } else if (type === 'back') {
      setIdBackFile(file);
      setIdBackPreview(previewUrl);
    } else if (type === 'photo') {
      setPhotoFile(file);
      setPhotoPreview(previewUrl);
    }
  };

  const removeFile = (type: 'front' | 'back' | 'photo') => {
    if (type === 'front') {
      setIdFrontFile(null);
      setIdFrontPreview(null);
    } else if (type === 'back') {
      setIdBackFile(null);
      setIdBackPreview(null);
    } else if (type === 'photo') {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      const message = 'Password must be at least 8 characters.';
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

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('country', formData.country);
      data.append('password', formData.password);
      if (formData.message) data.append('message', formData.message);
      if (formData.referralCode) data.append('referralCode', formData.referralCode);

      if (idFrontFile) data.append('idProof', idFrontFile);
      if (idBackFile) data.append('idProofBack', idBackFile);
      if (photoFile) data.append('photo', photoFile);

      await api.post('/leads', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(true);
      toast.success('Your application and documents have been submitted.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to submit your application.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/95 p-8 sm:p-12 max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-4 h-4" />
          </Link>

          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Application Received!</h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-8 leading-relaxed">
            Your investor profile and uploaded KYC documents (ID Front, Back & Selfie) are now queued for automated compliance verification. Once verified, you will be able to log in to your dashboard.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 transition"
          >
            <span>Return to Public Home</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 relative py-12 overflow-hidden text-slate-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-9 max-w-3xl w-full shadow-2xl backdrop-blur-xl">
        {/* Cross (X) icon to go back to Home */}
        <Link
          to="/"
          aria-label="Back to home"
          title="Return to Home"
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700 z-10"
        >
          <X className="w-4 h-4" />
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              I
            </div>
            <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1">
              Invest<span className="text-amber-400">Pro</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Investor Onboarding & Registration
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Provide your details and attach identity verification documents for compliance review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-4 py-3 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Pair 1: Full Name & Email Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                placeholder="e.g. Johnathan Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Pair 2: Phone Number & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Country of Residence *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pair 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Account Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Documents Upload Section (ID Front, Back, Live Photo) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Identity & Biometric Documents</span>
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Automated KYC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* ID Front */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  1. ID Card (Front)
                </span>
                {idFrontPreview ? (
                  <div className="relative group rounded-lg overflow-hidden h-20 bg-slate-950 border border-slate-700">
                    <img src={idFrontPreview} alt="ID Front" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('front')}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-500 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg p-2 h-20 cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition">
                    <UploadCloud className="w-5 h-5 text-slate-500 mb-0.5" />
                    <span className="text-[10px] text-slate-400 font-medium">Front Side</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange('front', e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>

              {/* ID Back */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  2. ID Card (Back)
                </span>
                {idBackPreview ? (
                  <div className="relative group rounded-lg overflow-hidden h-20 bg-slate-950 border border-slate-700">
                    <img src={idBackPreview} alt="ID Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('back')}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-500 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg p-2 h-20 cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition">
                    <UploadCloud className="w-5 h-5 text-slate-500 mb-0.5" />
                    <span className="text-[10px] text-slate-400 font-medium">Back Side</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange('back', e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>

              {/* Live Photo */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  3. Live Selfie
                </span>
                {photoPreview ? (
                  <div className="relative group rounded-lg overflow-hidden h-20 bg-slate-950 border border-slate-700">
                    <img src={photoPreview} alt="Live Photo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('photo')}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-500 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg p-2 h-20 cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition">
                    <Camera className="w-5 h-5 text-slate-500 mb-0.5" />
                    <span className="text-[10px] text-slate-400 font-medium">Selfie Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange('photo', e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Ensure document images are crisp and readable without glare.
            </p>
          </div>

          {/* Pair 4: Referral Code & Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                placeholder="e.g. JD-12345 or username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Investment Objectives (Optional)
              </label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                placeholder="Target horizon, capital allocation..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Transmitting Data & Documents...' : 'Submit Application & KYC Documents'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-400 pt-1">
            Already registered?{' '}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              Sign in to portal
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
