// Browse — search + filters + vendor grid

function VendorCard({ vendor, isFav, onFav, onShortlist, onOpen }) {
  const cat = window.OA_DATA.CATEGORIES.find(c => c.id === vendor.cat);
  const monogram = vendor.name.split(' ').map(w => w[0]).slice(0,2).join('');
  return (
    <article className="vendor-card" onClick={() => onOpen(vendor.id)}>
      <div className="vc-tile">
        <Tile colors={vendor.tile} monogram={monogram} style={{ height: '100%' }} />
        <div className="actions" onClick={e => e.stopPropagation()}>
          <button className={`icon-btn ${isFav ? 'active' : ''}`} aria-label="Favorite"
                  onClick={() => onFav(vendor.id)}>
            <Icon name={isFav ? 'heart-fill' : 'heart'} size={15} />
          </button>
          <button className="icon-btn" aria-label="Add to shortlist"
                  onClick={() => onShortlist(vendor.id)}>
            <Icon name="plus" size={15} />
          </button>
        </div>
      </div>
      <div className="vc-meta">
        <div className="vc-cat">
          <span>{cat?.label}</span>
          <TierPip tier={vendor.tier} />
        </div>
        <h3 className="vc-name">{vendor.name}</h3>
        <div className="vc-loc">
          <span><Icon name="pin" size={11} stroke={1.2} /> &nbsp;{vendor.city}</span>
          <span className="rating"><span className="star">✦</span> &nbsp;{vendor.rating.toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
}

function Browse({ favorites, onFav, onShortlist, onOpen, lists, onCreateList, onAddTo }) {
  const { CATEGORIES, CITIES, EVENT_TYPES, VENDORS } = window.OA_DATA;
  const params = React.useMemo(() => {
    const q = window.location.hash.split('?')[1] || '';
    return Object.fromEntries(new URLSearchParams(q));
  }, [window.location.hash]);

  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [city, setCity] = React.useState('all');
  const [tier, setTier] = React.useState(0);
  const [sort, setSort] = React.useState('curated');
  const [shortlistTarget, setShortlistTarget] = React.useState(null);

  const eventLabel = params.event && EVENT_TYPES.find(e => e.id === params.event)?.label;

  const filtered = React.useMemo(() => {
    let arr = VENDORS.filter(v => {
      if (cat !== 'all' && v.cat !== cat) return false;
      if (city !== 'all' && v.city !== city) return false;
      if (tier && v.tier !== tier) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!v.name.toLowerCase().includes(q) &&
            !v.tags.some(t => t.toLowerCase().includes(q)) &&
            !v.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sort === 'rating') arr = [...arr].sort((a,b) => b.rating - a.rating);
    if (sort === 'az') arr = [...arr].sort((a,b) => a.name.localeCompare(b.name));
    return arr;
  }, [query, cat, city, tier, sort]);

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <SectionMark num="II" label={eventLabel ? `Register — ${eventLabel}` : 'The Register'} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'end', marginBottom: 40 }}>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0 }}>
            {eventLabel ? <>For your <em>{eventLabel.toLowerCase()}.</em></> : <>The <em>register.</em></>}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>
            {filtered.length} of {VENDORS.length} houses. Refine by category, city, or tier — or search by name, specialty, or city.
          </p>
        </div>

        {/* Search bar */}
        <div className="search-bar" style={{ marginBottom: 24 }}>
          <Icon name="search" size={18} stroke={1.2} />
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Search by name, specialty, or city…" />
          {query && <button className="icon-btn" onClick={() => setQuery('')}><Icon name="x" size={14} /></button>}
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)', marginRight: 8 }}>Category —</span>
          <button className={`chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} className={`chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', paddingBottom: 28, borderBottom: '0.5px solid var(--rule)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>City —</span>
            <select className="field" style={{ height: 36, minWidth: 180 }}
                    value={city} onChange={e => setCity(e.target.value)}>
              <option value="all">All cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Tier —</span>
            {[0,1,2,3].map(t => (
              <button key={t} className={`chip ${tier === t ? 'active' : ''}`}
                      style={{ minWidth: 44, justifyContent: 'center' }}
                      onClick={() => setTier(t)}>
                {t === 0 ? 'Any' : '$'.repeat(t)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Sort —</span>
            <select className="field" style={{ height: 36 }}
                    value={sort} onChange={e => setSort(e.target.value)}>
              <option value="curated">Curated</option>
              <option value="rating">Highest rated</option>
              <option value="az">A — Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No vendors match this filter."
            body="Loosen a filter or clear the search to see the full register."
            action={<button className="btn ghost" onClick={() => { setQuery(''); setCat('all'); setCity('all'); setTier(0); }}>Reset filters</button>}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28, paddingTop: 36 }}>
            {filtered.map(v => (
              <VendorCard key={v.id} vendor={v}
                          isFav={favorites.includes(v.id)}
                          onFav={onFav}
                          onShortlist={() => setShortlistTarget(v.id)}
                          onOpen={onOpen} />
            ))}
          </div>
        )}
      </section>

      {shortlistTarget && (
        <ShortlistPicker
          vendorId={shortlistTarget}
          lists={lists}
          onAdd={(listId) => { onAddTo(listId, shortlistTarget); setShortlistTarget(null); }}
          onCreate={(name) => { const id = onCreateList(name); onAddTo(id, shortlistTarget); setShortlistTarget(null); }}
          onClose={() => setShortlistTarget(null)}
        />
      )}
    </main>
  );
}

function ShortlistPicker({ vendorId, lists, onAdd, onCreate, onClose }) {
  const [creating, setCreating] = React.useState(lists.length === 0);
  const [name, setName] = React.useState('');
  const vendor = window.OA_DATA.VENDORS.find(v => v.id === vendorId)
    || (window.OA_DATA.VENUES || []).find(v => v.id === vendorId);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="eyebrow eyebrow-gold">— Add to shortlist —</div>
        <h3>{vendor.name}</h3>
        {!creating && (
          <>
            <div style={{ borderTop: '0.5px solid var(--rule)', marginTop: 8 }}>
              {lists.map(l => (
                <button key={l.id} onClick={() => onAdd(l.id)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '18px 0', borderBottom: '0.5px solid var(--rule)', background: 'transparent', border: 'none', borderTop: 'none', cursor: 'pointer', borderBottomStyle: 'solid', borderBottomWidth: '0.5px', borderBottomColor: 'var(--rule)' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <span className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{l.name}</span>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                      {l.vendorIds.length} vendors {l.vendorIds.includes(vendorId) ? '· already added' : ''}
                    </span>
                  </span>
                  {l.vendorIds.includes(vendorId)
                    ? <Icon name="check" size={18} />
                    : <Icon name="arrow" size={16} />}
                </button>
              ))}
            </div>
            <button onClick={() => setCreating(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', border: '0.5px solid var(--rule-strong)', padding: '0 16px', height: 40, marginTop: 28, cursor: 'pointer', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'border-color .2s, color .2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule-strong)'; e.currentTarget.style.color = 'var(--ink)'; }}>
              <Icon name="plus" size={12} /> Create new list
            </button>
          </>
        )}
        {creating && (
          <>
            <label className="field-label">List name</label>
            <input className="field" autoFocus value={name} onChange={e => setName(e.target.value)}
                   placeholder="e.g. Sarah's Wedding · Q4 Gala"
                   style={{ width: '100%', height: 52 }}
                   onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onCreate(name.trim()); }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn gold" disabled={!name.trim()} onClick={() => onCreate(name.trim())}
                      style={{ opacity: name.trim() ? 1 : 0.4 }}>
                Create &amp; add <Icon name="arrow" size={13} />
              </button>
              {lists.length > 0 && <button className="btn ghost" onClick={() => setCreating(false)}>Cancel</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.Browse = Browse;
window.ShortlistPicker = ShortlistPicker;
window.VendorCard = VendorCard;
