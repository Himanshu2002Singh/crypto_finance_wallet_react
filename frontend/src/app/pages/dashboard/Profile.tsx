import { useEffect, useState } from 'react';
import { Edit3, Lock, Mail, MapPin, Phone, Save, Upload, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function Profile() {
  const { user, refresh } = useAuth();
  const [idProof, setIdProof] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
    });
  }, [user?.fullName, user?.phone]);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'IN';

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profileForm.fullName.trim() || profileForm.phone.trim().length < 7) {
      toast.error('Please enter a valid name and phone number.');
      return;
    }

    setIsSavingProfile(true);
    try {
      await api.patch('/users/profile', {
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone.trim(),
      });
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

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
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

  const handleDocumentUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!idProof && !photo) {
      toast.error('Please choose an ID proof or live photograph to upload.');
      return;
    }

    const payload = new FormData();
    if (idProof) {
      payload.append('idProof', idProof);
    }
    if (photo) {
      payload.append('photo', photo);
    }

    setIsUploading(true);
    try {
      await api.post('/users/documents', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIdProof(null);
      setPhoto(null);
      await refresh();
      toast.success('Documents uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to upload documents.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your profile, documents, and password.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.fullName ?? 'Investor'}</h2>
            <p className="text-gray-600">{user?.email ?? 'Not available'}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Verified
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {user?.status ?? 'Pending'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.fullName}
              onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 disabled:text-gray-600 enabled:bg-white"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 disabled:text-gray-600 enabled:bg-white"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Country
            </label>
            <input
              type="text"
              value={user?.country ?? ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          {isEditing && (
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Verification Documents</h3>
            <p className="text-sm text-gray-600">Upload your ID proof and live photograph from here.</p>
          </div>
        </div>

        <form onSubmit={handleDocumentUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setIdProof(event.target.files?.[0] ?? null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
              <div className="mt-2 text-sm">
                {user?.idProofUrl ? (
                  <a href={user.idProofUrl} target="_blank" rel="noreferrer" className="font-semibold text-purple-600 hover:underline">
                    View uploaded ID proof
                  </a>
                ) : (
                  <span className="text-amber-700">Not uploaded yet</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Live Photograph</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
              <div className="mt-2 text-sm">
                {user?.photoUrl ? (
                  <a href={user.photoUrl} target="_blank" rel="noreferrer" className="font-semibold text-purple-600 hover:underline">
                    View uploaded photograph
                  </a>
                ) : (
                  <span className="text-amber-700">Not uploaded yet</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
            <p className="text-sm text-gray-600">Update your password using your current password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
              minLength={8}
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {isChangingPassword ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
