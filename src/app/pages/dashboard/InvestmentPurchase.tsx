import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Upload, AlertTriangle } from 'lucide-react';

export function InvestmentPurchase() {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'USDT (Tether)',
    walletAddress: '',
    termsAccepted: false,
  });
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const depositAddress = 'TEpfRhR22QF1umP2vdx7AZ3x7ea7+6uBqG';

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Investment submitted successfully! Our team will verify your payment within 24 hours.');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Investment Details</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Amount (USDT)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Minimum: 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              >
                <option>USDT (Tether)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Wallet Address
              </label>
              <input
                type="text"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="Enter your wallet address for withdrawals"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This address will be used for all future withdrawals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Instructions</h3>
          <ol className="space-y-3 text-gray-700 mb-6">
            <li className="flex gap-3">
              <span className="font-semibold">1.</span>
              <span>Send your USDT to our deposit address</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">2.</span>
              <span>Take a screenshot of your transaction</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">3.</span>
              <span>Upload the screenshot below to complete your investment</span>
            </li>
          </ol>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="text-sm text-gray-600 mb-2">Deposit Address:</div>
                <div className="font-mono text-sm text-gray-900 break-all mb-3">
                  {depositAddress}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-sm text-gray-600 mb-2">Scan QR Code to Pay</div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500 text-sm">
                    QR Code
                    <br />
                    Placeholder
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">USDT Payment</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Payment Screenshot *
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition cursor-pointer">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
              required
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {uploadedFile ? (
                <p className="text-gray-900 font-semibold">{uploadedFile.name}</p>
              ) : (
                <>
                  <p className="text-gray-700 font-semibold mb-2">
                    Click to upload payment screenshot
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}
            </label>
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1"
                required
              />
              <span className="text-sm text-gray-600">
                I confirm that I have sent the payment to the provided address and agree to the{' '}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms of Service and Investment Agreement
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition mt-6"
          >
            Upload Payment Screenshot
          </button>

          <Link to="/dashboard" className="block text-center text-gray-600 hover:text-gray-900 mt-4">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2">Important Security Notice</p>
              <ul className="space-y-1">
                <li>• This is a demo platform - no real transactions will occur</li>
                <li>• Never share your private keys with anyone</li>
                <li>• Always verify deposit addresses through official channels</li>
                <li>• Cryptocurrency investments carry high risk - invest responsibly</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
