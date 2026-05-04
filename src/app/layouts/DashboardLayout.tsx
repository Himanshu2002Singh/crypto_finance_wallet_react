import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardNavbar } from '../components/dashboard/DashboardNavbar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <DashboardNavbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
