// Landing page — editorial hero, value props, event-type selector

const VALUES = [
{ num: '01', title: 'An invited register.', body: 'Every vendor on the register is vetted across craft, discretion and reliability. We onboard fewer than six per quarter.' },
{ num: '02', title: 'Discretion, by default.', body: 'Houses are presented in confidence. Names, addresses, and guest lists never circulate beyond the room.' },
{ num: '03', title: 'Curated, not crowdsourced.', body: 'No paid ranking. No advertising slots. Order is editorial — weighed against craft, not budget.' },
{ num: '04', title: 'A house, not a marketplace.', body: 'Concierge support is built in. We answer in hours, not days, and we will say no to a vendor on your behalf.' }];


function Landing({ navigate }) {
  return (
    <main className="page-fade">
      {/* HERO ─────────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div className="eyebrow eyebrow-gold" style={{ marginBottom: 32 }}>
              — Volume I · The Register of Houses —
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 124px)', margin: 0 }}>
              The event<br />is<em> arranged.</em><br />
              <span style={{ fontStyle: 'normal', letterSpacing: '-0.02em' }}>You,</span> <em>simply</em><br />
              <span style={{ fontStyle: 'normal', letterSpacing: '-0.02em' }}>arrive.</span>
            </h1>
            <hr className="h-rule" style={{ margin: '40px 0 28px', maxWidth: 460 }} />
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 460, margin: 0 }}>
              Oikos Arete is a private register of planners, kitchens, florists, and houses of music — composed for events held to a higher standard.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
              <a href="#/browse" className="btn">
                Open the Register <Icon name="arrow" size={14} />
              </a>
              <a href="#event-types" className="btn ghost">
                Choose an Occasion
              </a>
            </div>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Tile colors={['#0E0E0C', '#A88A4A']} monogram="OA" style={{ aspectRatio: '4/5' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Tile colors={['#5C1A2B', '#A88A4A']} style={{ aspectRatio: '1/1' }} />
              <Tile colors={['#1a1612', '#C9A95F']} style={{ aspectRatio: '1/1' }} />
            </div>
            <div style={{ borderTop: '0.5px solid var(--accent)', paddingTop: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pl. I — Frontispiece</span>
              <span>Composed MMXXV</span>
            </div>
          </aside>
        </div>
      </section>

      {/* MARQUEE ──────────────────────────────────────── */}
      <section style={{ borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', padding: '24px 0', overflow: 'hidden', background: 'var(--bg-2)' }}>
        <div style={{ display: 'flex', gap: 60, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
          {Array.from({ length: 2 }).map((_, k) =>
          <React.Fragment key={k}>
              <span>Planners</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>Kitchens</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>Florists</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>Photography</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>DJs &amp; MCs</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>Mixology</span><span style={{ color: 'var(--accent)' }}>✦</span>
              <span>Hair &amp; Makeup</span><span style={{ color: 'var(--accent)' }}>✦</span>
            </React.Fragment>
          )}
        </div>
      </section>

      {/* VALUES ──────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 120, paddingBottom: 60 }}>
        <SectionMark num="I" label="The Argument" />
        <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 68px)', margin: '0 0 80px', maxWidth: 900 }}>
          Why one comes <em>here,</em> and not <em>elsewhere.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 60, columnGap: 80 }}>
          {VALUES.map((v) =>
          <div key={v.num} style={{ borderTop: '0.5px solid var(--rule)', paddingTop: 24, display: 'grid', gridTemplateColumns: '60px 1fr', gap: 20 }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', paddingTop: 4 }}>— {v.num}</span>
              <div>
                <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.1 }}>{v.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-3)', margin: 0 }}>{v.body}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EVENT TYPE SELECTOR ─────────────────────────── */}
      <section id="event-types" className="shell" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <SectionMark num="II" label="Choose the Occasion" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 60, alignItems: 'end' }}>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 68px)', margin: 0 }}>
            What is the <em>occasion?</em>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>
            Choose the occasion to filter the register to vendors who specialise in it. You can refine by city, category, and price thereafter.
          </p>
        </div>

        <div style={{ borderTop: '0.5px solid var(--ink)' }}>
          {window.OA_DATA.EVENT_TYPES.map((e, i) =>
          <a key={e.id} href={`#/browse?event=${e.id}`}
          style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 2fr 60px',
            alignItems: 'center', gap: 32, padding: '32px 0',
            borderBottom: '0.5px solid var(--rule)',
            cursor: 'pointer', transition: 'background .25s, padding .25s' }}
          onMouseEnter={(e2) => {e2.currentTarget.style.paddingLeft = '24px';e2.currentTarget.style.background = 'var(--accent-soft)';}}
          onMouseLeave={(e2) => {e2.currentTarget.style.paddingLeft = '0';e2.currentTarget.style.background = 'transparent';}}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--accent)' }}>— {e.num}</span>
              <h3 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, margin: 0, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                {e.label}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: 0, lineHeight: 1.45 }}>{e.sub}</p>
              <span style={{ justifySelf: 'end', color: 'var(--accent)' }}><Icon name="arrow" size={20} stroke={1} /></span>
            </a>
          )}
        </div>
      </section>

      {/* QUOTE / TESTIMONY ───────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 100, borderTop: '0.5px solid var(--rule)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <Tile colors={['#5C1A2B', '#A88A4A']} monogram="—" style={{ aspectRatio: '3/4', maxWidth: 320 }} />
          <div>
            <span className="eyebrow eyebrow-gold">— Letter, A. Mensah —</span>
            <p className="serif" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.18, margin: '24px 0 28px', color: 'var(--ink)' }}>
              <span style={{ fontSize: '1.4em', color: 'var(--accent)', verticalAlign: '-0.1em' }}>“</span>
              They composed the day in advance, and stayed out of the room when the day arrived. That is the entire art of it.
              <span style={{ color: 'var(--accent)' }}>”</span>
            </p>
            <hr className="h-rule" style={{ maxWidth: 100, marginBottom: 16 }} />
            <p className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: 0 }}>
              Anniversary, Lagos · 2024 · 220 guests
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA ─────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="shell" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 28 }}>— By correspondence —</div>
          <h2 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: '0 0 40px', color: 'var(--bg)' }}>
            Open the <em style={{ color: 'var(--accent)' }}>register.</em>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(244,239,230,0.7)', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.5 }}>
            Browse the full directory of vetted vendors and build a private shortlist of the houses you mean to call.
          </p>
          <a href="#/browse" className="btn gold">
            Begin <Icon name="arrow" size={14} />
          </a>
        </div>
      </section>
    </main>);

}

window.Landing = Landing;