'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const baseLinks = [
  ['/', 'Home'],
  ['/analysis', 'Analysis'],
  ['/predictions', 'Predictions'],
  ['/data-viz', 'Data Viz'],
  ['/blog', 'Blog']
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => {
    const base = user?.subscription === 'premium'
      ? [...baseLinks, ['/predictions/advanced', 'Premium']]
      : baseLinks;
    if (user?.role === 'admin') return [...base, ['/admin/dashboard', 'Dashboard']];
    if (user) return base;
    return [...baseLinks, ['/admin/login', 'Login'], ['/auth/register', 'Register']];
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('mda_token');
    logout();
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: 'rgba(18,18,18,0.92)', borderBottom: '1px solid rgba(0,255,65,0.12)', boxShadow: '0 1px 24px rgba(0,255,65,0.06)' }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-black font-heading"
            style={{ background: '#00FF41', color: '#121212' }}
          >
            M
          </div>
          <span className="font-heading font-bold text-base tracking-wide">
            <span style={{ color: '#00FF41' }}>MDA</span>
            <span className="text-white/40 font-normal text-sm ml-1 hidden sm:inline">Football Analysis</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {links.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative px-3 py-2 rounded transition-colors font-medium"
                style={{
                  color: active ? '#00FF41' : 'rgba(255,255,255,0.55)',
                  background: active ? 'rgba(0,255,65,0.07)' : 'transparent'
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                    style={{ background: '#00FF41', boxShadow: '0 0 6px rgba(0,255,65,0.8)' }}
                  />
                )}
              </Link>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ border: '1px solid rgba(0,255,65,0.25)', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#00FF41'; e.currentTarget.style.borderColor = 'rgba(0,255,65,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,255,65,0.25)'; }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-white/60"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 space-y-1 transition-all ${menuOpen ? 'opacity-60' : ''}`}>
            <span className="block h-px bg-current" style={{ boxShadow: menuOpen ? 'none' : '0 0 4px rgba(0,255,65,0.5)' }} />
            <span className="block h-px bg-current" />
            <span className="block h-px bg-current" />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(0,255,65,0.08)' }}>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-sm font-medium"
              style={{ color: pathname === href ? '#00FF41' : 'rgba(255,255,255,0.55)', background: pathname === href ? 'rgba(0,255,65,0.07)' : 'transparent' }}
            >
              {label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded text-sm"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
