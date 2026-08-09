// Main app — routing, state, persistence, auth, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "gold"
}/*EDITMODE-END*/;

const FAVS_LIST_ID = 'favorites';
const APPS_KEY = 'oa-applications';
const INQUIRIES_KEY = 'oa-inquiries';

function loadApplications() {
  try { const raw = localStorage.getItem(APPS_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return [];
}
function saveApplications(apps) {
  try { localStorage.setItem(APPS_KEY, JSON.stringify(apps)); } catch (e) {}
}
function loadInquiries() {
  try { const raw = localStorage.getItem(INQUIRIES_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return [];
}
function saveInquiries(items) {
  try { localStorage.setItem(INQUIRIES_KEY, JSON.stringify(items)); } catch (e) {}
}

// Per-user state key (so different accounts have different favourites/lists)
function stateKey(email) { return 'oa-state-v2::' + (email || 'guest'); }

function defaultFavList() {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return { id: FAVS_LIST_ID, name: 'Favourites', vendorIds: [], createdAt: today, locked: true };
}

function loadState(email) {
  try {
    const raw = localStorage.getItem(stateKey(email));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { lists: [], vendors: null, categories: null };
}
function saveState(email, state) {
  try { localStorage.setItem(stateKey(email), JSON.stringify(state)); } catch (e) {}
}

function ensureFavList(lists) {
  if (lists.find((l) => l.id === FAVS_LIST_ID)) return lists;
  return [defaultFavList(), ...lists];
}

function useHashRoute() {
  const [hash, setHash] = React.useState(window.location.hash || '#/');
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  React.useEffect(() => { window.scrollTo(0, 0); }, [hash]);
  return hash;
}

// ── Floating Action Button ──────────────────────────────────────────
function QuickActions({ lists, onAddNote, user, onSignIn }) {
  const [open, setOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [noteListId, setNoteListId] = React.useState('');
  const [noteText, setNoteText] = React.useState('');

  // Pick first list as default when opening
  const openNotePanel = () => {
    if (!user) { onSignIn(); return; }
    setNoteListId(lists[0]?.id || '');
    setNoteText('');
    setNoteOpen(true);
    setOpen(false);
  };

  const saveQuickNote = () => {
    if (noteText.trim() && noteListId) {
      onAddNote(noteListId, noteText.trim());
      setNoteOpen(false);
      setNoteText('');
    }
  };

  return (
    <>
      {/* Quick-note panel */}
      {noteOpen && (
        <div className="fab-note-panel">
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)' }}>Quick note</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 4 }}
                onClick={() => setNoteOpen(false)}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <label className="field-label">Save to list</label>
            <select value={noteListId} onChange={(e) => setNoteListId(e.target.value)}
              style={{
                width: '100%', height: 44, padding: '0 12px',
                background: 'transparent', border: '0.5px solid var(--rule-strong)',
                color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14,
                outline: 'none', borderRadius: 0, appearance: 'none',
                cursor: 'pointer'
              }}>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div style={{ padding: '14px 22px 22px' }}>
            <textarea autoFocus value={noteText} onChange={(e) => setNoteText(e.target.value)}
              placeholder="What's on your mind?"
              style={{
                width: '100%', minHeight: 90, padding: 12,
                border: '0.5px solid var(--rule-strong)', background: 'transparent',
                color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14,
                lineHeight: 1.6, resize: 'vertical', outline: 'none', borderRadius: 0
              }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn gold"
                disabled={!noteText.trim() || !noteListId}
                style={{ height: 36, padding: '0 16px', fontSize: 11, opacity: (noteText.trim() && noteListId) ? 1 : 0.4 }}
                onClick={saveQuickNote}>
                Save note
              </button>
              <button className="btn ghost" style={{ height: 36, padding: '0 16px', fontSize: 11 }}
                onClick={() => setNoteOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fab-wrap">
        <button className={'fab-trigger' + (open ? ' open' : '')}
          onClick={() => { setOpen((o) => !o); if (noteOpen) setNoteOpen(false); }}
          aria-label="Quick actions">
          <Icon name="plus" size={22} stroke={2} />
        </button>

        <div className={'fab-menu' + (open ? ' visible' : '')}>
          <button className="fab-item" onClick={openNotePanel}>
            <Icon name="edit" size={14} /> Quick note
          </button>
          <a className="fab-item" href="#/lists" onClick={() => setOpen(false)}>
            <Icon name="list" size={14} /> Shortlists
          </a>
          <a className="fab-item" href="#/browse" onClick={() => setOpen(false)}>
            <Icon name="search" size={14} /> Browse vendors
          </a>
          <a className="fab-item" href="#/venues" onClick={() => setOpen(false)}>
            <Icon name="pin" size={14} /> Browse venues
          </a>
        </div>
      </div>
    </>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const auth = useAuth();
  const [authPrompt, setAuthPrompt] = React.useState(null); // null | { mode, message, then }

  // State scoped to current user
  const [lists, setLists] = React.useState(() => ensureFavList(loadState(auth.user?.email).lists || []));
  const [vendors, setVendors] = React.useState(() => loadState(auth.user?.email).vendors || window.OA_DATA.VENDORS);
  const [categories, setCategories] = React.useState(() => loadState(auth.user?.email).categories || window.OA_DATA.CATEGORIES);
  const [venues, setVenues] = React.useState(() => loadState(auth.user?.email).venues || window.OA_DATA.VENUES);
  const [applications, setApplications] = React.useState(loadApplications);
  const [inquiries, setInquiries] = React.useState(loadInquiries);
  const [shortlistTarget, setShortlistTarget] = React.useState(null);
  const [toast, setToast] = React.useState('');

  // When auth user changes, rehydrate state for that user
  const lastEmailRef = React.useRef(auth.user?.email || null);
  React.useEffect(() => {
    const email = auth.user?.email || null;
    if (email === lastEmailRef.current) return;
    lastEmailRef.current = email;
    const s = loadState(email);
    setLists(ensureFavList(s.lists || []));
    if (s.vendors) setVendors(s.vendors);
    if (s.categories) setCategories(s.categories);
    if (s.venues) setVenues(s.venues);
  }, [auth.user]);

  // Persist
  React.useEffect(() => {
    saveState(auth.user?.email, { lists, vendors, categories, venues });
  }, [lists, vendors, categories, venues, auth.user]);

  React.useEffect(() => { saveApplications(applications); }, [applications]);
  React.useEffect(() => { saveInquiries(inquiries); }, [inquiries]);

  React.useEffect(() => {
    window.OA_DATA.VENDORS = vendors;
    window.OA_DATA.CATEGORIES = categories;
    window.OA_DATA.VENUES = venues;
  }, [vendors, categories, venues]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    document.documentElement.dataset.accent = t.accent;
  }, [t.dark, t.accent]);

  const hash = useHashRoute();
  const route = hash.split('?')[0].replace('#', '') || '/';

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(''), 2400);
  };

  // Derived favorites = vendors in the Favourites list
  const favorites = React.useMemo(() => {
    const f = lists.find((l) => l.id === FAVS_LIST_ID);
    return f ? f.vendorIds : [];
  }, [lists]);

  const requireAuth = (action, message) => {
    if (auth.user) { action(); return; }
    setAuthPrompt({ mode: 'signin', message, then: action });
  };

  // ── Actions ─────────────────────────────────────────
  const toggleFav = (id) => {
    requireAuth(() => {
      setLists((prev) => prev.map((l) => {
        if (l.id !== FAVS_LIST_ID) return l;
        const has = l.vendorIds.includes(id);
        showToast(has ? 'Removed from Favourites' : 'Added to Favourites');
        return { ...l, vendorIds: has ? l.vendorIds.filter((x) => x !== id) : [...l.vendorIds, id] };
      }));
    }, 'Sign in to save favourites and build private shortlists.');
  };

  const createList = (name) => {
    const id = 'l' + Date.now().toString(36);
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setLists((prev) => [...prev, { id, name, vendorIds: [], createdAt: today }]);
    showToast(`Created "${name}"`);
    return id;
  };

  const renameList = (id, name) => setLists((prev) => prev.map((l) => l.id === id && !l.locked ? { ...l, name } : l));
  const deleteList = (id) => {
    setLists((prev) => {
      const target = prev.find((l) => l.id === id);
      if (target?.locked) { showToast('Favourites cannot be deleted'); return prev; }
      showToast('List deleted');
      return prev.filter((l) => l.id !== id);
    });
  };
  const addToList = (listId, vendorId) => {
    setLists((prev) => prev.map((l) => {
      if (l.id !== listId) return l;
      if (l.vendorIds.includes(vendorId)) { showToast('Already on this list'); return l; }
      showToast(`Added to "${l.name}"`);
      return { ...l, vendorIds: [...l.vendorIds, vendorId] };
    }));
  };
  const removeFromList = (listId, vendorId) => {
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, vendorIds: l.vendorIds.filter((x) => x !== vendorId) } : l));
  };

  const addNote = (listId, text) => {
    const note = { id: 'n' + Date.now().toString(36), text, createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) };
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, notes: [...(l.notes || []), note] } : l));
    showToast('Note added');
  };
  const updateNote = (listId, noteId, text) => {
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, notes: (l.notes || []).map((n) => n.id === noteId ? { ...n, text } : n) } : l));
  };
  const deleteNote = (listId, noteId) => {
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, notes: (l.notes || []).filter((n) => n.id !== noteId) } : l));
    showToast('Note removed');
  };

  const saveVendor = (v) => {
    setVendors((prev) => {
      const idx = prev.findIndex((x) => x.id === v.id);
      if (idx === -1) { showToast('Vendor added'); return [...prev, v]; }
      showToast('Vendor updated');
      const next = [...prev]; next[idx] = v; return next;
    });
  };
  const deleteVendor = (id) => { setVendors((prev) => prev.filter((v) => v.id !== id)); showToast('Vendor deleted'); };
  const toggleVendor = (id) => setVendors((prev) => prev.map((v) => v.id === id ? { ...v, disabled: !v.disabled } : v));

  const saveCategory = (c) => {
    setCategories((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      if (idx === -1) { showToast('Category added'); return [...prev, c]; }
      showToast('Category updated');
      const next = [...prev]; next[idx] = c; return next;
    });
  };
  const deleteCategory = (id) => { setCategories((prev) => prev.filter((c) => c.id !== id)); showToast('Category deleted'); };

  const submitApplication = (app) => {
    setApplications(prev => [...prev, app]);
  };

  const submitInquiry = (inq) => {
    setInquiries(prev => [...prev, inq]);
    showToast('Event enquiry submitted');
  };

  const updateInquiry = (updated) => {
    setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i));
    showToast('Curation sent to client');
  };

  const approveApplication = (app) => {
    const vendor = {
      id: 'v' + Date.now().toString(36),
      name: app.name,
      cat: app.cat,
      city: app.city,
      tier: 2,
      rating: 4.5,
      tags: app.tags || [],
      blurb: app.blurb,
      phone: app.phone,
      email: app.email,
      web: app.web || '',
      ig: app.ig || '',
      tile: ['#0E0E0C', '#A88A4A'],
      disabled: false,
    };
    saveVendor(vendor);
    setApplications(prev => prev.filter(a => a.id !== app.id));
    showToast('Application approved — vendor added to the register');
  };

  const denyApplication = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    showToast('Application denied');
  };

  const requestShortlist = (vendorId) => {
    requireAuth(() => setShortlistTarget(vendorId),
      'Sign in to add vendors to a shortlist.');
  };

  // ── Render route ────────────────────────────────────
  let page;
  if (route.startsWith('/browse')) {
    const publicVendors = vendors.filter((v) => !v.disabled);
    const dataBackup = window.OA_DATA.VENDORS;
    window.OA_DATA.VENDORS = publicVendors;
    page = <Browse favorites={favorites} onFav={toggleFav} onShortlist={requestShortlist}
                   onOpen={(id) => window.location.hash = `#/vendor/${id}`}
                   lists={lists} onCreateList={createList} onAddTo={addToList} />;
    window.OA_DATA.VENDORS = dataBackup;
  } else if (route.startsWith('/vendor/')) {
    const vid = route.replace('/vendor/', '');
    page = <VendorDetail vendorId={vid} favorites={favorites}
                         onFav={toggleFav} onShortlist={requestShortlist}
                         onOpen={(id) => window.location.hash = `#/vendor/${id}`} />;
  } else if (route.startsWith('/lists')) {
    if (!auth.user) {
      page = <main className="page-fade"><section className="shell" style={{ padding: '120px 0' }}>
        <EmptyState title="Sign in to view your shortlists." body="Your favourites and named shortlists are kept against your account."
          action={<button className="btn" onClick={() => setAuthPrompt({ mode: 'signin' })}>Sign in <Icon name="arrow" size={13} /></button>} />
      </section></main>;
    } else {
      page = <Lists lists={lists} favorites={favorites}
                    onCreateList={createList} onRenameList={renameList}
                    onDeleteList={deleteList} onRemoveFromList={removeFromList}
                    onAddNote={addNote} onUpdateNote={updateNote} onDeleteNote={deleteNote}
                    onOpenVendor={(id) => window.location.hash = `#/vendor/${id}`} />;
    }
  } else if (route.startsWith('/venues')) {
    page = <VenueBrowse favorites={favorites} onFav={toggleFav}
                        onOpen={(id) => window.location.hash = `#/venue/${id}`}
                        lists={lists} onCreateList={createList} onAddTo={addToList} />;
  } else if (route.startsWith('/venue/')) {
    const vid = route.replace('/venue/', '');
    page = <VenueDetail venueId={vid} favorites={favorites}
                        onFav={toggleFav} onShortlist={requestShortlist}
                        onOpen={(id) => window.location.hash = `#/venue/${id}`} />;
  } else if (route.startsWith('/admin')) {
    page = <Admin vendors={vendors} categories={categories}
                  applications={applications}
                  inquiries={inquiries}
                  onSaveVendor={saveVendor} onDeleteVendor={deleteVendor}
                  onToggleVendor={toggleVendor}
                  onSaveCategory={saveCategory} onDeleteCategory={deleteCategory}
                  onApproveApplication={approveApplication}
                  onDenyApplication={denyApplication}
                  onUpdateInquiry={updateInquiry} />;
  } else if (route.startsWith('/vendor-apply')) {
    page = <VendorApply onSubmit={submitApplication} />;
  } else if (route.startsWith('/about')) {
    page = <About />;
  } else if (route.startsWith('/my-events')) {
    const userInquiries = inquiries.filter(i => i.userEmail === auth.user?.email);
    page = <MyEvents user={auth.user} inquiries={userInquiries} vendors={vendors}
                     onSignIn={() => setAuthPrompt({ mode: 'signin' })} />;
  } else {
    page = <Landing user={auth.user}
                    onSignIn={() => setAuthPrompt({ mode: 'signin' })}
                    onSubmitInquiry={submitInquiry} />;
  }

  return (
    <>
      <Header route={route === '/' ? '#/' : '#' + route} lists={lists}
              user={auth.user}
              dark={t.dark}
              onToggleDark={() => setTweak('dark', !t.dark)}
              onSignIn={() => setAuthPrompt({ mode: 'signin' })}
              onSignOut={auth.signOut} />
      {page}
      <Footer />

      {shortlistTarget && (
        <ShortlistPicker vendorId={shortlistTarget} lists={lists}
          onAdd={(listId) => { addToList(listId, shortlistTarget); setShortlistTarget(null); }}
          onCreate={(name) => { const id = createList(name); addToList(id, shortlistTarget); setShortlistTarget(null); }}
          onClose={() => setShortlistTarget(null)} />
      )}

      {authPrompt && (
        <AuthModal initialMode={authPrompt.mode} message={authPrompt.message}
          onClose={() => setAuthPrompt(null)}
          onSignIn={(c) => { auth.signIn(c); setTimeout(() => authPrompt.then?.(), 0); }}
          onSignUp={(c) => { auth.signUp(c); setTimeout(() => authPrompt.then?.(), 0); }} />
      )}

      <QuickActions lists={lists} onAddNote={addNote}
        user={auth.user} onSignIn={() => setAuthPrompt({ mode: 'signin', message: 'Sign in to save notes to your shortlists.' })} />

      {toast && <div className="toast">{toast}</div>}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark}
                     onChange={(v) => setTweak('dark', v)} />
        <TweakRadio label="Primary accent" value={t.accent}
                    options={[{ value: 'gold', label: 'Gold' }, { value: 'burgundy', label: 'Burgundy' }]}
                    onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Reset" />
        <TweakButton label="Clear my data" secondary
                     onClick={() => { localStorage.removeItem(stateKey(auth.user?.email)); location.reload(); }} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
