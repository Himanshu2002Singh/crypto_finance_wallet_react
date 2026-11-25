import { useEffect, useMemo, useState } from 'react';
import { Copy, Share2, Users } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ReferralRow {
  referredUser: string;
  selectedPlan: { name: string; price: string } | null;
  referralRate: number;
  referralBonus: number;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
}

export function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);

  useEffect(() => {
    const loadReferrals = async () => {
      const response = await api.get('/referrals');
      setReferrals(response.data.referrals);
    };
    void loadReferrals();
  }, []);

  const stats = useMemo(() => {
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter((ref) => ref.status === 'ACTIVE').length;
    const totalEarned = referrals.reduce((sum, ref) => sum + ref.referralBonus, 0);
    const pendingEarnings = referrals
      .filter((ref) => ref.status !== 'ACTIVE')
      .reduce((sum, ref) => sum + ref.referralBonus, 0);

    return { totalReferrals, activeReferrals, totalEarned, pendingEarnings };
  }, [referrals]);

  const referralCode = useMemo(() => {
    return user?.userId || (user?.email ? user.email.split('@')[0].trim().toUpperCase() : '');
  }, [user?.userId, user?.email]);

  const referralLink = useMemo(() => {
    if (!referralCode) {
      return '';
    }

    const origin = window.location.origin;
    return `${origin}/get-started?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const shareText = `Join InvestPro with my referral link: ${referralLink}`;

  const handleCopy = () => {
    if (!referralLink) {
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!referralLink) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: 'Join InvestPro',
        text: 'Join InvestPro with my referral link.',
        url: referralLink
      });
      return;
    }

    setShowShareOptions((current) => !current);
  };

  const openShareUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team & Referrals</h1>
        <p className="text-gray-600">Invite friends and earn plan-wise bonuses on their investments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Referrals</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalReferrals}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Active Referrals</div>
          <div className="text-3xl font-bold text-green-600">
            {stats.activeReferrals}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Earned</div>
          <div className="text-3xl font-bold text-purple-600">
            ₹ {stats.totalEarned.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Pending Earnings</div>
          <div className="text-3xl font-bold text-yellow-600">
            ₹ {stats.pendingEarnings.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Referral Link</h2>
        </div>
        <p className="text-purple-100 mb-6">
          Share this referral link with friends and earn bonus when they invest
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1 font-mono text-white break-all">
              {referralLink || 'Your referral link will appear here'}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                <Copy className="w-5 h-5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setShowShareOptions((current) => !current)}
                className="flex items-center gap-2 bg-white/15 text-white border border-white/25 px-6 py-3 rounded-lg font-semibold hover:bg-white/25 transition"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
          <div className="mt-3 text-sm text-purple-100">Referral code: {referralCode || '--'}</div>
          {showShareOptions && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => openShareUrl(`https://wa.me/?text=${encodeURIComponent(shareText)}`)}
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              >
                WhatsApp
              </button>
              <button
                onClick={() =>
                  openShareUrl(
                    `mailto:?subject=${encodeURIComponent('Join InvestPro')}&body=${encodeURIComponent(shareText)}`
                  )
                }
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              >
                Mail
              </button>
              <button
                onClick={() =>
                  openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`)
                }
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              >
                Facebook
              </button>
              <button
                onClick={() => void handleNativeShare()}
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              >
                More
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold mb-1">Your Referral Rates</div>
            <div className="text-purple-100 text-sm">
              B {user?.bronzeReferralRate ?? '--'}% / S {user?.silverReferralRate ?? '--'}% / G{' '}
              {user?.goldReferralRate ?? '--'}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold mb-1">Active Bonuses</div>
            <div className="text-purple-100 text-sm">Paid after referral plan purchase</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-semibold mb-1">Secure Tracking</div>
            <div className="text-purple-100 text-sm">All referrals verified by admin</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Your Referral Team</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{referrals.length} Members</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Referred User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Selected Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Referral Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bonus Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((referral, index) => (
                <tr key={`${referral.referredUser}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{referral.referredUser}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">
                      {referral.selectedPlan?.name ?? 'Pending'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-green-600">
                      ₹ {referral.referralBonus.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">
                      {referral.referralRate ? `${referral.referralRate}%` : '--'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : referral.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {referral.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How Referral Program Works</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-3">
            <span className="font-semibold">1.</span>
            <span>Share your unique referral link with friends and family</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">2.</span>
            <span>When they sign up and make an investment, you earn a bonus</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">3.</span>
            <span>Referral bonuses are calculated using your assigned rate for their selected plan</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">4.</span>
            <span>Bonuses activate once your referral purchases a plan</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
