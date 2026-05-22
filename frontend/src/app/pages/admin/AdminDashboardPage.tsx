import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { CheckCircle2, Clock3, UserCheck, Users } from 'lucide-react';

interface AdminMetrics {
  totalLeads: number;
  pendingLeads: number;
  approvedUsers: number;
  activeUsers: number;
}

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const response = await adminApi.get('/admin/dashboard');
      setMetrics(response.data);
    };
    void loadMetrics();
  }, []);

  const cards = [
    { icon: Users, label: 'Total Leads', value: metrics?.totalLeads ?? '--', color: 'bg-indigo-50 text-indigo-700' },
    { icon: Clock3, label: 'Pending Users', value: metrics?.pendingLeads ?? '--', color: 'bg-amber-50 text-amber-700' },
    { icon: UserCheck, label: 'Approved Users', value: metrics?.approvedUsers ?? '--', color: 'bg-sky-50 text-sky-700' },
    { icon: CheckCircle2, label: 'Active Users', value: metrics?.activeUsers ?? '--', color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">Overview</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Admin Dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              Monitor lead approvals and user activation progress.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Default View</div>
            <div className="mt-1 text-sm font-bold text-gray-900">Dashboard</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">{card.label}</div>
                <div className="mt-3 text-3xl font-bold text-gray-950">{card.value}</div>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
