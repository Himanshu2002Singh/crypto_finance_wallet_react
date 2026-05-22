import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCheck,
  X,
} from 'lucide-react';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: UserCheck, label: 'Leads', path: '/admin/leads' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6">
        <Link to="/admin" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-950">InvestPro</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin Panel</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="Close admin menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 md:sticky md:top-0 md:block md:h-screen">
        {sidebar}
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-950/40"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close admin menu backdrop"
          />
          <aside className="relative h-full w-72 max-w-[86vw] border-r border-gray-200 shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Open admin menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin</p>
                <h1 className="text-lg font-bold text-gray-950 sm:text-xl">Dashboard Panel</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
