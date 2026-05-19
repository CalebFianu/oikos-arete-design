// Admin — manage vendors + categories

function Admin({ vendors, categories, onSaveVendor, onDeleteVendor, onToggleVendor, onSaveCategory, onDeleteCategory }) {
  const [tab, setTab] = React.useState('vendors');
  const [editing, setEditing] = React.useState(null); // vendor object or 'new'
  const [editingCat, setEditingCat] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [filterCat, setFilterCat] = React.useState('all');

  const filtered = vendors.filter(v => {
    if (filterCat !== 'all' && v.cat !== filterCat) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
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
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="shell" style={{ borderBottom: '0.5px solid var(--rule)', display: 'flex', gap: 0, marginBottom: 32 }}>
        {[['vendors','Vendors'], ['categories','Categories']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
                  style={{ padding: '20px 28px', background: 'transparent', border: 'none', borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent', color: tab === k ? 'var(--ink)' : 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '-0.5px' }}>
            {l}
          </button>
        ))}
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

window.Admin = Admin;
