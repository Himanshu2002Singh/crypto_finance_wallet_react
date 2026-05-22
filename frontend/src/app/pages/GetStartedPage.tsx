import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      setFormData((current) => ({
        ...current,
        referralCode
      }));
    }
  }, [searchParams]);

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
      await api.post('/leads', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        password: formData.password,
        message: formData.message,
        referralCode: formData.referralCode || undefined
      });
      setSubmitted(true);
      toast.success('Your request has been submitted. We will notify you after approval.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to submit your request.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8">
            We've received your interest form. Once admin approves your profile, your account will
            be active and you can log in with the password you just set.
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold text-gray-900">InvestPro</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Start Your Investment Journey</h1>
          <p className="text-gray-600">
            Fill out the form below and set your login password. Documents can be uploaded after approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select your country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Create a strong password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us about your investment goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter referrer email username"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Interest Form'}
          </button>

          <p className="text-center text-sm text-gray-500">
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
