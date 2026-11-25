import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Save,
  RotateCcw,
  Camera,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Zap,
  Info
} from 'lucide-react';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  message?: string | null;
  idProofUrl?: string | null;
  photoUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedBronzeReturn?: number | null;
  assignedSilverReturn?: number | null;
  assignedGoldReturn?: number | null;
  assignedReferralRate?: number | null;
  assignedBronzeReferral?: number | null;
  assignedSilverReferral?: number | null;
  assignedGoldReferral?: number | null;
  createdAt?: string;
  reviewedAt?: string | null;
}

type ApprovalRates = {
  bronzeReturnRate: string;
  silverReturnRate: string;
  goldReturnRate: string;
  bronzeReferralRate: string;
  silverReferralRate: string;
  goldReferralRate: string;
};

function parseDocuments(idProofUrl?: string | null, photoUrl?: string | null) {
  let front = '';
  let back = '';
  const photo = photoUrl || '';

  if (idProofUrl) {
    if (idProofUrl.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(idProofUrl);
        front = parsed.front || '';
        back = parsed.back || '';
      } catch (e) {
        front = idProofUrl;
      }
    } else if (idProofUrl.includes(',')) {
      const parts = idProofUrl.split(',');
      front = parts[0]?.trim() || '';
      back = parts[1]?.trim() || '';
    } else {
      front = idProofUrl;
    }
  }

  return { front, back, photo };
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Plan rates state per lead
  const [rates, setRates] = useState<Record<string, ApprovalRates>>({});
  
  // Leads currently in "Edit Rates" mode (for already approved accounts)
  const [editingLeadIds, setEditingLeadIds] = useState<Record<string, boolean>>({});
  
  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Re-upload request dialog state
  const [reuploadDialog, setReuploadDialog] = useState<{
    isOpen: boolean;
    leadId: string;
    leadName: string;
    reason: string;
  }>({
    isOpen: false,
    leadId: '',
    leadName: '',
    reason: 'ID Proof is blurry or unreadable. Please upload a clear photo.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLeads = async (status: string) => {
    setIsLoading(true);
    try {
      const params = status === 'ALL' ? {} : { status };
      const response = await adminApi.get('/admin/leads', { params });
      const loadedLeads: Lead[] = response.data?.leads || [];
      setLeads(loadedLeads);

      // Pre-populate rates from existing assigned values or sensible defaults
      const initialRates: Record<string, ApprovalRates> = {};
      loadedLeads.forEach((lead) => {
        initialRates[lead.id] = {
          bronzeReturnRate: lead.assignedBronzeReturn?.toString() || '1.5',
          silverReturnRate: lead.assignedSilverReturn?.toString() || '2.0',
          goldReturnRate: lead.assignedGoldReturn?.toString() || '2.5',
          bronzeReferralRate: (lead.assignedBronzeReferral ?? lead.assignedReferralRate)?.toString() || '2.0',
          silverReferralRate: lead.assignedSilverReferral?.toString() || '2.5',
          goldReferralRate: lead.assignedGoldReferral?.toString() || '3.0',
        };
      });
      setRates(initialRates);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to load leads.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads(statusFilter);
  }, [statusFilter]);

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  const handleRateChange = (leadId: string, field: keyof ApprovalRates, value: string) => {
    setRates((prev) => ({
      ...prev,
      [leadId]: {
        ...(prev[leadId] || {
          bronzeReturnRate: '1.5',
          silverReturnRate: '2.0',
          goldReturnRate: '2.5',
          bronzeReferralRate: '2.0',
          silverReferralRate: '2.5',
          goldReferralRate: '3.0'
        }),
        [field]: value,
      },
    }));
  };

  const handleApplyPreset = (leadId: string, tierLevel: 'standard' | 'high' | 'conservative') => {
    let preset: ApprovalRates;
    if (tierLevel === 'standard') {
      preset = {
        bronzeReturnRate: '1.5',
        silverReturnRate: '2.0',
        goldReturnRate: '2.5',
        bronzeReferralRate: '2.0',
        silverReferralRate: '2.5',
        goldReferralRate: '3.0'
      };
    } else if (tierLevel === 'high') {
      preset = {
        bronzeReturnRate: '2.0',
        silverReturnRate: '2.5',
        goldReturnRate: '3.0',
        bronzeReferralRate: '2.5',
        silverReferralRate: '3.0',
        goldReferralRate: '3.5'
      };
    } else {
      preset = {
        bronzeReturnRate: '1.2',
        silverReturnRate: '1.8',
        goldReturnRate: '2.2',
        bronzeReferralRate: '1.5',
        silverReferralRate: '2.0',
        goldReferralRate: '2.5'
      };
    }

    setRates((prev) => ({
      ...prev,
      [leadId]: preset
    }));
    toast.info(`Applied ${tierLevel} plan rates preset.`);
  };

  const handleApprove = async (leadId: string) => {
    const rate = rates[leadId];
    if (
      !rate?.bronzeReturnRate ||
      !rate?.silverReturnRate ||
      !rate?.goldReturnRate ||
      !rate?.bronzeReferralRate ||
      !rate?.silverReferralRate ||
      !rate?.goldReferralRate
    ) {
      toast.error('Please configure all plan return rates and referral bonus rates before approving.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await adminApi.post(`/admin/leads/${leadId}/approve`, {
        bronzeReturnRate: parseFloat(rate.bronzeReturnRate),
        silverReturnRate: parseFloat(rate.silverReturnRate),
        goldReturnRate: parseFloat(rate.goldReturnRate),
        bronzeReferralRate: parseFloat(rate.bronzeReferralRate),
        silverReferralRate: parseFloat(rate.silverReferralRate),
        goldReferralRate: parseFloat(rate.goldReferralRate),
      });

      const responseMsg = response.data?.message;
      if (response.data?.emailSent === false) {
        toast.warning(responseMsg || 'Lead approved! Account activated, but SMTP email sending failed.');
      } else {
        toast.success(responseMsg || 'Lead approved! Activation email dispatched.');
      }
      await loadLeads(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to approve lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUpdatedRates = async (leadId: string) => {
    const rate = rates[leadId];
    if (
      !rate?.bronzeReturnRate ||
      !rate?.silverReturnRate ||
      !rate?.goldReturnRate ||
      !rate?.bronzeReferralRate ||
      !rate?.silverReferralRate ||
      !rate?.goldReferralRate
    ) {
      toast.error('Please provide all plan return rates and referral rates.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.put(`/admin/leads/${leadId}/rates`, {
        bronzeReturnRate: parseFloat(rate.bronzeReturnRate),
        silverReturnRate: parseFloat(rate.silverReturnRate),
        goldReturnRate: parseFloat(rate.goldReturnRate),
        bronzeReferralRate: parseFloat(rate.bronzeReferralRate),
        silverReferralRate: parseFloat(rate.silverReferralRate),
        goldReferralRate: parseFloat(rate.goldReferralRate),
      });

      toast.success('Plan rates updated successfully!');
      setEditingLeadIds((prev) => ({ ...prev, [leadId]: false }));
      await loadLeads(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update rates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (leadId: string) => {
    if (!confirm('Are you sure you want to reject this applicant?')) return;
    setIsSubmitting(true);
    try {
      await adminApi.post(`/admin/leads/${leadId}/reject`);
      toast.success('Lead rejected.');
      await loadLeads(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to reject lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReuploadRequest = async () => {
    if (!reuploadDialog.leadId) return;
    setIsSubmitting(true);
    try {
      await adminApi.post(`/admin/leads/${reuploadDialog.leadId}/request-reupload`, {
        reason: reuploadDialog.reason,
      });
      toast.success('Re-upload notification sent to user profile!');
      setReuploadDialog({ isOpen: false, leadId: '', leadName: '', reason: '' });
      await loadLeads(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send re-upload notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Investor KYC Verification
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Leads & Account Approvals
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Inspect uploaded ID Proofs (Front & Back) and live photos, configure single unified plan rates, and approve accounts.
            </p>
          </div>

          <button
            onClick={() => void loadLeads(statusFilter)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                  statusFilter === status
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent" />
          <p className="mt-3 text-sm font-semibold text-slate-600">Loading applicant records...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 shadow-sm">
          <FileCheck className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applicants found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No leads match your current status filter &quot;{statusFilter}&quot; or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLeads.map((lead) => {
            const docs = parseDocuments(lead.idProofUrl, lead.photoUrl);
            const currentRate = rates[lead.id] || {
              bronzeReturnRate: lead.assignedBronzeReturn?.toString() || '5.0',
              silverReturnRate: lead.assignedSilverReturn?.toString() || '8.5',
              goldReturnRate: lead.assignedGoldReturn?.toString() || '12.0',
              bronzeReferralRate: (lead.assignedBronzeReferral ?? lead.assignedReferralRate)?.toString() || '2.0',
              silverReferralRate: lead.assignedSilverReferral?.toString() || '3.5',
              goldReferralRate: lead.assignedGoldReferral?.toString() || '5.0',
            };
            const isEditing = editingLeadIds[lead.id];

            return (
              <div
                key={lead.id}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Lead Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 font-black text-lg shadow-sm">
                      {lead.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg font-black text-slate-900">{lead.fullName}</h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            lead.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <strong className="text-slate-700">{lead.email}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lead.phone}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lead.country}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {lead.createdAt && (
                    <div className="text-right text-xs text-slate-400 flex sm:flex-col items-center sm:items-end justify-between">
                      <span className="font-semibold text-slate-500">Registered</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* Notice if lead has a message or notification */}
                  {lead.message && (
                    <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="font-semibold">Applicant Note / Status History:</strong> {lead.message}
                      </div>
                    </div>
                  )}

                  {/* KYC Documents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-slate-700" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Automated KYC Documents & Biometrics
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Automated Storage Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Front ID */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                          <span>1. ID Proof (Front)</span>
                          {docs.front ? (
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">Uploaded</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">Pending</span>
                          )}
                        </div>
                        {docs.front ? (
                          <div
                            onClick={() => setLightboxImage({ url: docs.front, title: `${lead.fullName} - ID Proof (Front)` })}
                            className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-200"
                          >
                            <img
                              src={docs.front}
                              alt="ID Front"
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                              <Eye className="h-4 w-4" />
                              <span>Click to Zoom</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 text-xs">
                            <FileText className="h-6 w-6 mb-1 text-slate-300" />
                            <span>No Front ID</span>
                          </div>
                        )}
                      </div>

                      {/* Back ID */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                          <span>2. ID Proof (Back)</span>
                          {docs.back ? (
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">Uploaded</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">Pending</span>
                          )}
                        </div>
                        {docs.back ? (
                          <div
                            onClick={() => setLightboxImage({ url: docs.back, title: `${lead.fullName} - ID Proof (Back)` })}
                            className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-200"
                          >
                            <img
                              src={docs.back}
                              alt="ID Back"
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                              <Eye className="h-4 w-4" />
                              <span>Click to Zoom</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 text-xs">
                            <FileText className="h-6 w-6 mb-1 text-slate-300" />
                            <span>No Back ID</span>
                          </div>
                        )}
                      </div>

                      {/* Live Selfie */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                          <span>3. Live Photograph</span>
                          {docs.photo ? (
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">Uploaded</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">Pending</span>
                          )}
                        </div>
                        {docs.photo ? (
                          <div
                            onClick={() => setLightboxImage({ url: docs.photo, title: `${lead.fullName} - Live Photo` })}
                            className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-200"
                          >
                            <img
                              src={docs.photo}
                              alt="Live Photo"
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                              <Eye className="h-4 w-4" />
                              <span>Click to Zoom</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 text-xs">
                            <Camera className="h-6 w-6 mb-1 text-slate-300" />
                            <span>No Live Photo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Unclear Image Warning Action */}
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setReuploadDialog({
                            isOpen: true,
                            leadId: lead.id,
                            leadName: lead.fullName,
                            reason: 'Document or photograph is blurry or unreadable. Please re-upload clear photos.'
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Request Document Re-upload (Image Unclear)</span>
                      </button>
                    </div>
                  </div>

                  {/* Unified Plan Rates Section (Single Section at Bottom) */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Tier Investment Plan & Referral Commission Rates</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Single unified rate configuration: Daily/Monthly Return % & Referral Commission % for Bronze, Silver, and Gold.
                        </p>
                      </div>

                      {/* Action buttons on top of plan card */}
                      <div className="flex items-center gap-2">
                        {lead.status === 'APPROVED' && !isEditing && (
                          <button
                            type="button"
                            onClick={() => setEditingLeadIds((prev) => ({ ...prev, [lead.id]: true }))}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-amber-600" />
                            <span>Edit Rates</span>
                          </button>
                        )}

                        {(lead.status === 'PENDING' || isEditing) && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-400">Presets:</span>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset(lead.id, 'standard')}
                              className="text-[11px] font-bold px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                            >
                              Standard
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset(lead.id, 'high')}
                              className="text-[11px] font-bold px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                            >
                              VIP High
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Unified 3-Column Plan Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Bronze Card */}
                      <div className="rounded-xl border border-amber-800/20 bg-amber-500/5 p-4 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                            Bronze Plan
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Starter
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Return Rate (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 5.0"
                                value={currentRate.bronzeReturnRate}
                                onChange={(e) => handleRateChange(lead.id, 'bronzeReturnRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedBronzeReturn ?? currentRate.bronzeReturnRate}%
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Referral Commission (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 2.0"
                                value={currentRate.bronzeReferralRate}
                                onChange={(e) => handleRateChange(lead.id, 'bronzeReferralRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedBronzeReferral ?? lead.assignedReferralRate ?? currentRate.bronzeReferralRate}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Silver Card */}
                      <div className="rounded-xl border border-slate-300 bg-slate-200/30 p-4 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                            Silver Plan
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                            Advanced
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Return Rate (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 8.5"
                                value={currentRate.silverReturnRate}
                                onChange={(e) => handleRateChange(lead.id, 'silverReturnRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedSilverReturn ?? currentRate.silverReturnRate}%
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Referral Commission (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 3.5"
                                value={currentRate.silverReferralRate}
                                onChange={(e) => handleRateChange(lead.id, 'silverReferralRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedSilverReferral ?? currentRate.silverReferralRate}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Gold Card */}
                      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-yellow-800">
                            Gold Plan
                          </span>
                          <span className="text-[10px] font-bold text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded-full">
                            Executive VIP
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Return Rate (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 12.0"
                                value={currentRate.goldReturnRate}
                                onChange={(e) => handleRateChange(lead.id, 'goldReturnRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedGoldReturn ?? currentRate.goldReturnRate}%
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Referral Commission (%)
                            </label>
                            {lead.status === 'PENDING' || isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 5.0"
                                value={currentRate.goldReferralRate}
                                onChange={(e) => handleRateChange(lead.id, 'goldReferralRate', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            ) : (
                              <div className="text-base font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                {lead.assignedGoldReferral ?? currentRate.goldReferralRate}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
                      {isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingLeadIds((prev) => ({ ...prev, [lead.id]: false }))}
                            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void handleSaveUpdatedRates(lead.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-sm"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save Rates</span>
                          </button>
                        </>
                      )}

                      {lead.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void handleReject(lead.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject Lead</span>
                          </button>

                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void handleApprove(lead.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Approve & Activate Account</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-amber-400" />
                {lightboxImage.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-auto bg-slate-950">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-end">
              <a
                href={lightboxImage.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
              >
                <span>Open Raw Image</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Request Re-upload Modal */}
      {reuploadDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <ShieldAlert className="h-5 w-5" />
                <span>Request Document Re-upload</span>
              </div>
              <button
                type="button"
                onClick={() => setReuploadDialog({ isOpen: false, leadId: '', leadName: '', reason: '' })}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Send an automated notification to <strong className="text-slate-900">{reuploadDialog.leadName}</strong> to re-upload clear photos on their profile page.
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-slate-700">Reason / Notice Message:</label>
              <textarea
                rows={3}
                value={reuploadDialog.reason}
                onChange={(e) => setReuploadDialog((prev) => ({ ...prev, reason: e.target.value }))}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setReuploadDialog((prev) => ({
                      ...prev,
                      reason: 'ID Proof is blurry or unreadable. Please upload a clear photo.'
                    }))
                  }
                  className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  Blurry ID
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReuploadDialog((prev) => ({
                      ...prev,
                      reason: 'Back side of ID card is missing or cutoff. Please upload both sides.'
                    }))
                  }
                  className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  Back Missing
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReuploadDialog((prev) => ({
                      ...prev,
                      reason: 'Selfie photo does not match the photo on the identity card.'
                    }))
                  }
                  className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                >
                  Selfie Mismatch
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReuploadDialog({ isOpen: false, leadId: '', leadName: '', reason: '' })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSendReuploadRequest()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Notification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
