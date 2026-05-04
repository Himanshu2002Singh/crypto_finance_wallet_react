import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';

/** Height of the navbar in pixels — keep in sync with the h-[72px] class. */
const NAVBAR_HEIGHT = 72;

/** Navigation items that map to landing-page sections. */
const NAV_LINKS = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Why Us', sectionId: 'why-us' },
  { label: 'Plans', sectionId: 'plans' },
  { label: 'Blogs', sectionId: 'blogs' },
] as const;

/**
 * Scrolls to a section by its ID, accounting for the fixed navbar offset.
 * Falls back gracefully when the element doesn't exist.
 */
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

  // Track whether user has scrolled past the initial viewport
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = useCallback(
    (sectionId: string) => {
      // If not on the landing page, navigate home first then scroll
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
            ? 'bg-indigo-950/95 backdrop-blur-md shadow-lg shadow-black/10'
            : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group" onClick={() => isLandingPage && scrollToSection('home')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-orange-500/40 transition-shadow duration-300">
                I
              </div>
              <span className="text-white text-xl font-semibold tracking-tight">InvestPro</span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            {isLandingPage && (
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ label, sectionId }) => {
                  const isActive = activeSection === sectionId;
                  return (
                    <button
                      key={sectionId}
                      onClick={() => handleNavClick(sectionId)}
                      className={`relative px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? 'text-white'
                          : 'text-purple-200 hover:text-white'
                      }`}
                    >
                      {label}
                      {/* Active indicator line */}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ${
                          isActive ? 'w-6' : 'w-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Right Side: CTA Buttons + Hamburger ── */}
            <div className="flex items-center gap-3">
              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors duration-200 border border-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/get-started"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
              >
                <span className={`absolute transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}>
                  <Menu className="w-5 h-5" />
                </span>
                <span className={`absolute transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}>
                  <X className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-[72px] left-0 right-0 bg-indigo-950/98 backdrop-blur-xl border-t border-white/5 shadow-2xl transition-all duration-300 ${
            mobileOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="px-4 py-6 space-y-1">
            {/* Nav links */}
            {isLandingPage &&
              NAV_LINKS.map(({ label, sectionId }, index) => {
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={sectionId}
                    onClick={() => handleNavClick(sectionId)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-purple-200 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-purple-600'
                        }`}
                      />
                      {label}
                    </span>
                  </button>
                );
              })}

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* CTA buttons */}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-white border border-white/15 hover:bg-white/5 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/get-started"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 mt-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
