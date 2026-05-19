// Vendor detail page — full editorial profile

function VendorDetail({ vendorId, favorites, onFav, onShortlist, onOpen, navigate }) {
  const v = window.OA_DATA.VENDORS.find(x => x.id === vendorId);
  if (!v) return <EmptyState title="Vendor not found." body="Return to the register." action={<a href="#/browse" className="btn ghost">Back to register</a>} />;
  const cat = window.OA_DATA.CATEGORIES.find(c => c.id === v.cat);
  const isFav = favorites.includes(v.id);
  const monogram = v.name.split(' ').map(w => w[0]).slice(0,2).join('');

  // Related vendors (same category)
  const related = window.OA_DATA.VENDORS.filter(x => x.cat === v.cat && x.id !== v.id).slice(0, 3);

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 40 }}>
        <a href="#/browse" className="btn-text" style={{ borderBottom: 'none', color: 'var(--ink-3)' }}>
          <Icon name="arrow-l" size={12} /> Back to register
        </a>
      </section>

      {/* HERO ─────────────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <Tile colors={v.tile} monogram={monogram} style={{ aspectRatio: '4/5' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
              <Tile colors={[v.tile[1], v.tile[0]]} style={{ aspectRatio: '1/1' }} />
              <Tile colors={['#0E0E0C', v.tile[1]]} style={{ aspectRatio: '1/1' }} />
              <Tile colors={['#5C1A2B', v.tile[1]]} style={{ aspectRatio: '1/1' }} />
            </div>
          </div>

          <div>
            <div className="eyebrow eyebrow-gold" style={{ marginBottom: 20 }}>
              — {cat?.plural} — {v.id.toUpperCase()}
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(48px, 6.5vw, 92px)', margin: '0 0 28px' }}>
              {v.name}
            </h1>
            <hr className="h-rule-gold" style={{ maxWidth: 80, marginBottom: 28 }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 32 }}>
              <span><Icon name="pin" size={11} stroke={1.2} /> &nbsp;{v.city}</span>
              <span style={{ color: 'var(--accent)' }}>✦ &nbsp;{v.rating.toFixed(2)} / 5.00</span>
              <span><TierPip tier={v.tier} /></span>
            </div>

            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.4, color: 'var(--ink-2)', margin: '0 0 32px' }}>
              {v.blurb}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
              {v.tags.map(t => <span key={t} className="chip" style={{ pointerEvents: 'none' }}>{t}</span>)}
            </div>

            {/* Actions */}
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

      {/* CONTACT ─────────────────────────────────────── */}
      <section style={{ borderTop: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', background: 'var(--bg-2)', padding: '60px 0' }}>
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
            <div>
              <SectionMark num="I" label="Correspondence" />
              <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, margin: 0, maxWidth: 280 }}>
                Reach the studio directly through any of the channels below, or save the house to a shortlist for later.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
              {[
                { icon: 'phone', label: 'Telephone', value: v.phone },
                { icon: 'mail', label: 'Electronic mail', value: v.email },
                { icon: 'globe', label: 'Atelier web', value: v.web },
                { icon: 'ig', label: 'Instagram', value: v.ig },
                { icon: 'whatsapp', label: 'WhatsApp', value: v.phone, href: `https://wa.me/${v.phone.replace(/[^0-9]/g, '')}` },
              ].map(c => (
                <div key={c.label} style={{ borderTop: '0.5px solid var(--rule)', paddingTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', marginBottom: 10 }}>
                    <Icon name={c.icon} size={14} />
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{c.label}</span>
                  </div>
                  {c.href
                    ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)', textDecoration: 'none', display: 'block' }}>{c.value}</a>
                    : <p style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>{c.value}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE / DETAILS ─────────────────────────── */}
      <section className="shell" style={{ paddingTop: 100, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
          <SectionMark num="II" label="The Practice" />
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4.4vw, 60px)', margin: '0 0 36px' }}>
              On the matter of <em>{cat?.label.toLowerCase()}.</em>
            </h2>
            <div style={{ columnCount: 2, columnGap: 40, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <p style={{ marginTop: 0 }}>
                {v.blurb} The studio operates from {v.city}, with travel undertaken for engagements of consequence. A consultation precedes every commission.
              </p>
              <p>
                The team accepts a limited number of engagements per quarter, with a quiet preference for guest counts that allow for direct attention. Pricing is delivered as a single proposal — no menus, no à la carte.
              </p>
              <p>
                References are available on application, through Oikos Arete concierge. Contracts are bilingual where appropriate, and signed in counterpart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS GRID ────────────────────────────────── */}
      <section className="shell" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '0.5px solid var(--ink)' }}>
          {[
            ['Founded', '2014'],
            ['Engagements / year', '12 — 18'],
            ['Languages', 'EN · FR'],
            ['Coverage', 'International'],
            ['Lead time', '3 — 6 months'],
            ['Guest range', '40 — 600'],
            ['Deposit', '40% on signing'],
            ['Cancellation', 'Tiered'],
          ].map(([k, val], i) => (
            <div key={k} style={{ borderRight: (i % 4 < 3) ? '0.5px solid var(--rule)' : 'none', borderBottom: '0.5px solid var(--rule)', padding: '24px 20px' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 }}>{k}</div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED ────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="shell" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <SectionMark num="III" label={`Other ${cat?.plural}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 24 }}>
            {related.map(r => (
              <VendorCard key={r.id} vendor={r}
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

window.VendorDetail = VendorDetail;
