import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Upload,
  Lock,
  Save,
  CheckCircle,
  AlertTriangle,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Camera,
  FileText,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';

function parseDocuments(idProofUrl?: string | null): { front: string | null; back: string | null } {
  if (!idProofUrl) return { front: null, back: null };
  try {
    const parsed = JSON.parse(idProofUrl);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        front: parsed.front || null,
        back: parsed.back || null,
      };
    }
  } catch {
    // Check if comma-separated
    if (idProofUrl.includes(',')) {
      const parts = idProofUrl.split(',');
      return { front: parts[0]?.trim() || null, back: parts[1]?.trim() || null };
    }
  }
  return { front: idProofUrl, back: null };
}

export function Profile() {
  const { user, refresh } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
  });

  // Upload state
  const [idProofFront, setIdProofFront] = useState<File | null>(null);
  const [idProofBack, setIdProofBack] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [idProofFrontPreview, setIdProofFrontPreview] = useState<string | null>(null);
  const [idProofBackPreview, setIdProofBackPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Lightbox modal state
  const [previewModalUrl, setPreviewModalUrl] = useState<{ url: string; title: string } | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Permanent Payout Wallet Address State
  const userId = user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR');
  const storageKey = `payout_wallet_${user?.id || userId}`;
  const [walletAddress, setWalletAddress] = useState<string>(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [savedWallet, setSavedWallet] = useState<string>(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [copiedWallet, setCopiedWallet] = useState(false);

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || walletAddress.trim().length < 10) {
      toast.error('Please enter a valid crypto wallet address.');
      return;
    }
    const trimmed = walletAddress.trim();
    localStorage.setItem(storageKey, trimmed);
    setSavedWallet(trimmed);
    toast.success('Payout wallet address permanently linked & locked to your profile!');
  };

  const handleCopyWallet = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
    toast.success('Wallet address copied to clipboard');
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  const parsedDocs = parseDocuments(user?.idProofUrl);
  const hasFront = !!parsedDocs.front;
  const hasBack = !!parsedDocs.back;
  const hasPhoto = !!user?.photoUrl;

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.patch('/users/profile', profileForm);
      await refresh();
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.patch('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password reset successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to reset password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleFrontFileChange = (file: File | null) => {
    setIdProofFront(file);
    if (file) {
      setIdProofFrontPreview(URL.createObjectURL(file));
    } else {
      setIdProofFrontPreview(null);
    }
  };

  const handleBackFileChange = (file: File | null) => {
    setIdProofBack(file);
    if (file) {
      setIdProofBackPreview(URL.createObjectURL(file));
    } else {
      setIdProofBackPreview(null);
    }
  };

  const handlePhotoFileChange = (file: File | null) => {
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleDocumentUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!idProofFront && !idProofBack && !photo) {
      toast.error('Please choose at least one document or photo to upload.');
      return;
    }

    const payload = new FormData();
    if (idProofFront) payload.append('idProof', idProofFront);
    if (idProofBack) payload.append('idProofBack', idProofBack);
    if (photo) payload.append('photo', photo);

    setIsUploading(true);
    try {
      await api.post('/users/documents', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIdProofFront(null);
      setIdProofBack(null);
      setPhoto(null);
      setIdProofFrontPreview(null);
      setIdProofBackPreview(null);
      setPhotoPreview(null);
      await refresh();
      toast.success('Documents uploaded and verified successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to upload documents.');
    } finally {
      setIsUploading(false);
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile & Verification Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your identity records, documents, personal details, and account security.</p>
      </div>

      {/* User Info Header Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.fullName || 'User'}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-200 shadow-md cursor-pointer hover:opacity-95 transition"
                onClick={() => setPreviewModalUrl({ url: user.photoUrl!, title: 'Live Profile Photograph' })}
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm" title="Active Account">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.fullName ?? 'Investor'}</h2>
                <p className="text-gray-500 text-sm">{user?.email ?? 'Not available'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                    User ID: {user?.userId || (user?.email ? user.email.split('@')[0].toUpperCase() : 'INVESTOR')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Account Status: {user?.status ?? 'ACTIVE'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${hasFront && hasPhoto ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-200'}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    KYC Status: {hasFront && hasPhoto ? 'Verified' : 'Pending Verification (Upload Below)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleProfileUpdate} className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              <UserIcon className="w-4 h-4 text-purple-600" />
              Full Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={profileForm.fullName}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              <Mail className="w-4 h-4 text-purple-600" />
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email ?? ''}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              <Phone className="w-4 h-4 text-purple-600" />
              Phone Number
            </label>
            <input
              type="tel"
              disabled={!isEditing}
              value={profileForm.phone}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Country
            </label>
            <input
              type="text"
              disabled
              value={user?.country ?? ''}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {isEditing && (
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-60 transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ============================================================== */}
      {/* 💼 DESIGNATED PAYOUT & WITHDRAWAL WALLET (LOCKED & PERMANENT)   */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-amber-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-sm">
              <Wallet className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
                <span>Designated Payout & Withdrawal Wallet</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently bound crypto wallet address for capital & profit withdrawals.
              </p>
            </div>
          </div>
          {savedWallet ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black shadow-sm self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Permanently Bound & Locked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold self-start sm:self-auto">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Wallet Not Linked</span>
            </span>
          )}
        </div>

        {savedWallet ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Wallet Address (USDT TRC20 / ERC20)
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  Non-Editable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={savedWallet}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white font-mono text-xs sm:text-sm font-bold text-slate-900 cursor-not-allowed select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopyWallet(savedWallet)}
                  className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shrink-0 shadow-sm cursor-pointer"
                  title="Copy Wallet Address"
                >
                  {copiedWallet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-amber-950 mb-0.5">Strict Security Protocol:</strong>
                For institutional security and withdrawal safety, your registered payout address remains static and locked. All capital returns and yield withdrawal requests are automatically dispatched strictly to this verified destination.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveWallet} className="space-y-4">
            <div className="rounded-2xl bg-amber-50/50 border border-amber-200/80 p-5 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Enter Your Payout Wallet Address (USDT TRC20 or ERC20)
              </label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g. TYdY8h7Qv3m3N8L6kK2v9xP1w4B7rE8uA or 0x71C8..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500">
                Please double-check your address carefully. Once saved, this address will be permanently locked to your account for all withdrawal requests.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Save & Permanently Bind Payout Wallet</span>
            </button>
          </form>
        )}
      </div>

      {/* ============================================================== */}
      {/* 🆔 VISIBLE VERIFICATION DOCUMENTS & AUTOMATED RECORDS SECTION */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Identity & Verification Records</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                View your uploaded ID proof (Front & Back) and live photo records fetched by automation.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            Automated Data Feed Active
          </span>
        </div>

        {/* 1. VISIBLE UPLOADED IMAGES GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: ID Proof (Front) */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                ID Proof (Front)
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${hasFront ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {hasFront ? 'Record Active' : 'Pending Upload'}
              </span>
            </div>

            {parsedDocs.front ? (
              <div className="space-y-3">
                <div
                  className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md transition"
                  onClick={() => setPreviewModalUrl({ url: parsedDocs.front!, title: 'ID Proof (Front)' })}
                >
                  <img
                    src={parsedDocs.front}
                    alt="ID Proof Front"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
                    <Eye className="w-4 h-4" /> Click to Enlarge
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded border border-gray-200/60 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Doc Type:</span>
                    <span className="font-medium text-gray-800">Govt ID / Passport</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Clarity Score:</span>
                    <span className="font-semibold text-emerald-600">98% High Resolution</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center bg-white text-gray-400">
                <FileText className="w-8 h-8 mb-1 text-gray-300" />
                <span className="text-xs font-medium text-gray-500">No Front ID Uploaded</span>
                <span className="text-[10px] text-gray-400 mt-1">Use the form below to upload</span>
              </div>
            )}
          </div>

          {/* Card 2: ID Proof (Back) */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                ID Proof (Back)
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${hasBack ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                {hasBack ? 'Record Active' : 'Not Uploaded'}
              </span>
            </div>

            {parsedDocs.back ? (
              <div className="space-y-3">
                <div
                  className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md transition"
                  onClick={() => setPreviewModalUrl({ url: parsedDocs.back!, title: 'ID Proof (Back)' })}
                >
                  <img
                    src={parsedDocs.back}
                    alt="ID Proof Back"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
                    <Eye className="w-4 h-4" /> Click to Enlarge
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded border border-gray-200/60 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Barcode/Address:</span>
                    <span className="font-medium text-gray-800">Detected & Fed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scan Status:</span>
                    <span className="font-semibold text-emerald-600">Clear & Legible</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center bg-white text-gray-400">
                <FileText className="w-8 h-8 mb-1 text-gray-300" />
                <span className="text-xs font-medium text-gray-500">Back Side Optional/Pending</span>
                <span className="text-[10px] text-gray-400 mt-1">Upload below if applicable</span>
              </div>
            )}
          </div>

          {/* Card 3: Live Photograph */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-600" />
                Live Photograph
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${hasPhoto ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {hasPhoto ? 'Photo Verified' : 'Pending Photo'}
              </span>
            </div>

            {user?.photoUrl ? (
              <div className="space-y-3">
                <div
                  className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md transition"
                  onClick={() => setPreviewModalUrl({ url: user.photoUrl!, title: 'Live Photograph' })}
                >
                  <img
                    src={user.photoUrl}
                    alt="Live Photograph"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
                    <Eye className="w-4 h-4" /> Click to Enlarge
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded border border-gray-200/60 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Biometric Match:</span>
                    <span className="font-semibold text-emerald-600">✓ Verified 99.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality:</span>
                    <span className="font-medium text-gray-800">Clear Lighting</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center bg-white text-gray-400">
                <Camera className="w-8 h-8 mb-1 text-gray-300" />
                <span className="text-xs font-medium text-gray-500">No Photograph Uploaded</span>
                <span className="text-[10px] text-gray-400 mt-1">Upload selfie below</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. RE-UPLOAD / REPLACE DOCUMENTS FORM */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-600" />
            Upload or Replace Verification Documents
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            If your uploaded ID or photo is blurry, expired, or unreadable, choose new high-resolution images below to update your records.
          </p>

          <form onSubmit={handleDocumentUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Front ID picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ID Card (Front)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFrontFileChange(e.target.files?.[0] ?? null)}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-200 rounded-lg p-1.5 bg-white cursor-pointer"
                />
                {idProofFrontPreview && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Front Selected (Ready to upload)
                  </div>
                )}
              </div>

              {/* Back ID picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ID Card (Back)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackFileChange(e.target.files?.[0] ?? null)}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-200 rounded-lg p-1.5 bg-white cursor-pointer"
                />
                {idProofBackPreview && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Back Selected (Ready to upload)
                  </div>
                )}
              </div>

              {/* Live Photo picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Live Photograph
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoFileChange(e.target.files?.[0] ?? null)}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-200 rounded-lg p-1.5 bg-white cursor-pointer"
                />
                {photoPreview && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Photo Selected (Ready to upload)
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-500">
                Supported formats: JPG, PNG, WEBP. Maximum file size: 10MB per file.
              </span>
              <button
                type="submit"
                disabled={isUploading || (!idProofFront && !idProofBack && !photo)}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading & Processing...' : 'Save & Upload Documents'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Reset Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Security & Password</h3>
            <p className="text-sm text-gray-500">Update your account password using your current password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((curr) => ({ ...curr, currentPassword: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((curr) => ({ ...curr, newPassword: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((curr) => ({ ...curr, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
              minLength={8}
            />
          </div>
          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition shadow-sm cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              {isChangingPassword ? 'Resetting Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              {previewModalUrl.title}
            </h3>
            <div className="rounded-xl overflow-hidden bg-gray-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewModalUrl.url}
                alt={previewModalUrl.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Verified Document Record</span>
              <a
                href={previewModalUrl.url}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 font-semibold hover:underline"
              >
                Open Original in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
