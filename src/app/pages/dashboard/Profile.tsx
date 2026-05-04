import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera } from 'lucide-react';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    city: 'New York',
    address: '123 Wall Street, Apt 4B',
    dateOfBirth: '1990-05-15',
    walletAddress: 'TEpfRhR22QF1umP2vdx7AZ3x7ea7+6uBqG',
  });

  const [savedData, setSavedData] = useState(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setSavedData(formData);
    localStorage.setItem('userName', formData.fullName);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {formData.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
            <p className="text-gray-600">{formData.email}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Premium Member
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Verified
              </span>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              💼 Wallet Address (For Withdrawals)
            </label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm outline-none transition ${
                isEditing
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  : 'bg-gray-50'
              }`}
            />
            <p className="text-sm text-gray-500 mt-2">
              This wallet address will be used for all withdrawal transactions
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Account Status:</span>
            <span className="ml-2 font-semibold text-green-600">Active</span>
          </div>
          <div>
            <span className="text-gray-600">Member Since:</span>
            <span className="ml-2 font-semibold text-gray-900">May 1, 2026</span>
          </div>
          <div>
            <span className="text-gray-600">Current Plan:</span>
            <span className="ml-2 font-semibold text-purple-600">Silver</span>
          </div>
          <div>
            <span className="text-gray-600">KYC Verification:</span>
            <span className="ml-2 font-semibold text-green-600">Verified ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
