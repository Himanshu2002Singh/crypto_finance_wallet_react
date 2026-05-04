import { Link } from 'react-router-dom';
import { dashboardStats, quickActions, transactions } from '../../../data/mockData';

export function DashboardHome() {
  const userName = localStorage.getItem('userName') || 'John';
  const firstName = userName.split(' ')[0];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">Welcome back, {firstName}!</h2>
        <p className="text-purple-100 mb-6">
          Your Silver plan is performing excellently with consistent returns.
        </p>
        <div className="flex gap-4">
          <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition">
            Upgrade Plan
          </button>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg px-6 py-3 rounded-lg font-semibold transition">
            Invite Friends
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-left`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <div className="font-semibold">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{transaction.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{transaction.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.statusColor}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link to="/dashboard/transactions" className="text-purple-600 font-semibold hover:underline">
            View All Transactions →
          </Link>
        </div>
      </div>
    </div>
  );
}
