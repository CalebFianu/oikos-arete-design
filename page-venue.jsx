// Venue detail page — gallery + full editorial profile

function VenueGallery({ images }) {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const count = images.length;

  // Auto-advance silently in the background; pause when lightbox is open
  React.useEffect(() => {
    if (lightbox) return;
    const t = setInterval(() => setActive(i => (i + 1) % count), 3500);
    return () => clearInterval(t);
  }, [count, lightbox]);

  const prev = () => setActive(i => (i - 1 + count) % count);
  const next = () => setActive(i => (i + 1) % count);

  // The 3 thumbnail tiles shown below — same pattern as vendor detail
  const thumbIndices = [1, 2, 3].map(offset => (active + offset) % count);

  return (
    <div>
      {/* Main tile — matches vendor's large 4/5 tile exactly; click opens lightbox */}
      <div onClick={() => setLightbox(true)} style={{ cursor: 'zoom-in' }}>
        <Tile colors={images[active]} style={{ aspectRatio: '4/5' }} />
      </div>

      {/* 3-column thumbnail strip — same grid as vendor detail's secondary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
        {thumbIndices.map((idx, i) => (
          <div key={i} onClick={() => { setActive(idx); setLightbox(true); }} style={{ cursor: 'pointer' }}>
            <Tile colors={images[idx]} style={{ aspectRatio: '1/1' }} />
          </div>
        ))}
      </div>

      {/* Lightbox — full-screen with prev/next and counter */}
      {lightbox && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setLightbox(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '82vw', maxWidth: 920 }}>
            <Tile colors={images[active]} style={{ aspectRatio: '4/3' }} />

            {count > 1 && (
              <>
                <button onClick={prev} style={{
                  position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, background: 'rgba(255,255,255,0.1)',
                  border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="arrow-l" size={16} /></button>
                <button onClick={next} style={{
                  position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, background: 'rgba(255,255,255,0.1)',
                  border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="arrow" size={16} /></button>
              </>
            )}

            <div style={{
              position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap',
            }}>
              {active + 1} / {count}
            </div>
          </div>

          <button onClick={() => setLightbox(false)} style={{
            position: 'fixed', top: 24, right: 24, width: 44, height: 44,
            background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="x" size={18} /></button>
        </div>
      )}
    </div>
  );
}

function VenueDetail({ venueId, favorites, onFav, onShortlist, onOpen }) {
  const v = (window.OA_DATA.VENUES || []).find(x => x.id === venueId);
  if (!v) return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 40 }}>
        <EmptyState title="Venue not found." body="Return to the venues register."
          action={<a href="#/venues" className="btn ghost">Back to venues</a>} />
      </section>
    </main>
  );

  const isFav = favorites.includes(v.id);
  const monogram = v.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const budgetLabel = `${v.budgetCurrency} ${v.budgetMin.toLocaleString()} — ${v.budgetMax.toLocaleString()}`;

  // Related venues (same city, exclude self)
  const related = (window.OA_DATA.VENUES || []).filter(x => x.id !== v.id).slice(0, 3);

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 40 }}>
        <a href="#/venues" className="btn-text" style={{ borderBottom: 'none', color: 'var(--ink-3)' }}>
          <Icon name="arrow-l" size={12} /> Back to venues
        </a>
      </section>

      {/* HERO ──────────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Gallery */}
          <VenueGallery images={v.images} />

          {/* Info panel */}
          <div>
            <div className="eyebrow eyebrow-gold" style={{ marginBottom: 20 }}>
              — {v.type} — {v.id.toUpperCase()}
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(48px, 6.5vw, 92px)', margin: '0 0 28px' }}>
              {v.name}
            </h1>
            <hr className="h-rule-gold" style={{ maxWidth: 80, marginBottom: 28 }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 32 }}>
              <span><Icon name="pin" size={11} stroke={1.2} /> &nbsp;{v.locationName}</span>
              <span>{v.city}</span>
              <span style={{ color: 'var(--accent)' }}>up to {v.capacity.toLocaleString()} guests</span>
            </div>

            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.4, color: 'var(--ink-2)', margin: '0 0 32px' }}>
              {v.blurb}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
              {v.tags.map(t => <span key={t} className="chip" style={{ pointerEvents: 'none' }}>{t}</span>)}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn gold" onClick={() => onShortlist(v.id)}>
                <Icon name="plus" size={13} /> Add to shortlist
              </button>
              <button className={`btn ghost ${isFav ? 'active' : ''}`}
                      style={isFav ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
                      onClick={() => onFav(v.id)}>
                <Icon name={isFav ? 'heart-fill' : 'heart'} size={13} />
                {isFav ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & LOCATION ─────────────────────────────── */}
      <section style={{ borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', background: 'var(--bg-2)', padding: '60px 0' }}>
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
            <div>
              <SectionMark num="I" label="Correspondence" />
              <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, margin: 0, maxWidth: 280 }}>
                Reach the venue directly through any of the channels below, or save it to a shortlist for later.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
              {[
                { icon: 'phone', label: 'Telephone', value: v.phone, href: `tel:${v.phone.replace(/\s/g, '')}` },
                { icon: 'mail',  label: 'Electronic mail', value: v.email, href: `mailto:${v.email}` },
                { icon: 'pin',   label: 'Location', value: v.locationName, href: v.locationMapUrl, linkLabel: 'View on Google Maps' },
                { icon: 'globe', label: 'Budget range', value: budgetLabel },
              ].map(c => (
                <div key={c.label} style={{ borderTop: '0.5px solid var(--rule)', paddingTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', marginBottom: 10 }}>
                    <Icon name={c.icon} size={14} />
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{c.label}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, margin: '0 0 6px', color: 'var(--ink)' }}>{c.value}</p>
                  {c.href && (
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                       style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {c.linkLabel || c.value} <Icon name="arrow" size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS GRID ────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '0.5px solid var(--ink)' }}>
          {[
            ['Venue type',    v.type],
            ['Max capacity',  `${v.capacity.toLocaleString()} guests`],
            ['Neighbourhood', v.locationName],
            ['City',          v.city],
            ['Budget from',   `${v.budgetCurrency} ${v.budgetMin.toLocaleString()}`],
            ['Budget to',     `${v.budgetCurrency} ${v.budgetMax.toLocaleString()}`],
            ['Availability',  'On application'],
            ['Enquiries',     'Via email / phone'],
          ].map(([k, val], i) => (
            <div key={k} style={{
              borderRight: (i % 4 < 3) ? '0.5px solid var(--rule)' : 'none',
              borderBottom: '0.5px solid var(--rule)',
              padding: '24px 20px',
            }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 }}>{k}</div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED ────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          <SectionMark num="II" label="Other Venues in Accra" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 24 }}>
            {related.map(r => (
              <VenueCard key={r.id} venue={r}
                         isFav={favorites.includes(r.id)}
                         onFav={onFav}
                         onShortlist={onShortlist}
                         onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

window.VenueDetail = VenueDetail;
window.VenueGallery = VenueGallery;
