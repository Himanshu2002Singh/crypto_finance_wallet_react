import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface WithdrawalRecord {
  id: string;
  amount: number | string;
  walletAddress: string;
  network: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  txHash?: string | null;
  adminNote?: string | null;
  createdAt: string;
}

export function WithdrawalRequest() {
  const { user } = useAuth();
  const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');
  const storageKey = `payout_wallet_${user?.id || userId}`;

  const [savedWallet, setSavedWallet] = useState<string>(() => {
    return localStorage.getItem(storageKey) || '';
  });

  const [amount, setAmount] = useState<string>('500');
  const [network, setNetwork] = useState<string>('USDT (TRC20)');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    setIsLoadingList(true);
    try {
      const res = await api.get('/users/withdrawals');
      if (res.data?.withdrawals) {
        setWithdrawals(res.data.withdrawals);
      }
    } catch (e: any) {
      console.warn('Unable to load withdrawals:', e?.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    // Keep wallet address synced
    const stored = localStorage.getItem(storageKey) || '';
    setSavedWallet(stored);
    void fetchWithdrawals();
  }, [user, storageKey]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!savedWallet) {
      toast.error('Please configure your Payout Wallet Address in Profile before requesting withdrawal.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 50) {
      toast.error('Minimum withdrawal amount is $50 USD.');
      return;
    }

    if (!password) {
      toast.error('Account password is required to authorize withdrawal.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/users/withdrawals', {
        amount: numAmount,
        walletAddress: savedWallet,
        network,
        password,
      });

      toast.success('Withdrawal request submitted successfully! Processing time: 24–48 hours.');
      setPassword('');
      await fetchWithdrawals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit withdrawal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-xl shadow-amber-500/15 border border-amber-300">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Capital & Yield Settlement (USD Vault)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">Withdrawal Request Concierge</h1>
        <p className="text-slate-900/90 text-sm max-w-xl font-medium">
          Request payout of your accrued interest yields or principal capital. All disbursements are automatically routed to your verified profile wallet address.
        </p>
      </div>

      {/* Wallet Unlinked Warning Banner */}
      {!savedWallet && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900 font-bold">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-950">
                Payout Wallet Address Required
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Before submitting a withdrawal request, you must register your payout wallet address in your Profile. Once saved, it will be permanently linked and locked to your account.
              </div>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Set Wallet in Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Main Request Form Card */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <ArrowDownCircle className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950">Submit New Withdrawal</h2>
              <p className="text-xs text-slate-500">Zero processing fees • Settled within 24–48 hours</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Automated Audit Active
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Registered Wallet Address (STRICTLY READ-ONLY / NOT EDITABLE) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Destination Payout Wallet (Permanently Bound to Profile)</span>
              </label>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                Non-Editable
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={savedWallet || 'No wallet registered yet — Link in Profile first'}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs sm:text-sm font-bold text-slate-900 cursor-not-allowed select-all"
              />
              {savedWallet && (
                <button
                  type="button"
                  onClick={() => handleCopy(savedWallet, 'input')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
                  title="Copy Wallet"
                >
                  {copiedId === 'input' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Withdrawal funds can only be sent to your registered profile wallet address to eliminate unauthorized redirection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Withdrawal Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                <input
                  type="number"
                  min={50}
                  step="10"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min $50"
                  className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 font-black text-lg text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Minimum: $50 USD • Maximum: Current Balance</span>
            </div>

            {/* Network */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Disbursement Crypto Network
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="USDT (TRC20)">USDT (TRC20 - TRON Network)</option>
                <option value="USDC (ERC20)">USDC (ERC20 - Ethereum / Polygon)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">Network gas covered by platform</span>
            </div>
          </div>

          {/* Account Password Authorization */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Authorize with Account Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your login password to confirm identity"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Required to prevent accidental or unauthorized payout requests.
            </span>
          </div>

          {/* Security Guarantee Box */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4.5 flex items-start gap-3.5 text-xs text-amber-950">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-black text-amber-950 mb-0.5">Automated Settlement SLA:</strong>
              Withdrawal requests undergo multi-sig authorization and are disbursed within 24–48 hours directly to your immutable profile wallet address. You will receive real-time status and blockchain transaction hash upon completion.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !savedWallet}
            className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowDownCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Authorizing Payout Request...' : `Authorize & Request Withdrawal of $${Number(amount || 0).toLocaleString()} USD`}</span>
          </button>
        </form>
      </div>

      {/* Withdrawal History Card */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div>
            <h2 className="text-xl font-black text-slate-950">Withdrawal Request History</h2>
            <p className="text-xs text-slate-500">Track all past and pending payout requests</p>
          </div>
          <button
            type="button"
            onClick={fetchWithdrawals}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {isLoadingList ? (
          <div className="py-12 text-center text-xs text-slate-500 font-semibold">
            Loading your withdrawal history...
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-100">
            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">No Withdrawal Requests Yet</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When you submit a withdrawal request, its live verification status, transaction hash, and timestamp will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Date & Time</th>
                  <th className="py-3 px-4 font-bold">Amount (USD)</th>
                  <th className="py-3 px-4 font-bold">Network</th>
                  <th className="py-3 px-4 font-bold">Destination Wallet</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Tx Hash / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => {
                  const dateStr = new Date(w.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={w.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-950 text-sm whitespace-nowrap">
                        ${Number(w.amount).toLocaleString()} USD
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {w.network}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[140px]" title={w.walletAddress}>
                            {w.walletAddress}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(w.walletAddress, w.id)}
                            className="p-1 hover:text-amber-800 transition"
                            title="Copy Wallet"
                          >
                            {copiedId === w.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {w.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved & Settled</span>
                          </span>
                        )}
                        {w.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Audit Pending</span>
                          </span>
                        )}
                        {w.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-bold text-[10px]">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {w.txHash ? (
                          <span className="font-mono text-emerald-700 font-semibold truncate max-w-[120px] block" title={w.txHash}>
                            Tx: {w.txHash}
                          </span>
                        ) : w.adminNote ? (
                          <span className="text-slate-600">{w.adminNote}</span>
                        ) : (
                          <span className="text-slate-400 italic">Processing in 24–48h</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
