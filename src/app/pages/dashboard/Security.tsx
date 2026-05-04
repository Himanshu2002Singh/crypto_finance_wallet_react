import { useState } from 'react';
import { Shield, Lock, Smartphone, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setShow2FASetup(false);
    alert('Two-factor authentication enabled successfully!');
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      setTwoFactorEnabled(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and authentication</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <div className="flex items-center gap-4">
              {twoFactorEnabled ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">2FA Enabled</span>
                  </div>
                  <button
                    onClick={handleDisable2FA}
                    className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    Disable 2FA
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-700 font-semibold">2FA Disabled</span>
                  </div>
                  <button
                    onClick={() => setShow2FASetup(!show2FASetup)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    {show2FASetup ? 'Cancel Setup' : 'Enable 2FA'}
                  </button>
                </>
              )}
            </div>

            {show2FASetup && !twoFactorEnabled && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Setup Two-Factor Authentication</h3>
                <ol className="space-y-4 mb-6">
                  <li className="flex gap-3">
                    <span className="font-semibold">1.</span>
                    <div>
                      <p className="mb-2">
                        Download an authenticator app like Google Authenticator or Authy
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold">2.</span>
                    <div>
                      <p className="mb-2">Scan this QR code with your authenticator app</p>
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block">
                        <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                          <div className="text-center text-gray-500 text-sm">
                            QR Code
                            <br />
                            Placeholder
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Or enter this code manually:{' '}
                        <span className="font-mono bg-white px-2 py-1 rounded border">
                          JBSWY3DPEHPK3PXP
                        </span>
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold">3.</span>
                    <div>
                      <p className="mb-2">Enter the 6-digit code from your app to verify</p>
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="w-40 px-4 py-3 border border-gray-300 rounded-lg text-center font-mono text-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </li>
                </ol>
                <button
                  onClick={handleEnable2FA}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Verify & Enable 2FA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-600 mb-4">
              Keep your account secure by using a strong, unique password.
            </p>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter new password"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Key className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Active Sessions</h2>
            <p className="text-gray-600 mb-4">Manage devices that are currently logged in</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                    💻
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Current Session</div>
                    <div className="text-sm text-gray-600">Chrome on Windows • New York, US</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Active Now
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    📱
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">iPhone 14 Pro</div>
                    <div className="text-sm text-gray-600">Safari • Last active 2 days ago</div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">Security Recommendations</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>✓ Use a unique password for your InvestPro account</li>
              <li>✓ Enable two-factor authentication for maximum security</li>
              <li>✓ Never share your password or 2FA codes with anyone</li>
              <li>✓ Review active sessions regularly and revoke unknown devices</li>
              <li>✓ Keep your email address and phone number up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
