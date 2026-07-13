// Vendor application page

function VendorApply({ onSubmit }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '', cat: window.OA_DATA.CATEGORIES[0]?.id || '', city: '',
    contactName: '', phone: '', email: '', web: '', ig: '',
    blurb: '', tags: [], yearsInBusiness: '',
  });
  const [tagInput, setTagInput] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const set = (k, val) => setForm(prev => ({ ...prev, [k]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Business name is required.';
    if (!form.city.trim())        e.city        = 'City is required.';
    if (!form.contactName.trim()) e.contactName = 'Contact name is required.';
    if (!form.email.trim())       e.email       = 'Email is required.';
    if (!form.phone.trim())       e.phone       = 'Phone is required.';
    if (!form.blurb.trim())       e.blurb       = 'A short description is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const app = {
      id: 'app' + Date.now().toString(36),
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'pending',
      ...form,
    };
    onSubmit(app);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const categories = window.OA_DATA.CATEGORIES;

  if (submitted) {
    return (
      <main className="page-fade">
        <section className="shell" style={{ paddingTop: 140, paddingBottom: 160, textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ marginBottom: 28 }}>— Application received —</div>
          <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 88px)', margin: '0 0 24px' }}>
            Thank you,<br /><em>{form.contactName.split(' ')[0] || 'there'}.</em>
          </h1>
          <hr className="h-rule" style={{ maxWidth: 120, margin: '0 auto 28px' }} />
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 520, margin: '0 auto 44px' }}>
            Your application for <strong style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 500 }}>{form.name}</strong> has been submitted. Our team will review your details and be in touch within 5–7 business days.
          </p>
          <a href="#/" className="btn ghost">Return to the register <Icon name="arrow" size={14} /></a>
        </section>
      </main>
    );
  }

  return (
    <main className="page-fade">
      {/* Header */}
      <section className="shell" style={{ paddingTop: 80, paddingBottom: 56 }}>
        <SectionMark num="V" label="Vendor Registration" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <h1 className="display hero-anim" style={{ animationDelay: '0.15s', fontSize: 'clamp(48px, 6vw, 84px)', margin: '0 0 24px' }}>
              Apply to<br /><em>the register.</em>
            </h1>
            <hr className="h-rule hero-anim" style={{ animationDelay: '0.3s', maxWidth: 360, margin: '0 0 28px' }} />
            <p className="hero-anim" style={{ animationDelay: '0.4s', fontSize: 16, lineHeight: 1.65, color: 'var(--ink-2)', maxWidth: 420, margin: 0 }}>
              Every vendor on Oikos Arete is personally reviewed by our team. We evaluate reliability, communication, and consistency — not just a polished portfolio.
            </p>
          </div>
          <aside className="hero-anim" style={{ animationDelay: '0.2s', borderTop: '0.5px solid var(--rule)', paddingTop: 24 }}>
            {[
              ['01', 'Submit your details below'],
              ['02', 'Our team reviews your application'],
              ['03', 'We may request a portfolio or call'],
              ['04', 'Approval & listing on the register'],
            ].map(([n, l]) => (
              <div key={n} style={{ display: 'flex', gap: 18, marginBottom: 20, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>— {n}</span>
                <span>{l}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Form */}
      <section className="shell" style={{ paddingBottom: 100 }}>
        <div style={{ borderTop: '0.5px solid var(--ink)', paddingTop: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            <ApplyField label="Business / House Name *" error={errors.name} colSpan={2}>
              <input className="field" value={form.name}
                     onChange={e => { set('name', e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                     placeholder="e.g. Maison Adaeze"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Category *">
              <select className="field" value={form.cat} onChange={e => set('cat', e.target.value)} style={{ width: '100%' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </ApplyField>

            <ApplyField label="City *" error={errors.city}>
              <input className="field" value={form.city}
                     onChange={e => { set('city', e.target.value); setErrors(p => ({ ...p, city: '' })); }}
                     placeholder="e.g. Accra"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Contact Name *" error={errors.contactName}>
              <input className="field" value={form.contactName}
                     onChange={e => { set('contactName', e.target.value); setErrors(p => ({ ...p, contactName: '' })); }}
                     placeholder="Your full name"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Years in Business">
              <input className="field" value={form.yearsInBusiness}
                     onChange={e => set('yearsInBusiness', e.target.value)}
                     placeholder="e.g. 5"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Phone *" error={errors.phone}>
              <input className="field" value={form.phone}
                     onChange={e => { set('phone', e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                     placeholder="+233 24 000 0000"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Email *" error={errors.email}>
              <input className="field" value={form.email}
                     onChange={e => { set('email', e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                     placeholder="contact@yourhouse.co"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Website">
              <input className="field" value={form.web}
                     onChange={e => set('web', e.target.value)}
                     placeholder="yourhouse.co"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Instagram">
              <input className="field" value={form.ig}
                     onChange={e => set('ig', e.target.value)}
                     placeholder="@yourhouse"
                     style={{ width: '100%' }} />
            </ApplyField>

            <ApplyField label="Tell us about your work *" error={errors.blurb} colSpan={2}>
              <textarea className="field" value={form.blurb}
                        onChange={e => { set('blurb', e.target.value); setErrors(p => ({ ...p, blurb: '' })); }}
                        placeholder="Describe your services, your approach, and what makes your work distinct…"
                        style={{ width: '100%', height: 130, padding: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, resize: 'vertical' }} />
            </ApplyField>

            <ApplyField label="Tags / Specialities" colSpan={2}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {form.tags.map(t => (
                  <span key={t} className="chip" style={{ paddingRight: 8 }}>
                    {t}
                    <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, marginLeft: 4 }}
                            onClick={() => set('tags', form.tags.filter(x => x !== t))}>
                      <Icon name="x" size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <input className="field" value={tagInput}
                     onChange={e => setTagInput(e.target.value)}
                     placeholder="Type a tag and press Enter — e.g. weddings, fine dining, outdoor"
                     style={{ width: '100%' }}
                     onKeyDown={e => {
                       if (e.key === 'Enter' && tagInput.trim()) {
                         set('tags', [...form.tags, tagInput.trim()]);
                         setTagInput('');
                         e.preventDefault();
                       }
                     }} />
            </ApplyField>

          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{ marginTop: 24, padding: '14px 20px', border: '0.5px solid var(--burgundy)', color: 'var(--burgundy)', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
              Please complete all required fields marked with * before submitting.
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 44, paddingTop: 32, borderTop: '0.5px solid var(--rule)' }}>
            <button className="btn gold" onClick={handleSubmit}>
              Submit application <Icon name="arrow" size={14} />
            </button>
            <a href="#/" className="btn ghost">Cancel</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ApplyField({ label, children, error, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan === 2 ? 'span 2' : 'auto' }}>
      <label className="field-label">{label}</label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: 'var(--burgundy)', margin: '6px 0 0', fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>{error}</p>
      )}
    </div>
  );
}

window.VendorApply = VendorApply;
