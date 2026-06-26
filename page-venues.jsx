// Venues — browse/card grid

function VenueCard({ venue, isFav, onFav, onShortlist, onOpen }) {
  const monogram = venue.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <article className="vendor-card" onClick={() => onOpen(venue.id)}>
      <div className="vc-tile">
        <Tile colors={venue.tile} monogram={monogram} style={{ height: '100%' }} />
        <div className="actions" onClick={e => e.stopPropagation()}>
          <button className={`icon-btn ${isFav ? 'active' : ''}`} aria-label="Favorite"
                  onClick={() => onFav(venue.id)}>
            <Icon name={isFav ? 'heart-fill' : 'heart'} size={15} />
          </button>
          <button className="icon-btn" aria-label="Add to shortlist"
                  onClick={() => onShortlist(venue.id)}>
            <Icon name="plus" size={15} />
          </button>
        </div>
      </div>
      <div className="vc-meta">
        <div className="vc-cat">
          <span>{venue.type}</span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-4)' }}>
            up to {venue.capacity.toLocaleString()} guests
          </span>
        </div>
        <h3 className="vc-name">{venue.name}</h3>
        <div className="vc-loc">
          <span><Icon name="pin" size={11} stroke={1.2} /> &nbsp;{venue.locationName}</span>
        </div>
      </div>
    </article>
  );
}

function VenueBrowse({ favorites, onFav, onOpen, lists, onCreateList, onAddTo }) {
  const VENUES = window.OA_DATA.VENUES || [];

  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('curated');
  const [shortlistTarget, setShortlistTarget] = React.useState(null);

  const filtered = React.useMemo(() => {
    let arr = VENUES.filter(v => {
      if (v.disabled) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!v.name.toLowerCase().includes(q) &&
            !v.locationName.toLowerCase().includes(q) &&
            !v.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    if (sort === 'budget-asc')  arr = [...arr].sort((a, b) => a.budgetMin - b.budgetMin);
    if (sort === 'budget-desc') arr = [...arr].sort((a, b) => b.budgetMin - a.budgetMin);
    if (sort === 'capacity')    arr = [...arr].sort((a, b) => b.capacity - a.capacity);
    if (sort === 'az')          arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [query, sort, VENUES]);

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <SectionMark num="III" label="Venues — Accra" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'end', marginBottom: 40 }}>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0 }}>
            The <em>venues.</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>
            {filtered.length} of {VENUES.length} spaces, all in Accra. Search by name, neighbourhood, or character.
          </p>
        </div>

        {/* Search bar */}
        <div className="search-bar" style={{ marginBottom: 24 }}>
          <Icon name="search" size={18} stroke={1.2} />
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Search by name, neighbourhood, or character…" />
          {query && <button className="icon-btn" onClick={() => setQuery('')}><Icon name="x" size={14} /></button>}
        </div>

        {/* Sort row */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', paddingBottom: 28, borderBottom: '0.5px solid var(--rule)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Sort —</span>
            <select className="field" style={{ height: 36 }}
                    value={sort} onChange={e => setSort(e.target.value)}>
              <option value="curated">Curated</option>
              <option value="budget-asc">Budget: Low → High</option>
              <option value="budget-desc">Budget: High → Low</option>
              <option value="capacity">Largest first</option>
              <option value="az">A — Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: 80 }}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No venues match your search."
            body="Try clearing the search to see all Accra venues."
            action={<button className="btn ghost" onClick={() => setQuery('')}>Clear search</button>}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28, paddingTop: 36 }}>
            {filtered.map(v => (
              <VenueCard key={v.id} venue={v}
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

window.VenueBrowse = VenueBrowse;
window.VenueCard = VenueCard;
