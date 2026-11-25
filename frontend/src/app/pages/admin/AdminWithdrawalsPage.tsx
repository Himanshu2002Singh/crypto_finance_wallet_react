import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';
import {
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  MessageCircle,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Send,
  FileText,
  ShieldCheck,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface WithdrawalRequest {
  id: string;
  amount: number | string;
  walletAddress: string;
  network: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  txHash?: string | null;
  adminNote?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  user: {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
  };
}

export function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Approval Modal State
  const [approveDialog, setApproveDialog] = useState<{
    isOpen: boolean;
    withdrawal: WithdrawalRequest | null;
    txHash: string;
    note: string;
  }>({
    isOpen: false,
    withdrawal: null,
    txHash: '',
    note: 'Disbursed via TRC20 hot wallet.'
  });

  // Rejection Modal State
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    withdrawal: WithdrawalRequest | null;
    note: string;
  }>({
    isOpen: false,
    withdrawal: null,
    note: 'Wallet address invalid or network mismatch. Please review.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWithdrawals = async (status: string) => {
    setIsLoading(true);
    try {
      const params = status === 'ALL' ? {} : { status };
      const response = await adminApi.get('/admin/withdrawals', { params });
      setRequests(response.data?.withdrawals || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to load withdrawal records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWithdrawals(statusFilter);
  }, [statusFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        r.user.fullName.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q) ||
        r.user.phone.toLowerCase().includes(q) ||
        r.walletAddress.toLowerCase().includes(q) ||
        r.network.toLowerCase().includes(q) ||
        (r.txHash && r.txHash.toLowerCase().includes(q))
      );
    });
  }, [requests, searchQuery]);

  const handleApprove = async () => {
    if (!approveDialog.withdrawal) return;
    setIsSubmitting(true);
    try {
      await adminApi.post(`/admin/withdrawals/${approveDialog.withdrawal.id}/approve`, {
        txHash: approveDialog.txHash,
        note: approveDialog.note,
      });

      toast.success('Withdrawal request approved and marked settled!');
      setApproveDialog({ isOpen: false, withdrawal: null, txHash: '', note: '' });
      await loadWithdrawals(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve withdrawal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.withdrawal) return;
    setIsSubmitting(true);
    try {
      await adminApi.post(`/admin/withdrawals/${rejectDialog.withdrawal.id}/reject`, {
        note: rejectDialog.note,
      });

      toast.success('Withdrawal request marked rejected.');
      setRejectDialog({ isOpen: false, withdrawal: null, note: '' });
      await loadWithdrawals(statusFilter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject withdrawal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppUrl = (phone: string, name: string, amount: number | string, wallet: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${name}, this is InvestZora Compliance regarding your withdrawal request of $${Number(amount).toLocaleString()} USD to crypto wallet ${wallet}. Please verify if you authorized this withdrawal.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              <Wallet className="h-3.5 w-3.5" />
              <span>Capital Outflow & Settlements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Withdrawal Requests
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Review destination crypto wallets, verify via compulsory WhatsApp mobile, and disburse blockchain settlements.
            </p>
          </div>

          <button
            onClick={() => void loadWithdrawals(statusFilter)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
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

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, wallet, txhash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-slate-600">Loading withdrawal queue...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200 shadow-sm">
          <Wallet className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No withdrawal requests found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are no requests matching status &quot;{statusFilter}&quot; or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* User & Request Info */}
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-black text-slate-900">{req.user.fullName}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Requested on {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <strong className="text-slate-700">{req.user.email}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{req.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{req.user.country}</span>
                    </span>
                  </div>

                  {/* Destination Wallet Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Target Crypto Wallet & Network:
                      </span>
                      <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {req.network}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      <span className="font-mono text-xs text-slate-900 font-bold truncate">
                        {req.walletAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(req.walletAddress, req.id)}
                        className="text-slate-400 hover:text-slate-800 p-1"
                        title="Copy Address"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Account Password Authenticated
                      </span>
                      <span className="text-slate-400">
                        Compulsory Verified Contact: {req.phone}
                      </span>
                    </div>
                  </div>

                  {/* Settlement Note / TxHash if available */}
                  {(req.txHash || req.adminNote) && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      {req.txHash && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <strong className="text-slate-700 font-sans">TxHash:</strong>
                          <span className="text-indigo-600 truncate">{req.txHash}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(req.txHash!, `tx-${req.id}`)}
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {req.adminNote && (
                        <div>
                          <strong className="text-slate-700">Audit Note:</strong> {req.adminNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Amount & Actions Column */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between items-start lg:items-end gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="lg:text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Withdrawal Amount
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      $ {Number(req.amount).toLocaleString()} USD
                    </span>
                  </div>

                  {/* WhatsApp Quick Verification Button */}
                  <a
                    href={getWhatsAppUrl(req.phone, req.user.fullName, req.amount, req.walletAddress)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Contact Verify</span>
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </a>

                  {/* Actions if Pending */}
                  {req.status === 'PENDING' && (
                    <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() =>
                          setRejectDialog({
                            isOpen: true,
                            withdrawal: req,
                            note: 'Wallet verification or contact confirmation declined.'
                          })
                        }
                        className="w-full py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setApproveDialog({
                            isOpen: true,
                            withdrawal: req,
                            txHash: '',
                            note: 'Settled via crypto treasury hot wallet.'
                          })
                        }
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                      >
                        Approve & Settle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      {approveDialog.isOpen && approveDialog.withdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Approve & Settle Withdrawal</span>
              </div>
              <button
                type="button"
                onClick={() => setApproveDialog({ isOpen: false, withdrawal: null, txHash: '', note: '' })}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 text-xs text-slate-700">
              <p>
                Approving settlement of <strong className="text-slate-900">${Number(approveDialog.withdrawal.amount).toLocaleString()} USD</strong> to:
              </p>
              <div className="p-2 rounded bg-slate-50 font-mono text-[11px] break-all border border-slate-200">
                {approveDialog.withdrawal.walletAddress} ({approveDialog.withdrawal.network})
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blockchain Transaction Hash (TxID) [Optional]:
                </label>
                <input
                  type="text"
                  placeholder="0x... or txid hash"
                  value={approveDialog.txHash}
                  onChange={(e) => setApproveDialog({ ...approveDialog, txHash: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Audit Settlement Note:
                </label>
                <input
                  type="text"
                  value={approveDialog.note}
                  onChange={(e) => setApproveDialog({ ...approveDialog, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setApproveDialog({ isOpen: false, withdrawal: null, txHash: '', note: '' })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleApprove()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-sm disabled:opacity-60"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectDialog.isOpen && rejectDialog.withdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <XCircle className="h-5 w-5" />
                <span>Reject Withdrawal Request</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectDialog({ isOpen: false, withdrawal: null, note: '' })}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 text-xs text-slate-700">
              <p>
                Reject withdrawal of <strong className="text-slate-900">${Number(rejectDialog.withdrawal.amount).toLocaleString()} USD</strong> requested by <strong className="text-slate-900">{rejectDialog.withdrawal.user.fullName}</strong>.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rejection Reason / Compliance Note:
                </label>
                <textarea
                  rows={3}
                  value={rejectDialog.note}
                  onChange={(e) => setRejectDialog({ ...rejectDialog, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRejectDialog({ isOpen: false, withdrawal: null, note: '' })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleReject()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition shadow-sm disabled:opacity-60"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

