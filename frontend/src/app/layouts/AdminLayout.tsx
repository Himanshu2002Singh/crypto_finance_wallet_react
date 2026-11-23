import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
  ExternalLink,
  Shield,
  Activity,
  CheckCircle2,
  Users,
  Wallet,
  ArrowDownToLine
} from 'lucide-react';
import { adminApi } from '../services/api';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<number | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminApi.get('/admin/dashboard');
        if (response.data) {
          if (typeof response.data.pendingLeads === 'number') {
            setPendingCount(response.data.pendingLeads);
          }
          if (typeof response.data.pendingWithdrawals === 'number') {
            setPendingWithdrawals(response.data.pendingWithdrawals);
          }
        }
      } catch (err) {
        // silently ignore if not authenticated or network error
      }
    };
    void fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Admin Overview',
      path: '/admin',
      exact: true,
      badge: null
    },
    {
      icon: ShieldCheck,
      label: 'Leads & KYC Review',
      path: '/admin/leads',
      exact: false,
      badge: pendingCount && pendingCount > 0 ? pendingCount : null
    },
    {
      icon: ArrowDownToLine,
      label: 'Withdrawal Requests',
      path: '/admin/withdrawals',
      exact: false,
      badge: pendingWithdrawals && pendingWithdrawals > 0 ? pendingWithdrawals : null
    }
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
        <Link to="/admin" className="flex items-center gap-3.5" onClick={() => setIsSidebarOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <BarChart3 className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              Invest<span className="text-amber-400">Pro</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Admin
              </span>
            </div>
            <div className="text-[11px] font-medium tracking-wide text-slate-400">Control Center & Operations</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Close admin menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Management
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-400 border-l-4 border-amber-500 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System Status Pill */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Live & Operational
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            KYC auto-verification & crypto withdrawal settlement engine active.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400 font-medium">
            <span>Treasury Outflow</span>
            <span className="text-emerald-400 font-semibold">Active Gate</span>
          </div>
        </div>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="border-t border-slate-800/80 p-4 bg-slate-950/80">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[11px] text-slate-400 truncate">Superuser Access</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex antialiased">
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-72 shrink-0 md:sticky md:top-0 md:block md:h-screen shadow-xl z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close admin menu"
          />
          <aside className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Modern Top Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Open admin menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Control Panel
                  </span>
                  <span className="text-xs text-slate-400">/</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {location.pathname.includes('/withdrawals')
                      ? 'Capital Withdrawals'
                      : location.pathname.includes('/leads')
                      ? 'Leads & KYC Verification'
                      : 'Dashboard Analytics'}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {location.pathname.includes('/withdrawals')
                    ? 'Crypto Wallet Settlements'
                    : location.pathname.includes('/leads')
                    ? 'Investor Applications & Verification'
                    : 'Platform Operations'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <span>View Public Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {pendingWithdrawals && pendingWithdrawals > 0 ? (
                <Link
                  to="/admin/withdrawals"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold px-3 py-1.5 text-xs shadow-sm hover:bg-amber-400 transition"
                >
                  <Activity className="h-3.5 w-3.5 animate-spin" />
                  <span>{pendingWithdrawals} Pending Withdrawals</span>
                </Link>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
