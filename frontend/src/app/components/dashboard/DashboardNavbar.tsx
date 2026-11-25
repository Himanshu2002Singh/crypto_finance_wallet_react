import { Bell, LogOut, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.fullName || 'Investor';
  const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-amber-200/70 px-6 sm:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">Investor Dashboard</h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono">
            ID: {userId}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            className="relative p-2 hover:bg-amber-50 rounded-xl transition border border-transparent hover:border-amber-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-sm">
              {userId.substring(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-black text-sm text-slate-950 flex items-center gap-1">
                <span>{userName}</span>
              </div>
              <div className="text-xs text-amber-700 font-mono font-bold flex items-center gap-1">
                <span>User ID: {userId}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
