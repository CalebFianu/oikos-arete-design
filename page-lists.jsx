// Lists — named shortlists per event

function Lists({ lists, favorites, onCreateList, onRenameList, onDeleteList, onRemoveFromList, onOpenVendor }) {
  const [activeId, setActiveId] = React.useState(lists[0]?.id || null);
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [renaming, setRenaming] = React.useState(null);

  React.useEffect(() => {
    if (!lists.find((l) => l.id === activeId)) setActiveId(lists[0]?.id || null);
  }, [lists]);

  const active = lists.find((l) => l.id === activeId);
  const activeItems = active ? active.vendorIds.map((id) => {
    const vendor = window.OA_DATA.VENDORS.find((v) => v.id === id);
    if (vendor) return { ...vendor, _kind: 'vendor' };
    const venue = (window.OA_DATA.VENUES || []).find((v) => v.id === id);
    if (venue) return { ...venue, _kind: 'venue' };
    return null;
  }).filter(Boolean) : [];

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <SectionMark num="III" label="Private Shortlists" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'end', marginBottom: 24 }}>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0 }}>
            Your <em>shortlists.</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>Build a list per event — keep your wedding vendors separate from your gala vendors. Each list collects the houses you mean to reach out to.

          </p>
        </div>
      </section>

      <section className="shell" style={{ paddingBottom: 80 }}>
        {lists.length === 0 ?
        <EmptyState
          title="No shortlists yet."
          body="Create a list to begin gathering vendors. You can name it after the event — the wedding, the gala, the milestone."
          action={
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn" onClick={() => setCreating(true)}>
                  <Icon name="plus" size={13} /> Create your first list
                </button>
                <a href="#/browse" className="btn ghost">Browse register</a>
              </div>
          } /> :


        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 60, alignItems: 'start' }}>
            {/* Sidebar */}
            <aside style={{ borderTop: '0.5px solid var(--ink)' }}>
              {lists.map((l) =>
            <button key={l.id} onClick={() => setActiveId(l.id)}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '20px 16px', background: activeId === l.id ? 'var(--accent-soft)' : 'transparent', border: 'none', borderBottom: '0.5px solid var(--rule)', textAlign: 'left', cursor: 'pointer', borderLeft: activeId === l.id ? `2px solid var(--accent)` : '2px solid transparent', transition: 'all .2s' }}>
                  <span className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {l.locked && <Icon name="heart-fill" size={12} stroke={1} />}
                    {l.name}
                  </span>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                    {l.vendorIds.length} {l.vendorIds.length === 1 ? 'item' : 'items'}
                  </span>
                </button>
            )}
              <button onClick={() => setCreating(true)}
            style={{ width: '100%', padding: '20px 16px', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', cursor: 'pointer' }}>
                <Icon name="plus" size={14} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>New list</span>
              </button>
            </aside>

            {/* Active list */}
            <div>
              {active &&
            <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '0.5px solid var(--rule)', paddingBottom: 24, marginBottom: 32 }}>
                    <div>
                      {renaming === active.id ?
                  <input autoFocus className="field" value={active.name}
                  onChange={(e) => onRenameList(active.id, e.target.value)}
                  onBlur={() => setRenaming(null)}
                  onKeyDown={(e) => {if (e.key === 'Enter') setRenaming(null);}}
                  style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 40, height: 'auto', padding: '4px 12px', border: '0.5px solid var(--accent)' }} /> :

                  <h2 className="display" style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', margin: 0 }} onClick={() => setRenaming(active.id)}>
                          <em>{active.name}</em>
                        </h2>
                  }
                      <p className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: '14px 0 0' }}>
                        {active.vendorIds.length} {active.vendorIds.length === 1 ? 'item' : 'items'} · created {active.createdAt}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {!active.locked && <button className="icon-btn" onClick={() => setRenaming(active.id)} aria-label="Rename"><Icon name="edit" size={14} /></button>}
                      {!active.locked && <button className="icon-btn" onClick={() => {if (confirm(`Delete "${active.name}"?`)) onDeleteList(active.id);}} aria-label="Delete"><Icon name="trash" size={14} /></button>}
                      {active.locked && <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', border: '0.5px solid var(--accent)', height: 38 }}><Icon name="heart-fill" size={11} /> Default list</span>}
                    </div>
                  </div>

                  {activeItems.length === 0 ?
              <EmptyState
                title="This list is empty."
                body="Browse vendors or venues and tap the + to add them here."
                action={<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <a href="#/browse" className="btn">Browse vendors <Icon name="arrow" size={13} /></a>
                  <a href="#/venues" className="btn ghost">Browse venues <Icon name="arrow" size={13} /></a>
                </div>} /> :


              <div style={{ borderTop: '0.5px solid var(--ink)' }}>
                      {activeItems.map((v, i) => {
                  const monogram = v.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
                  const isVenue = v._kind === 'venue';
                  const sublabel = isVenue
                    ? v.locationName
                    : (() => { const cat = window.OA_DATA.CATEGORIES.find((c) => c.id === v.cat); return `${v.city} · ✦ ${v.rating.toFixed(2)}`; })();
                  const typeLabel = isVenue
                    ? v.type
                    : (window.OA_DATA.CATEGORIES.find((c) => c.id === v.cat)?.label);
                  const detailHref = isVenue ? `#/venue/${v.id}` : `#/vendor/${v.id}`;
                  return (
                    <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '50px 110px 1fr 140px 100px 60px', gap: 24, alignItems: 'center', padding: '20px 0', borderBottom: '0.5px solid var(--rule)' }}>
                            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', color: 'var(--ink-4)' }}>— {String(i + 1).padStart(2, '0')}</span>
                            <Tile colors={v.tile} monogram={monogram} style={{ aspectRatio: '1/1', width: 90 }} />
                            <div>
                              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 4 }}>{typeLabel}</div>
                              <a href={detailHref} className="serif" style={{ fontSize: 26, fontWeight: 500, color: 'var(--ink)', display: 'block', lineHeight: 1.05 }}>{v.name}</a>
                              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{sublabel}</span>
                            </div>
                            <span>{isVenue
                              ? <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{v.budgetCurrency} {v.budgetMin.toLocaleString()}+</span>
                              : <TierPip tier={v.tier} />}
                            </span>
                            <a href={detailHref} className="btn-text" style={{ borderBottom: 'none', fontSize: 11 }}>View <Icon name="arrow" size={11} /></a>
                            <button className="icon-btn" aria-label="Remove" onClick={() => onRemoveFromList(active.id, v.id)}><Icon name="x" size={14} /></button>
                          </div>);

                })}
                      <div style={{ paddingTop: 36, display: 'flex', gap: 24, alignItems: 'center' }}>
                        <a href="#/browse" className="btn-text"><Icon name="plus" size={12} /> Add vendors</a>
                        <a href="#/venues" className="btn-text"><Icon name="plus" size={12} /> Add venues</a>
                      </div>
                    </div>
              }
                </>
            }
            </div>
          </div>
        }
      </section>

      {creating &&
      <div className="modal-backdrop" onClick={() => setCreating(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="eyebrow eyebrow-gold">— New shortlist —</div>
            <h3>Name this list</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.5, margin: '0 0 24px' }}>
              We suggest naming it after the event itself — "Sarah's Wedding," "Q4 Gala," or "Mum's 60th."
            </p>
            <input className="field" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="Event name…" style={{ width: '100%', height: 52 }}
          onKeyDown={(e) => {if (e.key === 'Enter' && newName.trim()) {const id = onCreateList(newName.trim());setActiveId(id);setNewName('');setCreating(false);}}} />
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn gold" disabled={!newName.trim()}
            style={{ opacity: newName.trim() ? 1 : 0.4 }}
            onClick={() => {const id = onCreateList(newName.trim());setActiveId(id);setNewName('');setCreating(false);}}>
                Create list <Icon name="arrow" size={13} />
              </button>
              <button className="btn ghost" onClick={() => setCreating(false)}>Cancel</button>
            </div>
          </div>
        </div>
      }
    </main>);

}

window.Lists = Lists;