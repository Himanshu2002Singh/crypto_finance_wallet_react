import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, UploadCloud, X, Camera, FileText } from 'lucide-react';
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
      toast.success('Your account request and documents have been submitted.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to submit your request.';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl relative">
          <Link
            to="/"
            aria-label="Back to home"
            title="Return to Home"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </Link>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your profile and identity documents have been submitted for automated compliance verification. Once approved, you can log in with your password.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-3 sm:p-5 relative py-10">
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 md:p-9 max-w-3xl w-full shadow-2xl border border-white/20">
        {/* Cross (X) icon to go back to Home */}
        <Link
          to="/"
          aria-label="Back to home"
          title="Return to Home"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </Link>

        {/* Compact Header */}
        <div className="text-center mb-5">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow group-hover:scale-105 transition-transform">
              I
            </div>
            <span className="text-xl font-bold text-gray-900">InvestPro</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Start Your Investment Journey
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Complete the form and attach your verification documents below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Pair 1: Full Name & Email Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Pair 2: Phone Number & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pair 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2 sm:py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
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
                  className="w-full px-3.5 py-2 sm:py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Documents Upload Section (ID Front, Back, Live Photo) */}
          <div className="border border-purple-100 bg-purple-50/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Identity & Photo Verification Documents
              </span>
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">
                Auto-Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* ID Front */}
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                  1. ID Card (Front)
                </span>
                {idFrontPreview ? (
                  <div className="relative group rounded overflow-hidden h-20 bg-gray-100 border">
                    <img src={idFrontPreview} alt="ID Front" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('front')}
                      className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-md p-2 h-20 cursor-pointer bg-gray-50/50 hover:bg-purple-50/30 transition">
                    <UploadCloud className="w-5 h-5 text-gray-400 mb-0.5" />
                    <span className="text-[10px] text-gray-500 font-medium">Front Side</span>
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
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                  2. ID Card (Back)
                </span>
                {idBackPreview ? (
                  <div className="relative group rounded overflow-hidden h-20 bg-gray-100 border">
                    <img src={idBackPreview} alt="ID Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('back')}
                      className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-md p-2 h-20 cursor-pointer bg-gray-50/50 hover:bg-purple-50/30 transition">
                    <UploadCloud className="w-5 h-5 text-gray-400 mb-0.5" />
                    <span className="text-[10px] text-gray-500 font-medium">Back Side</span>
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
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                  3. Live Photograph
                </span>
                {photoPreview ? (
                  <div className="relative group rounded overflow-hidden h-20 bg-gray-100 border">
                    <img src={photoPreview} alt="Live Photo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile('photo')}
                      className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-md p-2 h-20 cursor-pointer bg-gray-50/50 hover:bg-purple-50/30 transition">
                    <Camera className="w-5 h-5 text-gray-400 mb-0.5" />
                    <span className="text-[10px] text-gray-500 font-medium">Selfie / Photo</span>
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
            <p className="text-[11px] text-gray-500 text-center">
              Please ensure photos are clear, glare-free, and all 4 corners of your ID are visible.
            </p>
          </div>

          {/* Pair 4: Referral Code & Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="e.g. JD-12345 or username"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                Message / Goals (Optional)
              </label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3.5 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Tell us about your investment goals..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold text-base hover:shadow-xl transition transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-md cursor-pointer"
          >
            {isSubmitting ? 'Submitting Application & Documents...' : 'Submit Application & Documents'}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
