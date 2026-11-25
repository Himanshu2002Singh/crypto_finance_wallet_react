import { Bell, LogOut, Menu, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface DashboardNavbarProps {
  onToggleMobileSidebar?: () => void;
  onToggleDesktopSidebar?: () => void;
  desktopCollapsed?: boolean;
}

export function DashboardNavbar({
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  desktopCollapsed,
}: DashboardNavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.fullName || 'Investor';
  const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-amber-200/70 px-4 sm:px-8 py-3.5 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu (Opens Drawer) */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 transition cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-2 rounded-xl text-slate-600 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 transition cursor-pointer"
            title={desktopCollapsed ? 'Expand sidebar' : 'Collapse / close off sidebar'}
            aria-label="Toggle desktop sidebar"
          >
            {desktopCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight">Investor Dashboard</h1>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono w-fit">
              USD Vault • ID: {userId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <button
            type="button"
            className="relative p-2 hover:bg-amber-50 rounded-xl transition border border-transparent hover:border-amber-200 text-slate-600"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 sm:border-l border-slate-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-xs sm:text-sm shrink-0">
              {userId.substring(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-black text-sm text-slate-950 truncate max-w-[140px]">
                {userName}
              </div>
              <div className="text-[11px] text-amber-700 font-mono font-bold">
                User ID: {userId}
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
