import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Users,
  User,
  HelpCircle,
  Coins,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Coins, label: 'Investment Plans', path: '/dashboard/invest' },
  { icon: Receipt, label: 'Transactions', path: '/dashboard/transactions' },
  { icon: Users, label: 'Referral Program', path: '/dashboard/referrals' },
  { icon: User, label: 'Profile & KYC', path: '/dashboard/profile' },
  { icon: HelpCircle, label: 'Support Concierge', path: '/dashboard/support' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  desktopCollapsed: boolean;
  onToggleDesktop: () => void;
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
  desktopCollapsed,
  onToggleDesktop,
}: SidebarProps) {
  const location = useLocation();

  const renderNavLinks = (isCollapsed: boolean, onItemClick?: () => void) => (
    <nav className="space-y-1.5">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded-xl text-xs font-bold transition-all ${
              isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
            } ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-700 hover:bg-amber-50/70 hover:text-amber-900'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'}`} />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer (Closed off by default) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-amber-200/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-100">
            <Link to="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/25">
                I
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-1">
                  Invest<span className="text-amber-600">Zora</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Investor Portal (USD)
                </span>
              </div>
            </Link>
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-50 flex items-center justify-center text-slate-600 hover:text-amber-700 transition"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {renderNavLinks(false, onCloseMobile)}
        </div>

        <div className="pt-6 border-t border-amber-100 space-y-3">
          <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Cold Vault Protected</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Reserves segregated in USD & digital assets.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-sky-700 px-1">
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Channel: Coming Soon</span>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar (Collapsible / Toggleable) */}
      <aside
        className={`hidden lg:flex flex-col justify-between bg-white border-r border-amber-200/70 min-h-screen transition-all duration-300 shrink-0 ${
          desktopCollapsed ? 'w-20 p-3' : 'w-64 p-6'
        }`}
      >
        <div>
          {/* Logo & Collapse Header */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-amber-100/60">
            <Link to="/" className={`flex items-center gap-3 group ${desktopCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform shrink-0">
                I
              </div>
              {!desktopCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-1">
                    Invest<span className="text-amber-600">Zora</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Wealth Portal (USD)
                  </span>
                </div>
              )}
            </Link>
          </div>

          {renderNavLinks(desktopCollapsed)}
        </div>

        {/* Footer & Toggle Action */}
        <div className="pt-6 border-t border-amber-100 space-y-3">
          {!desktopCollapsed && (
            <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-3.5 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Cold-Vault Protected</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Multi-signature asset custody with 100% reserve backing in USD.
              </p>
            </div>
          )}

          <button
            onClick={onToggleDesktop}
            className={`w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-800 hover:bg-amber-50/70 hover:border-amber-300 transition text-xs font-bold flex items-center ${
              desktopCollapsed ? 'justify-center' : 'justify-between'
            } cursor-pointer`}
            title={desktopCollapsed ? 'Expand sidebar' : 'Close off sidebar for wide view'}
          >
            {!desktopCollapsed && <span>Close Sidebar View</span>}
            {desktopCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
