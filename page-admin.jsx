// Admin — manage vendors, categories, vendor applications, and client enquiries

function Admin({ vendors, categories, applications, inquiries, onSaveVendor, onDeleteVendor, onToggleVendor, onSaveCategory, onDeleteCategory, onApproveApplication, onDenyApplication, onUpdateInquiry }) {
  const [tab, setTab] = React.useState('vendors');
  const [editing, setEditing] = React.useState(null); // vendor object or 'new'
  const [editingCat, setEditingCat] = React.useState(null);
  const [viewingApp, setViewingApp] = React.useState(null);
  const [curatingInquiry, setCuratingInquiry] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [filterCat, setFilterCat] = React.useState('all');
  const [appSearch, setAppSearch] = React.useState('');
  const [clientSearch, setClientSearch] = React.useState('');
  const pendingCount = (applications || []).length;
  const pendingInquiries = (inquiries || []).filter(i => i.status === 'pending').length;

  const filtered = vendors.filter(v => {
    if (filterCat !== 'all' && v.cat !== filterCat) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredApps = (applications || []).filter(app => {
    if (!appSearch) return true;
    const q = appSearch.toLowerCase();
    return app.name.toLowerCase().includes(q) ||
           app.contactName.toLowerCase().includes(q) ||
           app.city.toLowerCase().includes(q) ||
           app.email.toLowerCase().includes(q);
  });

  const filteredInquiries = (inquiries || []).filter(inq => {
    if (!clientSearch) return true;
    const q = clientSearch.toLowerCase();
    return inq.userName.toLowerCase().includes(q) ||
           inq.userEmail.toLowerCase().includes(q) ||
           inq.city.toLowerCase().includes(q);
  });

  return (
    <main className="page-fade">
      <section className="shell" style={{ paddingTop: 60, paddingBottom: 32 }}>
        <SectionMark num="IV" label="Concierge — Administration" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0 }}>
            <em>Backstage.</em>
          </h1>
          <div style={{ display: 'flex', gap: 32, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <span><span style={{ color: 'var(--accent)', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>{vendors.filter(v => !v.disabled).length}</span> active</span>
            <span><span style={{ color: 'var(--ink-2)', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>{vendors.filter(v => v.disabled).length}</span> disabled</span>
            <span><span style={{ color: 'var(--burgundy)', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>{categories.length}</span> categories</span>
            {pendingCount > 0 && (
              <span><span style={{ color: '#c47a1e', fontSize: 22, fontFamily: 'var(--serif)', fontStyle: 'italic', verticalAlign: '-2px', marginRight: 6 }}>{pendingCount}</span> pending</span>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="shell" style={{ borderBottom: '0.5px solid var(--rule)', display: 'flex', gap: 0, marginBottom: 32 }}>
        {[
          ['vendors',      'Vendors'],
          ['categories',   'Categories'],
          ['applications', pendingCount > 0     ? `Applications · ${pendingCount}`    : 'Applications'],
          ['clients',      pendingInquiries > 0 ? `Clients · ${pendingInquiries}`     : 'Clients'],
        ].map(([k, l]) => {
          const hasBadge = (k === 'applications' && pendingCount > 0) || (k === 'clients' && pendingInquiries > 0);
          return (
            <button key={k} onClick={() => setTab(k)}
                    style={{ padding: '20px 28px', background: 'transparent', border: 'none', borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent', color: tab === k ? 'var(--ink)' : (hasBadge ? '#c47a1e' : 'var(--ink-3)'), fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '-0.5px' }}>
              {l}
            </button>
          );
        })}
      </section>

      {tab === 'vendors' && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 280, height: 44 }}>
              <Icon name="search" size={16} stroke={1.2} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors…"
                     style={{ fontStyle: 'normal', fontFamily: 'var(--sans)', fontSize: 14 }} />
            </div>
            <select className="field" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ minWidth: 200 }}>
              <option value="all">All categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <button className="btn gold" onClick={() => setEditing('new')}>
              <Icon name="plus" size={13} /> New vendor
            </button>
          </div>

          {/* Table */}
          <div style={{ borderTop: '0.5px solid var(--ink)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 70px 1.6fr 1fr 0.8fr 0.6fr 0.6fr 130px', gap: 16, padding: '14px 12px', borderBottom: '0.5px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
              <span>—</span><span>Mark</span><span>Name</span><span>Category</span><span>City</span><span>Tier</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            {filtered.map((v, i) => {
              const cat = categories.find(c => c.id === v.cat);
              const monogram = v.name.split(' ').map(w => w[0]).slice(0,2).join('');
              return (
                <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '50px 70px 1.6fr 1fr 0.8fr 0.6fr 0.6fr 130px', gap: 16, alignItems: 'center', padding: '14px 12px', borderBottom: '0.5px solid var(--rule)', opacity: v.disabled ? 0.5 : 1 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{String(i+1).padStart(2,'0')}</span>
                  <Tile colors={v.tile} monogram={monogram} style={{ aspectRatio: '1/1', width: 50 }} />
                  <div>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.1 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{v.email}</div>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{cat?.label || '—'}</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{v.city}</span>
                  <TierPip tier={v.tier} />
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: v.disabled ? 'var(--ink-4)' : 'var(--accent)' }}>
                    {v.disabled ? '— Off —' : '— Live —'}
                  </span>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="icon-btn" onClick={() => onToggleVendor(v.id)} aria-label="Toggle">
                      <Icon name={v.disabled ? 'eye-off' : 'eye'} size={14} />
                    </button>
                    <button className="icon-btn" onClick={() => setEditing(v)} aria-label="Edit"><Icon name="edit" size={14} /></button>
                    <button className="icon-btn" onClick={() => { if (confirm(`Delete ${v.name}?`)) onDeleteVendor(v.id); }} aria-label="Delete"><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-3)' }}>No vendors match.</div>
            )}
          </div>
        </section>
      )}

      {tab === 'categories' && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: 0 }}>Vendor types shown across the register and event selector.</p>
            <button className="btn gold" onClick={() => setEditingCat({ id: '', label: '', plural: '' })}>
              <Icon name="plus" size={13} /> New category
            </button>
          </div>
          <div style={{ borderTop: '0.5px solid var(--ink)' }}>
            {categories.map((c, i) => {
              const count = vendors.filter(v => v.cat === c.id).length;
              return (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 2fr 100px 130px', gap: 24, alignItems: 'center', padding: '20px 12px', borderBottom: '0.5px solid var(--rule)' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>§ {String(i+1).padStart(2,'0')}</span>
                  <span className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>{c.plural}</span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{count} vendor{count===1?'':'s'}</span>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="icon-btn" onClick={() => setEditingCat(c)}><Icon name="edit" size={14} /></button>
                    <button className="icon-btn" onClick={() => { if (count > 0) { alert(`Cannot delete: ${count} vendors use this category.`); return; } if (confirm(`Delete "${c.label}"?`)) onDeleteCategory(c.id); }}><Icon name="trash" size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'applications' && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          {(applications || []).length === 0 ? (
            <EmptyState
              title="No pending applications."
              body="When vendors apply through the register, their submissions will appear here for review."
            />
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div className="search-bar" style={{ maxWidth: 480, height: 44 }}>
                  <Icon name="search" size={16} stroke={1.2} />
                  <input value={appSearch} onChange={e => setAppSearch(e.target.value)}
                         placeholder="Search by business, contact, city, or email…"
                         style={{ fontStyle: 'normal', fontFamily: 'var(--sans)', fontSize: 14 }} />
                </div>
              </div>
            <div style={{ borderTop: '0.5px solid var(--ink)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1.6fr 1fr 0.8fr 1fr 160px', gap: 16, padding: '14px 12px', borderBottom: '0.5px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                <span>Date</span><span>Business</span><span>Category</span><span>City</span><span>Contact</span><span style={{ textAlign: 'right' }}>Actions</span>
              </div>
              {filteredApps.map((app) => {
                const cat = categories.find(c => c.id === app.cat);
                return (
                  <div key={app.id} style={{ display: 'grid', gridTemplateColumns: '140px 1.6fr 1fr 0.8fr 1fr 160px', gap: 16, alignItems: 'center', padding: '18px 12px', borderBottom: '0.5px solid var(--rule)' }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{app.submittedAt}</span>
                    <div>
                      <div className="serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.1 }}>{app.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{app.email}</div>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{cat?.label || app.cat}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{app.city}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{app.contactName}</span>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" title="View details" onClick={() => setViewingApp(app)}>
                        <Icon name="eye" size={14} />
                      </button>
                      <button className="icon-btn" title="Approve" style={{ color: 'var(--accent)' }}
                              onClick={() => onApproveApplication(app)}>
                        <Icon name="check" size={14} />
                      </button>
                      <button className="icon-btn" title="Deny" style={{ color: 'var(--burgundy)' }}
                              onClick={() => { if (confirm(`Deny application from ${app.name}?`)) onDenyApplication(app.id); }}>
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredApps.length === 0 && (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-3)' }}>No applications match.</div>
              )}
            </div>
            </>
          )}
        </section>
      )}

      {tab === 'clients' && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          {(inquiries || []).length === 0 ? (
            <EmptyState title="No client enquiries yet."
                        body="When clients submit event details from the homepage, their enquiries will appear here for curation." />
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div className="search-bar" style={{ maxWidth: 480, height: 44 }}>
                  <Icon name="search" size={16} stroke={1.2} />
                  <input value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                         placeholder="Search by client name, email, or city…"
                         style={{ fontStyle: 'normal', fontFamily: 'var(--sans)', fontSize: 14 }} />
                </div>
              </div>
              <div style={{ borderTop: '0.5px solid var(--ink)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1.4fr 1fr 0.8fr 0.8fr 100px 140px', gap: 16, padding: '14px 12px', borderBottom: '0.5px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                  <span>Date</span><span>Client</span><span>Event type</span><span>City</span><span>Guests</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
                </div>
                {filteredInquiries.map((inq) => {
                  const eventLabel = (window.OA_DATA.EVENT_TYPES.find(t => t.id === inq.eventType) || {}).label || inq.eventType;
                  return (
                    <div key={inq.id} style={{ display: 'grid', gridTemplateColumns: '130px 1.4fr 1fr 0.8fr 0.8fr 100px 140px', gap: 16, alignItems: 'center', padding: '16px 12px', borderBottom: '0.5px solid var(--rule)' }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{inq.submittedAt}</span>
                      <div>
                        <div className="serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.1 }}>{inq.userName}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{inq.userEmail}</div>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{eventLabel}</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{inq.city}</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{inq.guestCount || '—'}</span>
                      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: inq.status === 'curated' ? 'var(--accent)' : '#c47a1e' }}>
                        {inq.status === 'curated' ? '— Done —' : '— Pending —'}
                      </span>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="icon-btn" title="View & Curate" onClick={() => setCuratingInquiry(inq)}>
                          <Icon name="edit" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredInquiries.length === 0 && (
                  <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink-3)' }}>No enquiries match.</div>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {editing && (
        <VendorEditor vendor={editing === 'new' ? null : editing}
                      categories={categories}
                      onClose={() => setEditing(null)}
                      onSave={v => { onSaveVendor(v); setEditing(null); }} />
      )}
      {editingCat && (
        <CategoryEditor category={editingCat}
                        onClose={() => setEditingCat(null)}
                        onSave={c => { onSaveCategory(c); setEditingCat(null); }} />
      )}
      {viewingApp && (
        <ApplicationViewer app={viewingApp} categories={categories}
                           onClose={() => setViewingApp(null)}
                           onApprove={() => { onApproveApplication(viewingApp); setViewingApp(null); }}
                           onDeny={() => { if (confirm(`Deny application from ${viewingApp.name}?`)) { onDenyApplication(viewingApp.id); setViewingApp(null); } }} />
      )}
      {curatingInquiry && (
        <CurationModal inquiry={curatingInquiry} vendors={vendors} categories={categories}
                       onClose={() => setCuratingInquiry(null)}
                       onSave={(updated) => { onUpdateInquiry(updated); setCuratingInquiry(null); }} />
      )}
    </main>
  );
}

function VendorEditor({ vendor, categories, onClose, onSave }) {
  const [v, setV] = React.useState(vendor || {
    id: 'v' + Date.now().toString(36),
    name: '', cat: categories[0]?.id || '', city: '', tier: 2, rating: 4.5,
    tags: [], blurb: '', phone: '', email: '', web: '', ig: '',
    tile: ['#0E0E0C', '#A88A4A'], disabled: false,
  });
  const [tagInput, setTagInput] = React.useState('');
  const set = (k, val) => setV(prev => ({ ...prev, [k]: val }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="eyebrow eyebrow-gold">— {vendor ? 'Edit vendor' : 'New vendor'} —</div>
        <h3>{v.name || 'Untitled house'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
          <Field label="Name" colSpan={2}><input className="field" value={v.name} onChange={e => set('name', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Category">
            <select className="field" value={v.cat} onChange={e => set('cat', e.target.value)} style={{ width: '100%' }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="City"><input className="field" value={v.city} onChange={e => set('city', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Tier (1–3)">
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3].map(t => <button key={t} className={`chip ${v.tier === t ? 'active' : ''}`} onClick={() => set('tier', t)}>{'$'.repeat(t)}</button>)}
            </div>
          </Field>
          <Field label="Rating (0–5)"><input type="number" min={0} max={5} step={0.05} className="field" value={v.rating} onChange={e => set('rating', Number(e.target.value))} style={{ width: '100%' }} /></Field>
          <Field label="Blurb" colSpan={2}>
            <textarea className="field" value={v.blurb} onChange={e => set('blurb', e.target.value)}
                      style={{ width: '100%', height: 90, padding: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, resize: 'vertical' }} />
          </Field>
          <Field label="Tags" colSpan={2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {v.tags.map(t => (
                <span key={t} className="chip" style={{ paddingRight: 8 }}>{t} <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, marginLeft: 4 }} onClick={() => set('tags', v.tags.filter(x => x !== t))}><Icon name="x" size={10} /></button></span>
              ))}
            </div>
            <input className="field" value={tagInput} onChange={e => setTagInput(e.target.value)}
                   placeholder="Add tag, press Enter" style={{ width: '100%' }}
                   onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { set('tags', [...v.tags, tagInput.trim()]); setTagInput(''); } }} />
          </Field>
          <Field label="Phone"><input className="field" value={v.phone} onChange={e => set('phone', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Email"><input className="field" value={v.email} onChange={e => set('email', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Website"><input className="field" value={v.web} onChange={e => set('web', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Instagram"><input className="field" value={v.ig} onChange={e => set('ig', e.target.value)} style={{ width: '100%' }} /></Field>
          <Field label="Tile color (dark)"><input type="color" value={v.tile[0]} onChange={e => set('tile', [e.target.value, v.tile[1]])} style={{ width: 80, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }} /></Field>
          <Field label="Tile color (accent)"><input type="color" value={v.tile[1]} onChange={e => set('tile', [v.tile[0], e.target.value])} style={{ width: 80, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }} /></Field>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '0.5px solid var(--rule)' }}>
          <button className="btn gold" onClick={() => onSave(v)} disabled={!v.name.trim()} style={{ opacity: v.name.trim() ? 1 : 0.4 }}>
            Save vendor <Icon name="check" size={13} />
          </button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function CategoryEditor({ category, onClose, onSave }) {
  const [c, setC] = React.useState(category);
  const isNew = !c.id;
  const set = (k, val) => setC(prev => ({ ...prev, [k]: val }));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="eyebrow eyebrow-gold">— {isNew ? 'New category' : 'Edit category'} —</div>
        <h3>{c.label || 'Category'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4, marginBottom: 28 }}>
          <Field label="Short label"><input className="field" value={c.label} onChange={e => set('label', e.target.value)} placeholder="DJs" style={{ width: '100%' }} /></Field>
          <Field label="Plural / display"><input className="field" value={c.plural} onChange={e => set('plural', e.target.value)} placeholder="DJs &amp; Selectors" style={{ width: '100%' }} /></Field>
          {isNew && <Field label="ID slug"><input className="field" value={c.id} onChange={e => set('id', e.target.value.toLowerCase().replace(/\s+/g,'-'))} placeholder="djs" style={{ width: '100%' }} /></Field>}
        </div>
        <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '0.5px solid var(--rule)' }}>
          <button className="btn gold" onClick={() => onSave(c)} disabled={!c.label.trim() || !c.id.trim()} style={{ opacity: (c.label.trim() && c.id.trim()) ? 1 : 0.4 }}>
            Save <Icon name="check" size={13} />
          </button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan === 2 ? 'span 2' : 'auto' }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function ApplicationViewer({ app, categories, onClose, onApprove, onDeny }) {
  const cat = categories.find(c => c.id === app.cat);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="eyebrow eyebrow-gold" style={{ marginBottom: 8 }}>— Application · {app.submittedAt} —</div>
        <h3 className="serif" style={{ fontSize: 34, fontWeight: 500, margin: '0 0 4px' }}>{app.name}</h3>
        <p className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 28px' }}>
          {cat?.label || app.cat} · {app.city}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '0.5px solid var(--rule)' }}>
          {[
            ['Contact', app.contactName],
            ['Years in business', app.yearsInBusiness || '—'],
            ['Phone', app.phone],
            ['Email', app.email],
            ['Website', app.web || '—'],
            ['Instagram', app.ig || '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: '14px 0', borderBottom: '0.5px solid var(--rule)' }}>
              <div className="field-label" style={{ marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <div className="field-label" style={{ marginBottom: 8 }}>About their work</div>
          <p className="serif" style={{ fontSize: 17, fontStyle: 'italic', lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
            "{app.blurb}"
          </p>
        </div>

        {app.tags && app.tags.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="field-label" style={{ marginBottom: 8 }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {app.tags.map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 36, paddingTop: 20, borderTop: '0.5px solid var(--rule)' }}>
          <button className="btn gold" onClick={onApprove}>
            Approve & add to register <Icon name="check" size={13} />
          </button>
          <button className="btn" style={{ background: 'var(--burgundy)', borderColor: 'var(--burgundy)', color: '#fff' }} onClick={onDeny}>
            Deny <Icon name="x" size={13} />
          </button>
          <button className="btn ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function CurationModal({ inquiry, vendors, categories, onClose, onSave }) {
  const [note, setNote] = React.useState(inquiry.adminNote || '');
  const [selectedIds, setSelectedIds] = React.useState(inquiry.curatedVendorIds || []);
  const [vendorSearch, setVendorSearch] = React.useState('');

  const EVENT_TYPE_LABELS = Object.fromEntries(window.OA_DATA.EVENT_TYPES.map(t => [t.id, t.label]));
  const CATEGORY_LABELS   = Object.fromEntries(window.OA_DATA.CATEGORIES.map(c => [c.id, c.label]));
  const BUDGET_LABELS = { 'under-5k': 'Under GHS 5,000', '5k-20k': 'GHS 5,000–20,000', '20k-50k': 'GHS 20,000–50,000', '50k-100k': 'GHS 50,000–100,000', 'above-100k': 'Above GHS 100,000' };

  const toggle = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filteredVendors = vendors.filter(v => {
    if (v.disabled) return false;
    if (!vendorSearch) return true;
    return v.name.toLowerCase().includes(vendorSearch.toLowerCase()) || v.city.toLowerCase().includes(vendorSearch.toLowerCase());
  });

  const canSave = selectedIds.length > 0 || note.trim().length > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 820, maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="eyebrow eyebrow-gold" style={{ marginBottom: 8 }}>— Client Enquiry · {inquiry.submittedAt} —</div>
        <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>{inquiry.userName}</h3>
        <p className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 24px' }}>
          {EVENT_TYPE_LABELS[inquiry.eventType] || inquiry.eventType} · {inquiry.city}
          {inquiry.eventDate ? ` · ${inquiry.eventDate}` : ''}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '0.5px solid var(--rule)', marginBottom: 20 }}>
          {[
            ['Guests', inquiry.guestCount || '—'],
            ['Budget', BUDGET_LABELS[inquiry.budget] || '—'],
            ['Vendor types', (inquiry.categories || []).map(id => CATEGORY_LABELS[id] || id).join(', ') || '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ padding: '14px 16px 14px 0', borderBottom: '0.5px solid var(--rule)' }}>
              <div className="field-label" style={{ marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{val}</div>
            </div>
          ))}
        </div>

        {inquiry.details && (
          <div style={{ marginBottom: 24 }}>
            <div className="field-label" style={{ marginBottom: 6 }}>Client note</div>
            <p className="serif" style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>"{inquiry.details}"</p>
          </div>
        )}

        {/* Vendor selection */}
        <div style={{ borderTop: '0.5px solid var(--ink)', paddingTop: 24, marginBottom: 20 }}>
          <div className="field-label" style={{ marginBottom: 12 }}>Curate vendors for this client</div>
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {selectedIds.map(id => {
                const v = vendors.find(x => x.id === id);
                return v ? (
                  <span key={id} className="chip active" style={{ paddingRight: 8 }}>
                    {v.name}
                    <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, marginLeft: 4 }} onClick={() => toggle(id)}>
                      <Icon name="x" size={10} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
          <div className="search-bar" style={{ height: 40, marginBottom: 8 }}>
            <Icon name="search" size={15} stroke={1.2} />
            <input value={vendorSearch} onChange={e => setVendorSearch(e.target.value)}
                   placeholder="Search vendors by name or city…"
                   style={{ fontFamily: 'var(--sans)', fontSize: 13, fontStyle: 'normal' }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto', border: '0.5px solid var(--rule)' }}>
            {filteredVendors.map(v => (
              <div key={v.id} onClick={() => toggle(v.id)}
                   style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '0.5px solid var(--rule)', cursor: 'pointer', background: selectedIds.includes(v.id) ? 'var(--accent-soft)' : 'transparent' }}>
                <div style={{ width: 16, height: 16, border: `0.5px solid ${selectedIds.includes(v.id) ? 'var(--accent)' : 'var(--rule-strong)'}`, background: selectedIds.includes(v.id) ? 'var(--accent)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {selectedIds.includes(v.id) && <Icon name="check" size={10} stroke={2} />}
                </div>
                <span className="serif" style={{ fontSize: 15, fontWeight: 500 }}>{v.name}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-4)', marginLeft: 'auto' }}>
                  {categories.find(c => c.id === v.cat)?.label} · {v.city}
                </span>
              </div>
            ))}
            {filteredVendors.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>No vendors match.</div>
            )}
          </div>
        </div>

        {/* Note to client */}
        <div style={{ marginBottom: 24 }}>
          <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>Note to client</label>
          <textarea className="field" value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Add context on your selections, next steps, or anything helpful for the client…"
                    style={{ width: '100%', height: 90, padding: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '0.5px solid var(--rule)' }}>
          <button className="btn gold" onClick={() => onSave({ ...inquiry, curatedVendorIds: selectedIds, adminNote: note, status: canSave ? 'curated' : inquiry.status })}
                  disabled={!canSave} style={{ opacity: canSave ? 1 : 0.4 }}>
            Send curation to client <Icon name="check" size={13} />
          </button>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

window.Admin = Admin;
