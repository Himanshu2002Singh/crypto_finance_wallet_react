import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';

const NAVBAR_HEIGHT = 72;

const NAV_LINKS = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Why InvestPro', sectionId: 'why-us' },
  { label: 'Tier Plans', sectionId: 'plans' },
  { label: 'Investor', sectionId: 'investor' },
  { label: 'Intelligence', sectionId: 'blogs' },
  { label: 'FAQs', sectionId: 'faq' },
] as const;

function scrollToSection(sectionId: string) {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(sectionId);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  const handleNavClick = useCallback(
    (sectionId: string) => {
      if (location.pathname !== '/') {
        window.location.href = `/#${sectionId}`;
        return;
      }
      scrollToSection(sectionId);
      setMobileOpen(false);
    },
    [location.pathname]
  );

  const isLandingPage = location.pathname === '/';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl'
            : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={() => isLandingPage && scrollToSection('home')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                I
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-black tracking-tight flex items-center gap-1">
                  Invest<span className="text-amber-400">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Wealth & Custody
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            {isLandingPage && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-2 py-1 rounded-xl">
                {NAV_LINKS.map(({ label, sectionId }) => {
                  const isActive = activeSection === sectionId;
                  return (
                    <button
                      key={sectionId}
                      onClick={() => handleNavClick(sectionId)}
                      className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-white bg-slate-800/90 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right: CTA Buttons + Hamburger */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition border border-slate-800"
                >
                  Client Login
                </Link>
                <Link
                  to="/get-started"
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-5 py-2 rounded-xl text-xs font-black hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center text-slate-300 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute top-[72px] left-0 right-0 bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800 shadow-2xl transition-all duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="px-5 py-6 space-y-2">
            {isLandingPage &&
              NAV_LINKS.map(({ label, sectionId }) => {
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={sectionId}
                    onClick={() => handleNavClick(sectionId)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

            <div className="border-t border-slate-800 my-4 pt-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-300 border border-slate-800 hover:bg-slate-900 transition"
              >
                Client Login
              </Link>
              <Link
                to="/get-started"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
