import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Users,
  User,
  HelpCircle,
  Coins,
  ShieldCheck,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Coins, label: 'Investment Plans', path: '/dashboard/invest' },
  { icon: Receipt, label: 'Transactions', path: '/dashboard/transactions' },
  { icon: Users, label: 'Referral Program', path: '/dashboard/referrals' },
  { icon: User, label: 'Profile & KYC', path: '/dashboard/profile' },
  { icon: HelpCircle, label: 'Support Concierge', path: '/dashboard/support' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-amber-200/70 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <Link to="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            I
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-1">
              Invest<span className="text-amber-600">Pro</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Wealth Portal
            </span>
          </div>
        </Link>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-700 hover:bg-amber-50/70 hover:text-amber-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-amber-100">
        <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Cold-Vault Protected</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Multi-signature asset custody with real-time portfolio balance auditing.
          </p>
        </div>
      </div>
    </aside>
  );
}
