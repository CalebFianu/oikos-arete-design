// Shared atoms and helpers for Oikos Arete

// ── Icons ───────────────────────────────────────────────────────────────
function Icon({ name, size = 16, stroke = 1.4 }) {
  const s = size;
  const sw = stroke;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrow':  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrow-l': return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
    case 'heart':  return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
    case 'heart-fill': return <svg {...common} fill="currentColor" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
    case 'plus':   return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case 'check':  return <svg {...common}><path d="M20 6L9 17l-5-5" /></svg>;
    case 'x':      return <svg {...common}><path d="M18 6L6 18M6 6l12 12" /></svg>;
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>;
    case 'pin':    return <svg {...common}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case 'phone':  return <svg {...common}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;
    case 'mail':   return <svg {...common}><rect x="2" y="4" width="20" height="16" rx="0" /><path d="M2 6l10 7 10-7" /></svg>;
    case 'globe':  return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>;
    case 'ig':        return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="0" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" /></svg>;
    case 'whatsapp':  return <svg {...common}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
    case 'menu':   return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
    case 'star':   return <svg {...common} fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="none" /></svg>;
    case 'sliders':return <svg {...common}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>;
    case 'edit':   return <svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>;
    case 'trash':  return <svg {...common}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>;
    case 'eye':    return <svg {...common}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'eye-off':return <svg {...common}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
    case 'list':   return <svg {...common}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
    case 'cal':    return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="0" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    default: return null;
  }
}

// ── Logo ────────────────────────────────────────────────────────────────
function OALogo({ size = 'normal' }) {
  return (
    <a href="#/" className="oa-logo" style={{ fontSize: size === 'large' ? 18 : 14 }}>
      <span className="glyph">
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <path d="M0 5 L4 5" stroke="currentColor" strokeWidth=".5" />
          <path d="M18 5 L22 5" stroke="currentColor" strokeWidth=".5" />
          <path d="M11 1 L13.5 5 L11 9 L8.5 5 Z" stroke="var(--accent)" strokeWidth=".7" fill="none" />
          <circle cx="11" cy="5" r="0.6" fill="var(--accent)" />
        </svg>
      </span>
      <span>Oikos Arete</span>
    </a>
  );
}

// ── Tile (placeholder imagery) ──────────────────────────────────────────
function Tile({ colors = ['#1a1612','#a88a4a'], monogram, style }) {
  const s = { '--tile-a': colors[0], '--tile-b': colors[1], ...style };
  return (
    <div className="tile" style={s}>
      {monogram && <div className="tile-monogram">{monogram}</div>}
    </div>
  );
}

// ── Tier pip ───────────────────────────────────────────────────────────
function TierPip({ tier }) {
  return (
    <span className="tier-pip" aria-label={`Tier ${tier} of 3`}>
      {[1,2,3].map(i => <span key={i} className={i <= tier ? 'on' : ''}>$</span>)}
    </span>
  );
}

// ── Section mark (numbered editorial heading) ──────────────────────────
function SectionMark({ num, label }) {
  return (
    <div className="section-mark">
      <span className="num">§ {num}</span>
      <span className="lbl">{label}</span>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────────
function Header({ route, lists, user, onSignIn, onSignOut, dark, onToggleDark }) {
  const listCount = (lists || []).reduce((acc, l) => acc + l.vendorIds.length, 0);
  const links = [
    { href: '#/browse',  label: 'Vendors' },
    { href: '#/lists',   label: `Shortlists${listCount ? ` · ${listCount}` : ''}` },
    { href: '#/admin',   label: 'Admin' },
  ];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const initial = user ? (user.name || user.email)[0].toUpperCase() : '';
  return (
    <header className="oa-header">
      <div className="shell oa-header-row">
        <OALogo />
        <nav className="oa-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}
               className={route.startsWith(l.href) ? 'active' : ''}>{l.label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onToggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}
                  style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '0.5px solid var(--rule-strong)', cursor: 'pointer', color: 'var(--ink)', transition: 'border-color .2s, color .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule-strong)'; e.currentTarget.style.color = 'var(--ink)'; }}>
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen((o) => !o)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: '0.5px solid var(--rule-strong)', padding: '6px 14px 6px 6px', cursor: 'pointer', color: 'var(--ink)' }}>
              <span style={{ width: 28, height: 28, background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, fontWeight: 500 }}>{initial}</span>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{(user.name || user.email).split('@')[0].slice(0, 14)}</span>
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, minWidth: 240, background: 'var(--paper)', border: '0.5px solid var(--ink)', zIndex: 51, boxShadow: '0 12px 40px rgba(0,0,0,.12)' }}>
                  <div style={{ padding: '16px 18px', borderBottom: '0.5px solid var(--rule)' }}>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 500 }}>{user.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.06em', marginTop: 2 }}>{user.email}</div>
                  </div>
                  <a href="#/lists" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 18px', fontSize: 13, color: 'var(--ink-2)', borderBottom: '0.5px solid var(--rule)' }}>Your shortlists</a>
                  <button onClick={() => { setMenuOpen(false); onSignOut(); }}
                          style={{ width: '100%', textAlign: 'left', padding: '14px 18px', fontSize: 13, color: 'var(--burgundy)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={onSignIn}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: '0.5px solid var(--rule-strong)', padding: '0 16px', height: 40, cursor: 'pointer', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'border-color .2s, color .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule-strong)'; e.currentTarget.style.color = 'var(--ink)'; }}>
            Sign in
          </button>
        )}
        </div>
      </div>
    </header>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="oa-footer">
      <div className="shell">
        <div className="oa-footer-grid">
          <div>
            <OALogo size="large" />
            <p style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic', lineHeight: 1.25, marginTop: 22, color: 'var(--ink-2)', maxWidth: 380 }}>
              An invited register of vendors for the events one chooses to remember.
            </p>
          </div>
          <div>
            <h4>Atelier</h4>
            <ul>
              <li><a href="#/browse">Vendors</a></li>
              <li><a href="#/lists">Shortlists</a></li>
              <li><a href="#/admin">Concierge</a></li>
            </ul>
          </div>
          <div>
            <h4>House</h4>
            <ul>
              <li>Membership</li>
              <li>Press</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4>Correspondence</h4>
            <ul>
              <li>concierge@oikosarete.co</li>
              <li>+234 (0) 802 — 119 — 0044</li>
              <li>By appointment only</li>
            </ul>
          </div>
        </div>
        <div className="oa-footer-base">
          <span>© Oikos Arete MMXXV — All correspondence privileged.</span>
          <span>Composed in Lagos · Paris · New York</span>
        </div>
      </div>
    </footer>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────
function EmptyState({ title, body, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', border: '0.5px dashed var(--rule-strong)' }}>
      <div className="eyebrow eyebrow-gold" style={{ marginBottom: 18 }}>— Nothing yet —</div>
      <h3 className="serif" style={{ fontSize: 36, fontWeight: 500, fontStyle: 'italic', margin: '0 0 12px', color: 'var(--ink)' }}>{title}</h3>
      <p style={{ color: 'var(--ink-3)', fontSize: 15, maxWidth: 440, margin: '0 auto 28px' }}>{body}</p>
      {action}
    </div>
  );
}

Object.assign(window, { Icon, OALogo, Tile, TierPip, SectionMark, Header, Footer, EmptyState });
