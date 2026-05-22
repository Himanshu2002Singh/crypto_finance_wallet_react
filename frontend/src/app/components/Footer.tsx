import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  quickLinks: ['Home', 'Plans', 'How It Works', 'FAQs'],
  support: ['Help Center', 'Contact Support', 'Privacy Policy', 'Terms of Service'],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="text-2xl font-bold">InvestPro</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in cryptocurrency investment. Build wealth with our proven
              investment strategies and secure platform.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>

            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
          
          {/* Left Side */}
          <p>
            © 2026 InvestPro. All Rights Reserved.
          </p>

          {/* Right Side */}
          <p>
            Designed and Developed by{' '}
            <a
              href="https://www.trustingbrains.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition font-medium"
            >
              TrustingBrains
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}