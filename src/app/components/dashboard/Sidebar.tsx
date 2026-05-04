import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Users,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'My Investments', path: '/dashboard/investments' },
  { icon: Receipt, label: 'Transactions', path: '/dashboard/transactions' },
  { icon: Users, label: 'Team & Referrals', path: '/dashboard/referrals' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
  { icon: Shield, label: 'Security', path: '/dashboard/security' },
  { icon: HelpCircle, label: 'Support', path: '/dashboard/support' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
          I
        </div>
        <span className="text-xl font-bold text-gray-900">InvestPro</span>
      </Link>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
