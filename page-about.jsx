// About — origin story, mission, and values

const ABOUT_SECTIONS = [
  {
    num: 'I',
    label: 'The Origin',
    heading: 'We began with a disappointment.',
    body: 'A vendor who promised one thing and delivered another, on a day that couldn\'t be redone. That experience made one thing clear: people deserve excellence in every experience they pay for. Not sometimes. Every time.',
  },
  {
    num: 'II',
    label: 'The Problem',
    heading: 'Planning an event shouldn\'t feel like a gamble.',
    body: 'Whether it\'s a wedding, corporate function, birthday, or private gathering — the process can quickly become overwhelming. You have to source multiple vendors, vet their quality, manage communication, and hope everything comes together seamlessly. Too often, clients face unreliable service, inconsistent standards, and unnecessary stress.',
  },
  {
    num: 'III',
    label: 'What We\'re Building',
    heading: 'One place. Every vendor. Trusted.',
    body: 'An all-in-one platform designed to remove that friction. A curated community of professionals committed to going above and beyond — people who prioritise excellence, reliability, and a truly seamless experience. Think of it as your one-stop shop for trusted human resources for any occasion. From planners to caterers, photographers to decorators, every vendor on the platform is selected not just for what they do, but how well they do it.',
  },
  {
    num: 'IV',
    label: 'Our Goal',
    heading: 'Replace guesswork with confidence.',
    body: 'To remove the friction from event planning and replace it with confidence, quality, and ease so clients can focus on enjoying their moments, not managing their vendors.',
  },
];

function About() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="page-fade">

      {/* HERO ─────────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div className="eyebrow eyebrow-gold hero-anim" style={{ animationDelay: '0.1s', marginBottom: 32 }}>
              — Oikos Arete —
            </div>
            <h1 className="display hero-anim" style={{ animationDelay: '0.25s', fontSize: 'clamp(52px, 7vw, 108px)', margin: 0, lineHeight: 0.95 }}>
              A trust<br /><em>infrastructure</em><br />
              <span style={{ fontStyle: 'normal' }}>for events</span><br />
              <em>in Ghana.</em>
            </h1>
          </div>
          <aside className="hero-anim" style={{ animationDelay: '0.35s' }}>
            <hr className="h-rule" style={{ margin: '0 0 28px' }} />
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-2)', margin: '0 0 32px' }}>
              We are building the standard that Ghana's event industry deserves, where reliability is the baseline.
            </p>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span>— Founded in Accra</span>
              <span>— Est. MMXXV</span>
              <span>— Serving Ghana & beyond</span>
            </div>
          </aside>
        </div>
      </section>

      {/* STORY SECTIONS ──────────────────────────────── */}
      <section className="shell" style={{ paddingBottom: 100 }}>
        <div style={{ borderTop: '0.5px solid var(--ink)' }}>
          {ABOUT_SECTIONS.map((s, i) => (
            <div key={s.num} className="reveal"
                 style={{ animationDelay: `${i * 0.1}s`, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 80, padding: '64px 0', borderBottom: '0.5px solid var(--rule)', alignItems: 'start' }}>
              <div>
                <SectionMark num={s.num} label={s.label} />
              </div>
              <div>
                <h2 className="serif" style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 500, fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.1 }}>
                  {s.heading}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink-2)', margin: 0, maxWidth: 680 }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING STATEMENT ───────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '120px 0' }}>
        <div className="shell reveal-scale" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 32 }}>— A continuing conversation —</div>
          <p className="serif" style={{ fontSize: 'clamp(26px, 3.6vw, 48px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.25, color: 'var(--bg)', maxWidth: 780, margin: '0 auto 48px' }}>
            <span style={{ fontSize: '1.3em', color: 'var(--accent)', verticalAlign: '-0.1em', marginRight: 4 }}>"</span>
            This is a conversation we intend to keep having with vendors who want to be held to a higher standard, and with clients who deserve to trust what they're paying for.
            <span style={{ color: 'var(--accent)', marginLeft: 4 }}>"</span>
          </p>
          <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.15)', maxWidth: 120, margin: '0 auto 40px' }} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/browse" className="btn gold">Browse vendors <Icon name="arrow" size={14} /></a>
            <a href="#/vendor-apply" className="btn ghost" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'var(--bg)' }}
               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'var(--bg)'; }}>
              Join as a vendor
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}

window.About = About;
