// Auth — mock email/password sign up + sign in (localStorage)

const AUTH_KEY = 'oa-auth-v1';
const USERS_KEY = 'oa-users-v1';

function loadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { return null; }
}
function saveAuth(user) {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
}
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch (e) { return {}; }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

// Tiny non-cryptographic hash (this is a prototype, not a real backend)
function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function useAuth() {
  const [user, setUser] = React.useState(loadAuth);
  const signUp = ({ name, email, password }) => {
    const users = loadUsers();
    const k = email.toLowerCase().trim();
    if (users[k]) throw new Error('An account already exists for this email.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(k)) throw new Error('Please enter a valid email.');
    users[k] = { name: name.trim() || k.split('@')[0], email: k, ph: hash(password) };
    saveUsers(users);
    const u = { name: users[k].name, email: k };
    saveAuth(u); setUser(u);
    return u;
  };
  const signIn = ({ email, password }) => {
    const users = loadUsers();
    const k = email.toLowerCase().trim();
    const rec = users[k];
    if (!rec) throw new Error('No account found for this email.');
    if (rec.ph !== hash(password)) throw new Error('Incorrect password.');
    const u = { name: rec.name, email: rec.email };
    saveAuth(u); setUser(u);
    return u;
  };
  const signOut = () => { saveAuth(null); setUser(null); };
  return { user, signUp, signIn, signOut };
}

function AuthModal({ initialMode = 'signin', onClose, onSignIn, onSignUp, message }) {
  const [mode, setMode] = React.useState(initialMode);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (mode === 'signup') onSignUp({ name, email, password });
      else onSignIn({ email, password });
      onClose();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}
           style={{ maxWidth: 460, padding: 0, overflow: 'hidden' }}>
        {/* Top ornament */}
        <div style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '32px 40px 28px', position: 'relative' }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 14 }}>
            — Members' Entrance —
          </div>
          <h3 className="serif" style={{ fontFamily: 'var(--serif)', fontSize: 38, fontStyle: 'italic', fontWeight: 500, margin: 0, lineHeight: 1.05, color: 'var(--bg)' }}>
            {mode === 'signup' ? 'Open an account.' : 'Welcome back.'}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(244,239,230,0.65)', margin: '14px 0 0', lineHeight: 1.5 }}>
            {message || (mode === 'signup'
              ? 'Save favourites, build private shortlists, and return to the register on any device.'
              : 'Enter your details to recover your favourites and shortlists.')}
          </p>
          <button onClick={onClose} aria-label="Close"
                  style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: '0.5px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.7)', width: 32, height: 32, cursor: 'pointer' }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <form onSubmit={submit} style={{ padding: '32px 40px 36px' }}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">Name</label>
              <input className="field" autoFocus value={name} onChange={(e) => setName(e.target.value)}
                     placeholder="As you'd like to be addressed"
                     style={{ width: '100%', height: 48, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17 }} />
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Email</label>
            <input className="field" type="email" required autoFocus={mode === 'signin'}
                   value={email} onChange={(e) => setEmail(e.target.value)}
                   placeholder="you@correspondence.co"
                   style={{ width: '100%', height: 48, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17 }} />
          </div>
          <div style={{ marginBottom: 6 }}>
            <label className="field-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="field" type={showPw ? 'text' : 'password'} required
                     value={password} onChange={(e) => setPassword(e.target.value)}
                     placeholder={mode === 'signup' ? 'Minimum 6 characters' : '••••••••'}
                     style={{ width: '100%', height: 48, fontSize: 17, paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Show password"
                      style={{ position: 'absolute', right: 0, top: 0, height: 48, width: 48, background: 'transparent', border: 'none', color: 'var(--ink-3)', cursor: 'pointer' }}>
                <Icon name={showPw ? 'eye-off' : 'eye'} size={15} />
              </button>
            </div>
          </div>

          {err && (
            <p className="mono" style={{ color: 'var(--burgundy)', fontSize: 11, letterSpacing: '0.08em', marginTop: 14, marginBottom: 0, textTransform: 'uppercase' }}>
              — {err}
            </p>
          )}

          <button type="submit" className="btn gold" style={{ width: '100%', justifyContent: 'center', marginTop: 24, height: 52 }}>
            {mode === 'signup' ? 'Create account' : 'Sign in'} <Icon name="arrow" size={13} />
          </button>

          <hr className="h-rule" style={{ margin: '28px 0 22px' }} />

          <p style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', margin: 0 }}>
            {mode === 'signup' ? 'Already a member? ' : 'New here? '}
            <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErr(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--accent)', padding: 0 }}>
              {mode === 'signup' ? 'Sign in instead' : 'Open an account'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

window.useAuth = useAuth;
window.AuthModal = AuthModal;
