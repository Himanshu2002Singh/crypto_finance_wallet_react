import { Search, Download } from 'lucide-react';

export function Transactions() {
  const stats = {
    totalDeposits: '₹ 0',
    totalWithdrawals: '₹ 0',
    totalEarnings: '₹ 0',
    pendingTransactions: 0,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View and manage all your transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Deposits</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalDeposits}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Withdrawals</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalWithdrawals}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
          <div className="text-2xl font-bold text-green-600">{stats.totalEarnings}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              disabled
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400"
            />
          </div>

          <div className="flex gap-3">
            <select
              disabled
              className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400"
            >
              <option>All Types</option>
            </select>

            <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold" disabled>
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📭</div>
          <p className="text-gray-600">No transactions yet. Payment system coming soon.</p>
        </div>
      </div>
    </div>
  );
}
