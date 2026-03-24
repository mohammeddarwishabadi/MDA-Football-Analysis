import Link from 'next/link';

const navLinks = [
  ['/analysis', 'Analysis'],
  ['/predictions', 'Predictions'],
  ['/data-viz', 'Data Viz'],
  ['/blog', 'Blog']
];

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{ borderTop: '1px solid rgba(0,255,65,0.12)', boxShadow: '0 -1px 24px rgba(0,255,65,0.04)', background: '#0D0D0D' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-xs font-black font-heading"
              style={{ background: '#00FF41', color: '#121212' }}
            >
              M
            </div>
            <span className="font-heading font-bold text-base" style={{ color: '#00FF41' }}>MDA</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Football truth through data. Tactical analysis, live stats, and AI-powered predictions for the serious supporter.
          </p>
        </div>

        {/* Nav */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#F4D03F' }}>Navigate</p>
          <ul className="space-y-2">
            {navLinks.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors hover:text-accent"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tagline / legal */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#F4D03F' }}>MDA Intelligence</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
            xG · Pressing maps · Shot quality · Transition analysis · AI predictions
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} MDA. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-4 md:px-8 py-3 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Powered by API-Football · Cloudinary · MongoDB
        </span>
        <span className="text-xs font-mono" style={{ color: 'rgba(0,255,65,0.3)' }}>v2.0</span>
      </div>
    </footer>
  );
}
