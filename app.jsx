// Main app — routing, state, persistence, auth, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "gold"
}/*EDITMODE-END*/;

const FAVS_LIST_ID = 'favorites';

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

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const auth = useAuth();
  const [authPrompt, setAuthPrompt] = React.useState(null); // null | { mode, message, then }

  // State scoped to current user
  const [lists, setLists] = React.useState(() => ensureFavList(loadState(auth.user?.email).lists || []));
  const [vendors, setVendors] = React.useState(() => loadState(auth.user?.email).vendors || window.OA_DATA.VENDORS);
  const [categories, setCategories] = React.useState(() => loadState(auth.user?.email).categories || window.OA_DATA.CATEGORIES);
  const [venues, setVenues] = React.useState(() => loadState(auth.user?.email).venues || window.OA_DATA.VENUES);
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
                  onSaveVendor={saveVendor} onDeleteVendor={deleteVendor}
                  onToggleVendor={toggleVendor}
                  onSaveCategory={saveCategory} onDeleteCategory={deleteCategory} />;
  } else {
    page = <Landing />;
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
