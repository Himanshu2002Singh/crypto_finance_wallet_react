import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Users,
  Clock3,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Server,
  Zap,
  Sparkles
} from 'lucide-react';

interface AdminMetrics {
  totalLeads: number;
  pendingLeads: number;
  approvedUsers: number;
  activeUsers: number;
}

interface RecentLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricRes, leadsRes] = await Promise.all([
          adminApi.get('/admin/dashboard'),
          adminApi.get('/admin/leads', { params: { status: 'PENDING' } })
        ]);
        setMetrics(metricRes.data);
        if (leadsRes.data && Array.isArray(leadsRes.data.leads)) {
          setRecentLeads(leadsRes.data.leads.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, []);

  const cards = [
    {
      icon: Users,
      label: 'Total Applications',
      value: metrics?.totalLeads ?? 0,
      description: 'All-time registration inquiries',
      gradient: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock3,
      label: 'Pending KYC Review',
      value: metrics?.pendingLeads ?? 0,
      description: 'Awaiting ID & photo verification',
      gradient: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      highlight: true
    },
    {
      icon: UserCheck,
      label: 'Approved Accounts',
      value: metrics?.approvedUsers ?? 0,
      description: 'KYC verified & plan assigned',
      gradient: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: TrendingUp,
      label: 'Active Investors',
      value: metrics?.activeUsers ?? 0,
      description: 'Active portfolio holders',
      gradient: 'from-purple-600 to-violet-700',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              <span>InvestPro Executive Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Administration Overview
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Real-time monitoring for investor onboarding, automated identity verification (ID Front, Back & Selfie), and tier return rate controls.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 text-sm font-bold shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Review KYC Leads</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                card.highlight ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isLoading ? '...' : card.value}
                </span>
                {card.highlight && (metrics?.pendingLeads ?? 0) > 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Needs Action
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500 font-medium">
                {card.description}
              </p>

              {card.highlight && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/admin/leads"
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 group"
                  >
                    <span>Inspect Pending queue</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Action & System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leads Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Applications Pending Verification</h3>
              <p className="text-xs text-slate-500">Latest user signups awaiting document review & plan assignment</p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-10 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-sm font-bold text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">There are no pending applications waiting for review.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-lg transition">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{lead.fullName}</div>
                    <div className="text-xs text-slate-500 truncate">{lead.email} · {lead.country}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      Pending
                    </span>
                    <Link
                      to="/admin/leads"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Diagnostics & Operations */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Server className="h-4 w-4 text-slate-700" />
              <span>System Health & Integrations</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">REST API Engine</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Active (Port 4004)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">PostgreSQL Database</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Prisma ORM Synced
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">KYC Storage</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Cloudinary / Secure Vault
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Email Dispatcher</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  SMTP Managed Safe Mode
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Automated Verification Policy</h4>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Verify user ID Front, Back, and Live Photograph before approving account rates. If any document is blurred, click &quot;Request Re-upload&quot; to notify the user.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
