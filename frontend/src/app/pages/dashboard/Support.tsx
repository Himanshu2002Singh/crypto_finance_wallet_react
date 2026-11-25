import { useState } from 'react';
import { HelpCircle, MessageCircle, Send, Clock, ShieldCheck, Mail, AlertCircle, CheckCircle2, Bell } from 'lucide-react';
import { toast } from 'sonner';

const faqItems = [
  {
    question: 'How do I fund my account and activate an investment plan?',
    answer: 'Navigate to "Investment Plans" in your dashboard, select your preferred tier (Bronze, Silver, or Gold), and submit your deposit amount in USD. Your tier return schedule activates upon credit.',
  },
  {
    question: 'Where can I review my assigned tier interest rates?',
    answer: 'Your verified return rates (1.5% Bronze, 2.0% Silver, 2.5% Gold monthly) are locked in and displayed directly on your main dashboard overview.',
  },
  {
    question: 'What is the response time for support inquiries?',
    answer: 'Our dedicated compliance and client concierge team processes and responds to all submitted inquiries within 24–48 hours.',
  },
  {
    question: 'How do referral commissions work?',
    answer: 'Referral rewards (2.0% to 3.0% in USD) are credited automatically to your portfolio ledger when your referred investor funds an active tier plan.',
  },
  {
    question: 'When will Telegram support be available?',
    answer: 'Official Telegram channel and support desk access will be launched soon. You will receive an announcement in your dashboard notification center.',
  },
];

export function Support() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Account & Verification');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTickets, setSubmittedTickets] = useState<Array<{ id: string; subject: string; category: string; date: string; status: string }>>([]);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error('Please fill in both subject and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: 'TKT-' + Math.floor(100000 + Math.random() * 900000),
        subject: ticketSubject.trim(),
        category: ticketCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Open (Responds within 24–48 hrs)',
      };
      setSubmittedTickets((prev) => [newTicket, ...prev]);
      setTicketSubject('');
      setTicketMessage('');
      setIsSubmitting(false);
      toast.success(`Inquiry submitted! Ticket #${newTicket.id} created. We respond within 24–48 hours.`);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Support Concierge</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Global investor client desk & protocol assistance
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Concierge Responds within 24–48 Hours</span>
        </div>
      </div>

      {/* Notice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Telegram Access Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 text-white shadow-lg border border-sky-800/40">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
              Coming Soon
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-1 text-white">Official Telegram Access</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            We are not providing direct telephonic access at present, but our verified <strong>Telegram support desk & community access</strong> will launch soon for instant investor announcements and assistance.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-bold text-sky-300">
            <Bell className="w-3.5 h-3.5" />
            <span>Stay tuned for notification broadcast</span>
          </div>
        </div>

        {/* Turnaround Time SLA Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-amber-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                Guaranteed SLA
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-950 tracking-tight mb-1">24–48 Hours Turnaround</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every inquiry received by our compliance team is prioritized and thoroughly resolved. Email response is sent to your registered account within <strong>24–48 hours</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Direct desk contact: support@investzora.com</span>
          </div>
        </div>
      </div>

      {/* Ticket Submission Form */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-100">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">Submit an Inquiry Ticket</h2>
            <p className="text-xs text-slate-500">Our concierge team reviews tickets and responds within 24–48 hours</p>
          </div>
        </div>

        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Inquiry Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="Account & Verification">Account & Verification</option>
                <option value="Tier Plans & Yields">Tier Plans & Yields</option>
                <option value="Deposits & Crypto Settlements">Deposits & Crypto Settlements</option>
                <option value="Referral Program">Referral Program</option>
                <option value="General Concierge">General Concierge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your question"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Message / Details
            </label>
            <textarea
              rows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your inquiry in detail. We will review account records and respond within 24–48 hours."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500 font-medium">
              * Official response delivered to your registered investor email within 24–48 hours.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs hover:shadow-lg hover:shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
            </button>
          </div>
        </form>

        {submittedTickets.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">Recently Submitted Inquiries</h3>
            <div className="space-y-2">
              {submittedTickets.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-amber-700 mr-2">{t.id}</span>
                    <span className="font-bold text-slate-900">{t.subject}</span>
                    <span className="text-slate-500 ml-2">({t.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">{t.date}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="rounded-2xl bg-white border border-amber-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-black text-slate-950">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((faq) => (
            <details key={faq.question} className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-amber-50/50 transition">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{faq.question}</h3>
                <span className="text-slate-400 group-open:rotate-180 transition-transform font-mono text-xs">▼</span>
              </summary>
              <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
