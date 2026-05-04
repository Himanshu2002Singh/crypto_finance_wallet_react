import { useState } from 'react';
import { Copy, Share2, Users } from 'lucide-react';
import { referralData } from '../../../data/extendedMockData';

export function Referrals() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team & Referrals</h1>
        <p className="text-gray-600">Invite friends and earn up to 3% bonus on their investments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Referrals</div>
          <div className="text-3xl font-bold text-gray-900">{referralData.stats.totalReferrals}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Active Referrals</div>
          <div className="text-3xl font-bold text-green-600">
            {referralData.stats.activeReferrals}
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
            {referralData.stats.totalEarned}
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
            {referralData.stats.pendingEarnings}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Referral Link</h2>
        </div>
        <p className="text-purple-100 mb-6">
          Share this link with friends and earn bonus when they invest
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 font-mono text-white break-all">
              {referralData.referralLink}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🥉</div>
            <div className="font-semibold mb-1">Bronze Plan</div>
            <div className="text-purple-100 text-sm">Earn 2.0% bonus</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🥈</div>
            <div className="font-semibold mb-1">Silver Plan</div>
            <div className="text-purple-100 text-sm">Earn 2.5% bonus</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🥇</div>
            <div className="font-semibold mb-1">Gold Plan</div>
            <div className="text-purple-100 text-sm">Earn 3.0% bonus</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Your Referral Team</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{referralData.referrals.length} Members</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Your Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referralData.referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{referral.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600 text-sm">{referral.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">{referral.dateJoined}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{referral.investmentPlan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-green-600">{referral.yourEarnings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${referral.statusColor}`}
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
            <span>
              Bonus varies by plan: Bronze (2%), Silver (2.5%), Gold (3%) of their investment
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">4.</span>
            <span>Bonuses are credited instantly to your account</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
