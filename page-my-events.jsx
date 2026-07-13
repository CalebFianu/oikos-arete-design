// My Events — client view of submitted event enquiries and curated vendor results

const BUDGET_LABELS = {
  'under-5k':   'Under GHS 5,000',
  '5k-20k':     'GHS 5,000 – 20,000',
  '20k-50k':    'GHS 20,000 – 50,000',
  '50k-100k':   'GHS 50,000 – 100,000',
  'above-100k': 'Above GHS 100,000',
};

function MyEvents({ user, inquiries, vendors, onSignIn }) {
  if (!user) {
    return (
      <main className="page-fade">
        <section className="shell" style={{ padding: '120px 0' }}>
          <EmptyState
            title="Sign in to view your events."
            body="Your submitted event enquiries and curated vendor shortlists are kept against your account."
            action={
              <button className="btn" onClick={onSignIn}>
                Sign in <Icon name="arrow" size={13} />
              </button>
            }
          />
        </section>
      </main>
    );
  }

  const eventTypeLabels = Object.fromEntries(window.OA_DATA.EVENT_TYPES.map(t => [t.id, t.label]));
  const categoryLabels  = Object.fromEntries(window.OA_DATA.CATEGORIES.map(c => [c.id, c.label]));

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 60, paddingBottom: 32 }}>
        <SectionMark num="V" label="My Events" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0 }}>
            <em>Your events.</em>
          </h1>
          {inquiries.length > 0 && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              <span>
                <span style={{ color: 'var(--accent)', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>
                  {inquiries.filter(i => i.status === 'curated').length}
                </span>
                curated
              </span>
              <span style={{ marginLeft: 24 }}>
                <span style={{ color: '#c47a1e', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
                under review
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: 100 }}>
        {inquiries.length === 0 ? (
          <EmptyState
            title="No events submitted yet."
            body="Use the 'Tell us your event details' link on the homepage to submit an enquiry and receive a curated vendor shortlist."
            action={<a href="#/" className="btn ghost">Go to homepage <Icon name="arrow" size={13} /></a>}
          />
        ) : (
          <div style={{ borderTop: '0.5px solid var(--ink)' }}>
            {inquiries.map((inq) => {
              const curatedVendors = (inq.curatedVendorIds || [])
                .map(id => vendors.find(v => v.id === id))
                .filter(Boolean);
              const eventLabel = eventTypeLabels[inq.eventType] || inq.eventType;
              const catList = (inq.categories || []).map(id => categoryLabels[id] || id).join(', ');

              return (
                <div key={inq.id} style={{ borderBottom: '0.5px solid var(--rule)', padding: '44px 0' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                    <div>
                      <div className="eyebrow eyebrow-gold" style={{ marginBottom: 10 }}>
                        — {eventLabel} · {inq.submittedAt} —
                      </div>
                      <h2 className="serif" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, fontStyle: 'italic', margin: 0, lineHeight: 1.1 }}>
                        {inq.city}{inq.eventDate ? <span style={{ fontStyle: 'normal', fontWeight: 400, fontSize: '0.7em', color: 'var(--ink-3)' }}> · {inq.eventDate}</span> : ''}
                      </h2>
                    </div>
                    <span className="mono" style={{
                      fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                      padding: '8px 16px',
                      border: `0.5px solid ${inq.status === 'curated' ? 'var(--accent)' : 'var(--rule-strong)'}`,
                      color: inq.status === 'curated' ? 'var(--accent)' : '#c47a1e',
                    }}>
                      {inq.status === 'curated' ? '— Curated —' : '— Under review —'}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginBottom: inq.details ? 20 : 0 }}>
                    {[
                      ['Guest count',   inq.guestCount || '—'],
                      ['Budget',        BUDGET_LABELS[inq.budget] || '—'],
                      ['Vendor types',  catList || '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="field-label" style={{ marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.4 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {inq.details && (
                    <p className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--ink-3)', margin: '20px 0 0', lineHeight: 1.55 }}>
                      "{inq.details}"
                    </p>
                  )}

                  {/* Curated results */}
                  {inq.status === 'curated' && (
                    <div style={{ borderTop: '0.5px solid var(--rule)', paddingTop: 32, marginTop: 32 }}>
                      {inq.adminNote && (
                        <div style={{ marginBottom: 32 }}>
                          <div className="eyebrow eyebrow-gold" style={{ marginBottom: 12 }}>— A note from our team —</div>
                          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0, maxWidth: 680 }}>{inq.adminNote}</p>
                        </div>
                      )}
                      {curatedVendors.length > 0 && (
                        <>
                          <div className="field-label" style={{ marginBottom: 20 }}>Curated for you</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            {curatedVendors.map(v => (
                              <a key={v.id} href={`#/vendor/${v.id}`}
                                 style={{ display: 'block', border: '0.5px solid var(--rule)', padding: 20, textDecoration: 'none', transition: 'border-color .2s, background .2s' }}
                                 onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'transparent'; }}>
                                <Tile colors={v.tile} style={{ aspectRatio: '3/2', marginBottom: 14 }} />
                                <div className="serif" style={{ fontSize: 18, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.1 }}>{v.name}</div>
                                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                                  {(window.OA_DATA.CATEGORIES.find(c => c.id === v.cat) || {}).label} · {v.city}
                                </div>
                              </a>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

window.MyEvents = MyEvents;
