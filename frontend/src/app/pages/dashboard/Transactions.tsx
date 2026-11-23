import { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  ArrowDownToLine,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  Search,
  ExternalLink,
  Info,
  X,
  MessageSquare,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface Withdrawal {
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
}

const NETWORKS = [
  { id: 'USDT (TRC20)', name: 'USDT (TRC20) — Recommended (Fast & Low Fee)' },
  { id: 'USDT (ERC20)', name: 'USDT (ERC20) — Ethereum Network' },
  { id: 'Bitcoin (BTC)', name: 'Bitcoin (BTC) — Native Chain' },
  { id: 'Ethereum (ETH)', name: 'Ethereum (ETH) — Mainnet' },
  { id: 'Solana (SOL)', name: 'Solana (SOL) — SPL' },
];

export function Transactions() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // New Withdrawal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    network: 'USDT (TRC20)',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/withdrawals');
      setWithdrawals(response.data?.withdrawals || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load transaction history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWithdrawals();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Wallet address copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenModal = () => {
    setFormData({
      amount: '',
      walletAddress: '',
      network: 'USDT (TRC20)',
      password: '',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid withdrawal amount.');
      return;
    }

    if (!formData.walletAddress.trim() || formData.walletAddress.trim().length < 8) {
      toast.error('Please enter a valid destination crypto wallet address.');
      return;
    }

    if (!formData.password) {
      toast.error('Authentication password is required to authorize withdrawal.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/users/withdrawals', {
        amount: amt,
        walletAddress: formData.walletAddress.trim(),
        network: formData.network,
        password: formData.password,
      });

      toast.success('Withdrawal request authorized and submitted to compliance desk!');
      setIsModalOpen(false);
      await loadWithdrawals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Withdrawal authorization failed. Please check password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    let totalSettled = 0;
    let pendingCount = 0;
    let pendingSum = 0;

    withdrawals.forEach((w) => {
      const amt = Number(w.amount) || 0;
      if (w.status === 'APPROVED') {
        totalSettled += amt;
      } else if (w.status === 'PENDING') {
        pendingCount += 1;
        pendingSum += amt;
      }
    });

    return { totalSettled, pendingCount, pendingSum };
  }, [withdrawals]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        w.walletAddress.toLowerCase().includes(q) ||
        w.network.toLowerCase().includes(q) ||
        (w.txHash && w.txHash.toLowerCase().includes(q)) ||
        w.amount.toString().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [withdrawals, statusFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transactions & Capital Withdrawals
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Authorize and track crypto wallet payouts, settlement receipts, and blockchain transactions.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Request Capital Withdrawal</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Settled</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹ {stats.totalSettled.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Disbursed to destination wallets</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Review</span>
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            ₹ {stats.pendingSum.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">{stats.pendingCount} request(s) awaiting approval</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Compulsory Contact</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 truncate">
            {user?.phone || 'Not Linked'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">WhatsApp Verified Channel</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Security Protocol</span>
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            Authenticated Gate
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mandatory Password Verification</p>
        </div>
      </div>

      {/* Main Transactions Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center rounded-xl bg-slate-200/80 p-1 self-start">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                  statusFilter === status
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search wallet, txhash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => void loadWithdrawals()}
              title="Refresh"
              className="p-2 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading your transaction records...</p>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t submitted any withdrawal requests yet, or no records match your filter.
            </p>
            <button
              onClick={handleOpenModal}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Submit First Withdrawal
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Date / ID</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Destination Wallet</th>
                  <th className="px-5 py-3.5">Network</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Settlement Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredWithdrawals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.id.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900">
                        ₹ {Number(item.amount).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md max-w-xs truncate">
                        <span className="truncate">{item.walletAddress}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.walletAddress, item.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Copy Address"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      {copiedId === item.id && (
                        <span className="text-[9px] text-emerald-600 font-bold">Copied!</span>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-700">{item.network}</span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {item.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="h-3 w-3" />
                          Settled
                        </span>
                      ) : item.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                          <XCircle className="h-3 w-3" />
                          Declined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] animate-pulse">
                          <Clock className="h-3 w-3" />
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.txHash ? (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-600">
                          <span className="truncate max-w-[150px]">{item.txHash}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.txHash!, `tx-${item.id}`)}
                            title="Copy TxHash"
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ) : item.adminNote ? (
                        <div className="text-[11px] text-slate-500 italic max-w-xs truncate">
                          {item.adminNote}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Awaiting blockchain hash</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <ArrowDownToLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Request Capital Withdrawal</h3>
                  <p className="text-xs text-slate-500">Provide destination wallet and authenticate request</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  min="100"
                  placeholder="e.g. 10000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-semibold text-slate-400">Quick Fill:</span>
                  {[5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Crypto Network *
                </label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  {NETWORKS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Wallet Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Crypto Wallet Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Txyz... or 0xabc... or bc1q..."
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Ensure address matches the selected network. Double check all characters.
                </p>
              </div>

              {/* Compulsory WhatsApp Contact Banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <span>Compulsory WhatsApp Notification Channel</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  For anti-fraud verification, all withdrawal updates & confirmation receipts are dispatched directly to your registered WhatsApp mobile:{' '}
                  <strong className="text-emerald-950 font-black">+{user?.phone}</strong>.
                </p>
              </div>

              {/* Authentication Security Gate */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                    <span>Authorize with Account Password *</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Security Gate
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password to authorize"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Authentication is strictly required before any withdrawal can be dispatched.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-60"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isSubmitting ? 'Authenticating & Submitting...' : 'Authenticate & Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
