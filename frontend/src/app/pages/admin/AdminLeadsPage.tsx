import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { toast } from 'sonner';

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
}

type ApprovalRates = Partial<{
  bronzeReturnRate: string;
  silverReturnRate: string;
  goldReturnRate: string;
  bronzeReferralRate: string;
  silverReferralRate: string;
  goldReferralRate: string;
}>;

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [rates, setRates] = useState<Record<string, ApprovalRates>>({});
  const [message, setMessage] = useState('');

  const loadLeads = async (status: string) => {
    try {
      const response = await adminApi.get('/admin/leads', { params: { status } });
      setLeads(response.data.leads);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to load leads.');
    }
  };

  useEffect(() => {
    void loadLeads(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (leadId: string) => {
    setMessage('');
    const rate = rates[leadId];
    if (
      !rate?.bronzeReturnRate ||
      !rate?.silverReturnRate ||
      !rate?.goldReturnRate ||
      !rate?.bronzeReferralRate ||
      !rate?.silverReferralRate ||
      !rate?.goldReferralRate
    ) {
      setMessage('Please provide all plan return rates and referral bonus rates.');
      toast.error('Please provide all plan return rates and referral bonus rates.');
      return;
    }

    try {
      const response = await adminApi.post(`/admin/leads/${leadId}/approve`, {
        bronzeReturnRate: rate.bronzeReturnRate,
        silverReturnRate: rate.silverReturnRate,
        goldReturnRate: rate.goldReturnRate,
        bronzeReferralRate: rate.bronzeReferralRate,
        silverReferralRate: rate.silverReferralRate,
        goldReferralRate: rate.goldReferralRate,
      });
      const responseMsg = response.data?.message;
      if (response.data?.emailSent === false) {
        setMessage(responseMsg || 'Lead approved, but notification email failed to send.');
        toast.warning(responseMsg || 'Lead approved! However, notification email could not be sent (check SMTP).');
      } else {
        setMessage(responseMsg || 'Lead approved and account activation email sent.');
        toast.success(responseMsg || 'Lead approved and account activation email sent.');
      }
      await loadLeads(statusFilter);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to approve lead.';
      setMessage(message);
      toast.error(message);
    }
  };

  const handleReject = async (leadId: string) => {
    setMessage('');
    try {
      await adminApi.post(`/admin/leads/${leadId}/reject`);
      setMessage('Lead rejected.');
      toast.success('Lead rejected.');
      await loadLeads(statusFilter);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to reject lead.';
      setMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads Management</h1>
        <p className="text-gray-600">Review submitted applications and approve accounts.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Status</label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {message && (
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{lead.fullName}</h3>
                <div className="text-sm text-gray-600">{lead.email}</div>
                <div className="text-sm text-gray-600">{lead.phone} · {lead.country}</div>
                {lead.message && <div className="text-sm text-gray-500">{lead.message}</div>}
              </div>
              <div className="flex items-center gap-3">
                {lead.idProofUrl ? (
                  <a
                    href={lead.idProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    View ID Proof
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-500">ID pending</span>
                )}
                {lead.photoUrl ? (
                  <a
                    href={lead.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    View Photo
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-500">Photo pending</span>
                )}
              </div>
            </div>

            {lead.status === 'PENDING' && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Bronze Return %"
                  value={rates[lead.id]?.bronzeReturnRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], bronzeReturnRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Silver Return %"
                  value={rates[lead.id]?.silverReturnRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], silverReturnRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Gold Return %"
                  value={rates[lead.id]?.goldReturnRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], goldReturnRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Bronze Referral %"
                  value={rates[lead.id]?.bronzeReferralRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], bronzeReferralRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Silver Referral %"
                  value={rates[lead.id]?.silverReferralRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], silverReferralRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Gold Referral %"
                  value={rates[lead.id]?.goldReferralRate || ''}
                  onChange={(event) =>
                    setRates((prev) => ({
                      ...prev,
                      [lead.id]: { ...prev[lead.id], goldReferralRate: event.target.value }
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => void handleApprove(lead.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => void handleReject(lead.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
